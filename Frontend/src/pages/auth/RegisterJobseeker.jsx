import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Toast } from '../../components/ui'

const RegisterJobseeker = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    
    const [formData, setFormData] = useState({
        name: '',
        emailId: '',
        password: '',
        confirmPassword: '',
        userType: 'Jobseeker'
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' })

    // Validation patterns
    const nameRegex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value) return 'Name is required'
                if (!nameRegex.test(value)) return 'Name must start with capital letter, each word at least 3 letters'
                return ''
            case 'emailId':
                if (!value) return 'Email is required'
                if (!emailRegex.test(value)) return 'Invalid email format'
                return ''
            case 'password':
                if (!value) return 'Password is required'
                if (value.length < 8) return 'Password must be at least 8 characters'
                if (!passwordRegex.test(value)) return 'Password must include uppercase, lowercase, number, and special character'
                return ''
            case 'confirmPassword':
                if (!value) return 'Please confirm your password'
                if (value !== formData.password) return 'Passwords do not match'
                return ''
            default:
                return ''
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate all fields
        const newErrors = {}
        Object.keys(formData).forEach(key => {
            if (key !== 'userType') {
                const error = validateField(key, formData[key])
                if (error) newErrors[key] = error
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)
        try {
            const { confirmPassword, ...registerData } = formData
            await register(registerData)
            navigate('/jobseeker/profile')
        } catch (error) {
            setToast({
                show: true,
                message: error.response?.data?.message || 'Registration failed. Please try again.',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-600 mb-8">Join as a job seeker and find your dream career</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        error={errors.emailId}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        error={errors.password}
                        required
                    />
                    <p className="text-xs text-gray-500 -mt-3">
                        Min 8 characters with uppercase, lowercase, number & special character
                    </p>

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        error={errors.confirmPassword}
                        required
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                    >
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            Sign in
                        </Link>
                    </p>
                    <p className="text-gray-600">
                        Looking to hire?{' '}
                        <Link 
                            to="/register/employer" 
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            Register as Employer
                        </Link>
                    </p>
                </div>
            </motion.div>
        </>
    )
}

export default RegisterJobseeker
