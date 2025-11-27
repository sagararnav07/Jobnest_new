import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import messageService from '../api/messageService'

const ChatContext = createContext(null)

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

export const ChatProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth()
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const socketRef = useRef(null)

    // Initialize socket connection
    useEffect(() => {
        if (isAuthenticated && user) {
            const token = localStorage.getItem('token')
            const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'
            
            const newSocket = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket', 'polling']
            })

            newSocket.on('connect', () => {
                console.log('Socket connected')
                setIsConnected(true)
                newSocket.emit('goOnline')
            })

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected')
                setIsConnected(false)
            })

            newSocket.on('newMessage', (data) => {
                // Add new message to current chat if it's from the active conversation
                if (currentChat && data.senderId === currentChat.partnerId) {
                    setMessages(prev => [...prev, data.message])
                }
                // Update conversations list
                loadConversations()
                // Update unread count
                calculateUnreadCount()
            })

            newSocket.on('messageSent', (data) => {
                if (data.success) {
                    setMessages(prev => [...prev, data.message])
                }
            })

            newSocket.on('messagesRead', (data) => {
                // Update message read status
                setMessages(prev => 
                    prev.map(msg => 
                        msg.senderId === user._id ? { ...msg, read: true } : msg
                    )
                )
            })

            newSocket.on('userOnline', (data) => {
                setOnlineUsers(prev => {
                    if (!prev.includes(data.userId)) {
                        return [...prev, data.userId]
                    }
                    return prev
                })
            })

            newSocket.on('userOffline', (data) => {
                setOnlineUsers(prev => prev.filter(id => id !== data.userId))
            })

            newSocket.on('userTyping', (data) => {
                // Handle typing indicator
                if (currentChat && data.senderId === currentChat.partnerId) {
                    setCurrentChat(prev => ({ ...prev, isTyping: true }))
                }
            })

            newSocket.on('userStoppedTyping', (data) => {
                if (currentChat && data.senderId === currentChat.partnerId) {
                    setCurrentChat(prev => ({ ...prev, isTyping: false }))
                }
            })

            socketRef.current = newSocket
            setSocket(newSocket)

            return () => {
                newSocket.close()
                socketRef.current = null
            }
        }
    }, [isAuthenticated, user])

    // Load conversations on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadConversations()
        }
    }, [isAuthenticated])

    // Calculate unread count when conversations change
    useEffect(() => {
        calculateUnreadCount()
    }, [conversations])

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true)
            const response = await messageService.getConversations()
            setConversations(response.conversations || [])
        } catch (err) {
            console.error('Failed to load conversations:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const calculateUnreadCount = useCallback(() => {
        const count = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
        setUnreadCount(count)
    }, [conversations])

    const openChat = useCallback(async (partnerId, partnerName, partnerType) => {
        try {
            setLoading(true)
            setCurrentChat({ partnerId, partnerName, partnerType, isTyping: false })
            
            const response = await messageService.getConversation(partnerId)
            setMessages(response.messages || [])
            
            // Mark messages as read
            await messageService.markAsRead(partnerId)
            if (socketRef.current) {
                socketRef.current.emit('markAsRead', { partnerId })
            }
            
            // Update conversations to clear unread
            loadConversations()
        } catch (err) {
            console.error('Failed to open chat:', err)
        } finally {
            setLoading(false)
        }
    }, [loadConversations])

    const closeChat = useCallback(() => {
        setCurrentChat(null)
        setMessages([])
    }, [])

    const sendMessage = useCallback(async (message) => {
        if (!currentChat || !message.trim()) return

        try {
            if (socketRef.current && isConnected) {
                socketRef.current.emit('sendMessage', {
                    receiverId: currentChat.partnerId,
                    message: message.trim()
                })
            } else {
                // Fallback to REST API
                await messageService.sendMessage(currentChat.partnerId, message.trim())
                // Reload messages
                const response = await messageService.getConversation(currentChat.partnerId)
                setMessages(response.messages || [])
            }
        } catch (err) {
            console.error('Failed to send message:', err)
            throw err
        }
    }, [currentChat, isConnected])

    const sendTyping = useCallback(() => {
        if (socketRef.current && currentChat) {
            socketRef.current.emit('typing', { receiverId: currentChat.partnerId })
        }
    }, [currentChat])

    const sendStopTyping = useCallback(() => {
        if (socketRef.current && currentChat) {
            socketRef.current.emit('stopTyping', { receiverId: currentChat.partnerId })
        }
    }, [currentChat])

    const isUserOnline = useCallback((userId) => {
        return onlineUsers.includes(userId)
    }, [onlineUsers])

    const value = {
        socket,
        isConnected,
        conversations,
        currentChat,
        messages,
        onlineUsers,
        unreadCount,
        loading,
        loadConversations,
        openChat,
        closeChat,
        sendMessage,
        sendTyping,
        sendStopTyping,
        isUserOnline
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContext
