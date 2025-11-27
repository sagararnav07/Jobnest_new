import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts'
import { Button, Input, Select, Textarea, FileUpload, Toast, Card, LoadingSpinner } from '../../components/ui'
import { jobseekerService } from '../../api'

const JobseekerProfile = () => {
    const { user, refreshProfile } = useAuth()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        jobPreference: '',
        skills: '',
        experience: '',
        socialProfiles: ''
    })
    const [files, setFiles] = useState({
        resume: null,
        coverLetter: null
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

    useEffect(() => {
        if (user) {
            setFormData({
                jobPreference: user.jobPreference || '',
                skills: user.skills?.join(', ') || '',
                experience: user.experience?.toString() || '',
                socialProfiles: user.socialProfiles?.join(', ') || ''
            })
        }
    }, [user])

    const jobPreferenceOptions = [
        { value: 'Day Shift', label: 'Day Shift' },
        { value: 'Work From Home', label: 'Work From Home' },
        { value: 'Hybrid', label: 'Hybrid' },
        { value: 'Onsite', label: 'Onsite' },
        { value: 'Night Shift', label: 'Night Shift' },
        { value: 'Flexible', label: 'Flexible' }
    ]

    const validateField = (name, value) => {
        switch (name) {
            case 'jobPreference':
                if (!value) return 'Job preference is required'
                return ''
            case 'skills':
                if (!value) return 'At least one skill is required'
                return ''
            case 'experience':
                if (value && isNaN(parseInt(value))) return 'Experience must be a number'
                if (value && parseInt(value) < 0) return 'Experience cannot be negative'
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

    const handleFileSelect = (type, file) => {
        setFiles(prev => ({ ...prev, [type]: file }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate required fields
        const newErrors = {}
        const requiredFields = ['jobPreference', 'skills']
        requiredFields.forEach(field => {
            const error = validateField(field, formData[field])
            if (error) newErrors[field] = error
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setToast({
                show: true,
                message: 'Please fill in all required fields',
                type: 'error'
            })
            return
        }

        setSaving(true)
        try {
            // Prepare form data for file upload
            const submitData = new FormData()
            submitData.append('emailId', user.emailId)
            submitData.append('jobPreferences', formData.jobPreference)
            submitData.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim())))
            submitData.append('experience', formData.experience || '0')
            submitData.append('socialProfiles', JSON.stringify(formData.socialProfiles.split(',').map(s => s.trim()).filter(Boolean)))
            
            if (files.resume) {
                submitData.append('resume', files.resume)
            }
            if (files.coverLetter) {
                submitData.append('coverLetter', files.coverLetter)
            }

            await jobseekerService.updateProfileWithFiles(submitData)
            await refreshProfile()

            setToast({
                show: true,
                message: 'Profile updated successfully!',
                type: 'success'
            })

            // If coming from incomplete profile, redirect to assessment
            setTimeout(() => {
                navigate('/jobseeker/assessment')
            }, 1500)
        } catch (error) {
            setToast({
                show: true,
                message: error.response?.data?.message || 'Failed to update profile',
                type: 'error'
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
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

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h1>
                    <p className="text-gray-600 mb-8">
                        Complete your profile to get better job matches. Fields marked with * are required.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info (read-only) */}
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    value={user?.name || ''}
                                    disabled
                                />
                                <Input
                                    label="Email"
                                    value={user?.emailId || ''}
                                    disabled
                                />
                            </div>
                        </Card>

                        {/* Job Preferences */}
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h2>
                            <div className="space-y-4">
                                <Select
                                    label="Job Preference"
                                    name="jobPreference"
                                    value={formData.jobPreference}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    options={jobPreferenceOptions}
                                    error={errors.jobPreference}
                                    required
                                />

                                <Input
                                    label="Skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="JavaScript, React, Node.js, Python"
                                    error={errors.skills}
                                    required
                                />
                                <p className="text-xs text-gray-500 -mt-2">
                                    Enter skills separated by commas
                                </p>

                                <Input
                                    label="Years of Experience"
                                    name="experience"
                                    type="number"
                                    min="0"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="2"
                                    error={errors.experience}
                                />
                            </div>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FileUpload
                                    label="Resume"
                                    onFileSelect={(file) => handleFileSelect('resume', file)}
                                    currentFile={files.resume}
                                    accept={{
                                        'application/pdf': ['.pdf'],
                                        'application/msword': ['.doc'],
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                                    }}
                                    description="Upload PDF or Word document"
                                />

                                <FileUpload
                                    label="Cover Letter"
                                    onFileSelect={(file) => handleFileSelect('coverLetter', file)}
                                    currentFile={files.coverLetter}
                                    accept={{
                                        'application/pdf': ['.pdf'],
                                        'application/msword': ['.doc'],
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                                    }}
                                    description="Upload PDF or Word document"
                                />
                            </div>
                        </Card>

                        {/* Social Profiles */}
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h2>
                            <Textarea
                                label="Social Media Links"
                                name="socialProfiles"
                                value={formData.socialProfiles}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/yourprofile, https://github.com/yourusername"
                                rows={3}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter profile URLs separated by commas
                            </p>
                        </Card>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={saving}
                            >
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    )
}

export default JobseekerProfile
