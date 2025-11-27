import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    icon,
    rightIcon,
    helper,
    size = 'md',
    variant = 'default',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    // Size variants
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-5 py-4 text-base',
    }

    // Base input styles - Premium Stripe-inspired design
    const baseInputStyles = `
        w-full rounded-xl border bg-white
        transition-all duration-200 ease-out
        placeholder:text-slate-400
        disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
        ${sizes[size]}
        ${icon ? 'pl-11' : ''}
        ${rightIcon || isPassword ? 'pr-11' : ''}
    `

    // State-based border and focus styles
    const stateStyles = error 
        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
        : isFocused
        ? 'border-[#635bff] ring-4 ring-[#635bff]/10'
        : 'border-slate-200 hover:border-slate-300'

    // Focus handler
    const handleFocus = (e) => {
        setIsFocused(true)
        onFocus?.(e)
    }

    // Blur handler
    const handleBlur = (e) => {
        setIsFocused(false)
        onBlur?.(e)
    }

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label 
                    htmlFor={name} 
                    className="block text-sm font-medium text-slate-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {/* Left Icon */}
                {icon && (
                    <div className={`
                        absolute left-3.5 top-1/2 -translate-y-1/2 
                        pointer-events-none transition-colors duration-200
                        ${isFocused ? 'text-[#635bff]' : 'text-slate-400'}
                    `}>
                        {icon}
                    </div>
                )}

                {/* Input Field */}
                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        ${baseInputStyles}
                        ${stateStyles}
                        focus:outline-none
                    `}
                    {...props}
                />

                {/* Right Icon or Password Toggle */}
                {(rightIcon || isPassword) && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {isPassword ? (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        ) : rightIcon}
                    </div>
                )}

                {/* Focus indicator line */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#635bff] rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isFocused && !error ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                />
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-2 text-sm text-red-500 flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Helper Text */}
            {helper && !error && (
                <p className="mt-2 text-sm text-slate-500">{helper}</p>
            )}
        </div>
    )
}

export default Input
