import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from '../../utils/dayjs'
import { Card, Input, Button, Badge, LoadingSpinner, Toast } from '../../components/ui'
import { useChat, useAuth } from '../../contexts'
import { messageService } from '../../api'

const Messages = () => {
    const { user } = useAuth()
    const { 
        conversations, 
        messages, 
        currentChat,
        sendMessage: contextSendMessage,
        loadConversations,
        openChat,
        closeChat,
        sendTyping,
        sendStopTyping,
        isConnected,
        loading: chatLoading
    } = useChat()

    const [loading, setLoading] = useState(true)
    const [messageText, setMessageText] = useState('')
    const [sending, setSending] = useState(false)
    const [connections, setConnections] = useState([])
    const [showConnections, setShowConnections] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null)

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await loadConversations()
                const connectionsResponse = await messageService.getConnections()
                setConnections(connectionsResponse.users || connectionsResponse.connections || [])
            } catch (error) {
                setToast({
                    show: true,
                    message: 'Failed to load conversations',
                    type: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleConversationSelect = async (conversation) => {
        // Use openChat from context which handles loading messages
        await openChat(conversation.userId, conversation.name, conversation.userType)
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!messageText.trim() || !currentChat) return

        try {
            setSending(true)
            await contextSendMessage(messageText.trim())
            setMessageText('')
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to send message',
                type: 'error'
            })
        } finally {
            setSending(false)
        }
    }

    const handleTyping = (e) => {
        setMessageText(e.target.value)
        
        if (currentChat) {
            sendTyping()
            
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
            
            typingTimeoutRef.current = setTimeout(() => {
                sendStopTyping()
            }, 1000)
        }
    }

    const handleConnectionRequest = async (userId) => {
        try {
            await messageService.sendConnectionRequest(userId)
            setToast({
                show: true,
                message: 'Connection request sent!',
                type: 'success'
            })
        } catch (error) {
            setToast({
                show: true,
                message: error.response?.data?.message || 'Failed to send request',
                type: 'error'
            })
        }
    }

    const isTyping = currentChat && currentChat.isTyping

    if (loading || chatLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <>
            <Toast 
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[calc(100vh-180px)] min-h-[500px]"
            >
                <Card className="h-full p-0 overflow-hidden">
                    <div className="flex h-full">
                        {/* Conversations sidebar */}
                        <div className="w-80 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-xs text-gray-500">
                                            {isConnected ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowConnections(!showConnections)}
                                    className="w-full px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    {showConnections ? 'Back to Conversations' : 'Find Connections'}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {showConnections ? (
                                    <ConnectionsList 
                                        connections={connections}
                                        onConnect={handleConnectionRequest}
                                    />
                                ) : (
                                    <ConversationsList 
                                        conversations={conversations}
                                        currentChat={currentChat}
                                        onSelect={handleConversationSelect}
                                        userId={user?._id}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Chat area */}
                        <div className="flex-1 flex flex-col">
                            {currentChat ? (
                                <>
                                    {/* Chat header */}
                                    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-medium">
                                                {currentChat.partnerName?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {currentChat.partnerName}
                                            </h3>
                                            {isTyping && (
                                                <p className="text-sm text-indigo-600">typing...</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        <AnimatePresence>
                                            {messages.map((message, index) => (
                                                <MessageBubble 
                                                    key={message._id || index}
                                                    message={message}
                                                    isOwn={message.senderId === user?._id || message.sender === user?._id}
                                                />
                                            ))}
                                        </AnimatePresence>
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message input */}
                                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Type a message..."
                                                value={messageText}
                                                onChange={handleTyping}
                                                className="flex-1"
                                            />
                                            <Button type="submit" loading={sending} disabled={!messageText.trim()}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Select a conversation
                                        </h3>
                                        <p className="text-gray-500">
                                            Choose a conversation from the sidebar to start messaging
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </>
    )
}

const ConversationsList = ({ conversations, currentChat, onSelect, userId }) => {
    if (conversations.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm">Start connecting with others!</p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => {
                const partnerId = conversation.partnerId || conversation.userId
                const partnerName = conversation.partnerName || conversation.name
                const isActive = currentChat?.partnerId === partnerId
                const lastMessage = conversation.lastMessage
                
                return (
                    <button
                        key={partnerId}
                        onClick={() => onSelect({ 
                            ...conversation, 
                            userId: partnerId, 
                            name: partnerName 
                        })}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            isActive ? 'bg-indigo-50' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-indigo-600 font-medium">
                                    {partnerName?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900 truncate">
                                        {partnerName}
                                    </h4>
                                    {(lastMessage?.createdAt || conversation.lastMessageAt) && (
                                        <span className="text-xs text-gray-500">
                                            {dayjs(lastMessage?.createdAt || conversation.lastMessageAt).format('HH:mm')}
                                        </span>
                                    )}
                                </div>
                                {(lastMessage?.content || lastMessage?.message || conversation.lastMessage) && (
                                    <p className="text-sm text-gray-500 truncate">
                                        {lastMessage?.sender === userId ? 'You: ' : ''}
                                        {lastMessage?.content || lastMessage?.message || conversation.lastMessage}
                                    </p>
                                )}
                            </div>
                            {conversation.unreadCount > 0 && (
                                <Badge variant="primary" size="sm">
                                    {conversation.unreadCount}
                                </Badge>
                            )}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

const ConnectionsList = ({ connections, onConnect }) => {
    // Handle both 'users' and 'connections' response format
    const users = connections || []
    
    if (users.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>No connections available</p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-gray-100">
            {users.map((user) => (
                <div key={user._id} className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-indigo-600 font-medium">
                                {user.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                                {user.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {user.userType === 'Employeer' ? 'Employer' : user.userType}
                            </p>
                        </div>
                        <button
                            onClick={() => onConnect(user._id)}
                            className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Message
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const MessageBubble = ({ message, isOwn }) => {
    // Handle both content and message field names from backend
    const messageContent = message.content || message.message || ''
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                isOwn 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
            } rounded-2xl px-4 py-2`}>
                <p className="text-sm whitespace-pre-wrap break-words">{messageContent}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {dayjs(message.createdAt).format('HH:mm')}
                </p>
            </div>
        </motion.div>
    )
}

export default Messages
