import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import corporateVideo from '../../assets/video/coroprate.mp4'

const Home = () => {
    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    }

    const floatingAnimation = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden">
            {/* Navigation */}
            <motion.nav 
                className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-xl z-50 border-b border-white/10"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center gap-3">
                            <motion.div 
                                className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-xl font-black text-white">JN</span>
                            </motion.div>
                            <span className="text-2xl font-bold text-white">
                                JobNest
                            </span>
                        </Link>
                        <div className="flex items-center gap-6">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link 
                                    to="/login" 
                                    className="text-white/80 hover:text-white font-semibold transition-colors"
                                >
                                    Login
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link 
                                    to="/register/jobseeker" 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Video Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="absolute w-full h-full object-cover"
                    >
                        <source src={corporateVideo} type="video/mp4" />
                    </video>
                    {/* Overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-purple-900/40"></div>
                </div>

                {/* Animated particles/shapes overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
                        animate={{ 
                            x: [0, 50, 0], 
                            y: [0, 30, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    />
                    <motion.div 
                        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
                        animate={{ 
                            x: [0, -30, 0], 
                            y: [0, -50, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span 
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-semibold mb-8 border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.span
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    ✨
                                </motion.span>
                                AI-Powered Job Matching Platform
                            </motion.span>
                            
                            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] mb-8">
                                Find Your{' '}
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Perfect
                                    </span>
                                    <motion.div
                                        className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </span>
                                <br />
                                <span className="text-white">Career Match</span>
                            </h1>
                            
                            <motion.p 
                                className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                JobNest uses <span className="text-indigo-400 font-semibold">personality-based AI matching</span> to 
                                connect you with opportunities that align with who you are.
                            </motion.p>
                            
                            <motion.div 
                                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                                    <Link 
                                        to="/register/jobseeker"
                                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
                                    >
                                        Find Your Dream Job
                                        <motion.svg 
                                            className="w-6 h-6" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </motion.svg>
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                                    <Link 
                                        to="/register/employer"
                                        className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Hire Top Talent
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div 
                                className="flex flex-wrap items-center justify-center gap-8 lg:gap-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {[
                                    { value: '10K+', label: 'Active Jobs', icon: '💼' },
                                    { value: '5K+', label: 'Companies', icon: '🏢' },
                                    { value: '95%', label: 'Match Rate', icon: '🎯' },
                                    { value: '50K+', label: 'Happy Users', icon: '😊' }
                                ].map((stat, index) => (
                                    <motion.div 
                                        key={stat.label}
                                        className="text-center bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <span className="text-2xl mb-1 block">{stat.icon}</span>
                                        <p className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-white/60">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <motion.div 
                            className="w-1.5 h-3 bg-white/60 rounded-full"
                            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="inline-block px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-semibold mb-4 border border-indigo-500/30">
                            How It Works
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                            Three Steps to Your{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Dream Career
                            </span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            Our AI-powered platform makes finding your perfect job simple and efficient
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Create Your Profile',
                                description: 'Sign up and tell us about yourself - your skills, experience, and career aspirations.',
                                icon: '👤',
                                color: 'from-blue-500 to-indigo-600'
                            },
                            {
                                step: '02',
                                title: 'Take Assessment',
                                description: 'Complete our personality assessment to help us understand your work style and preferences.',
                                icon: '🎯',
                                color: 'from-purple-500 to-pink-600'
                            },
                            {
                                step: '03',
                                title: 'Get Matched',
                                description: 'Receive personalized job recommendations based on your unique profile and personality.',
                                icon: '✨',
                                color: 'from-pink-500 to-orange-500'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.step}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden border border-white/10 group"
                            >
                                <motion.div 
                                    className="absolute top-4 right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, delay: index * 0.5 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl text-3xl mb-6 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                
                                <span className={`text-6xl font-black bg-gradient-to-r ${feature.color} bg-clip-text text-transparent opacity-20 absolute top-4 left-8`}>
                                    {feature.step}
                                </span>
                                
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-white/60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
                
                {/* Testimonials Section - New Premium Addition */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                        animate={{ 
                            x: [0, 50, 0], 
                            y: [0, 30, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    />
                </div>
                
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    {/* Testimonials Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
                                Success Stories
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                                Loved by Job Seekers
                            </h2>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: 'Sarah Chen',
                                    role: 'Product Designer at Stripe',
                                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                                    quote: 'Found my dream job in just 2 weeks! The AI matching is incredibly accurate.'
                                },
                                {
                                    name: 'Marcus Johnson',
                                    role: 'Senior Engineer at Google',
                                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                                    quote: 'The personality assessment helped me find a role that truly fits my work style.'
                                },
                                {
                                    name: 'Emily Rodriguez',
                                    role: 'Marketing Lead at Airbnb',
                                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                                    quote: 'Best job platform I have ever used. The direct employer chat was a game-changer.'
                                }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <img 
                                            src={testimonial.image} 
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                                        />
                                        <div>
                                            <p className="font-semibold text-white">{testimonial.name}</p>
                                            <p className="text-sm text-white/60">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-white/80 italic">"{testimonial.quote}"</p>
                                    <div className="flex gap-1 mt-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">★</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* CTA Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <motion.span 
                            className="inline-block text-6xl mb-6"
                            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                        >
                            🚀
                        </motion.span>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                            Ready to Find Your Perfect Match?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join thousands of job seekers who have found their dream careers through JobNest's 
                            AI-powered matching system.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/register/jobseeker"
                                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                                >
                                    Start Your Journey
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/register/employer"
                                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                                >
                                    Post a Job
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/50 backdrop-blur-md text-white py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <span className="text-xl font-black text-white">JN</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold">JobNest</span>
                                <p className="text-white/50 text-sm">Find Your Perfect Match</p>
                            </div>
                        </div>
                        <p className="text-white/50">
                            © 2025 JobNest. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
