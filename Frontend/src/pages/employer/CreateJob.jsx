import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Button, Input, Select, Textarea, Toast, LoadingSpinner } from '../../components/ui'
import { employerService } from '../../api'

const CreateJob = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = !!id
    
    const [loading, setLoading] = useState(isEditMode)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const [errors, setErrors] = useState({})
    const [skillInput, setSkillInput] = useState('')

    const [formData, setFormData] = useState({
        jobTitle: '',
        description: '',
        requirements: '',
        location: '',
        jobType: 'Full-time',
        experienceRequired: '',
        salary: '',
        salaryPeriod: 'year',
        skills: [],
        benefits: '',
        deadline: '',
        status: 'Active'
    })

    useEffect(() => {
        if (isEditMode) {
            loadJob()
        }
    }, [id])

    const loadJob = async () => {
        try {
            setLoading(true)
            const response = await employerService.getJobById(id)
            const job = response.job
            setFormData({
                jobTitle: job.jobTitle || '',
                description: job.description || '',
                requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || '',
                location: job.location || '',
                jobType: job.jobType || 'Full-time',
                experienceRequired: job.experienceRequired || job.experience || '',
                salary: job.salary?.toString() || '',
                salaryPeriod: job.salaryPeriod || 'year',
                skills: job.skills || [],
                benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits || '',
                deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
                status: job.status || 'Active'
            })
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to load job',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
    const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Manager']
    const salaryPeriods = [
        { value: 'hour', label: 'Per Hour' },
        { value: 'month', label: 'Per Month' },
        { value: 'year', label: 'Per Year' }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleAddSkill = () => {
        const skill = skillInput.trim()
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }))
            setSkillInput('')
        }
    }

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.jobTitle.trim()) {
            newErrors.jobTitle = 'Job title is required'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Job description is required'
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description should be at least 50 characters'
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required'
        }

        if (formData.skills.length === 0) {
            newErrors.skills = 'At least one skill is required'
        }

        if (formData.salary && isNaN(Number(formData.salary))) {
            newErrors.salary = 'Salary must be a number'
        }

        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline)
            if (deadlineDate < new Date()) {
                newErrors.deadline = 'Deadline must be in the future'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            setToast({
                show: true,
                message: 'Please fix the errors before submitting',
                type: 'error'
            })
            return
        }

        try {
            setSaving(true)
            const jobData = {
                ...formData,
                salary: formData.salary ? Number(formData.salary) : undefined,
                requirements: formData.requirements.split('\n').filter(r => r.trim()),
                benefits: formData.benefits.split('\n').filter(b => b.trim())
            }
            
            if (isEditMode) {
                await employerService.updateJob(id, jobData)
                setToast({
                    show: true,
                    message: 'Job updated successfully!',
                    type: 'success'
                })
            } else {
                await employerService.createJob(jobData)
                setToast({
                    show: true,
                    message: 'Job created successfully!',
                    type: 'success'
                })
            }
            
            setTimeout(() => {
                navigate('/employer/jobs')
            }, 1500)
        } catch (error) {
            setToast({
                show: true,
                message: error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} job`,
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

            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isEditMode ? 'Edit Job Posting' : 'Create Job Posting'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditMode ? 'Update the job listing details' : 'Fill in the details to create a new job listing'}
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Job Title *"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        error={errors.jobTitle}
                                        placeholder="e.g., Senior Frontend Developer"
                                    />
                                </div>
                                <Input
                                    label="Location *"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    error={errors.location}
                                    placeholder="e.g., San Francisco, CA or Remote"
                                />
                                <Select
                                    label="Job Type"
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    options={jobTypes.map(type => ({ value: type, label: type }))}
                                />
                                <Select
                                    label="Experience Level"
                                    name="experienceRequired"
                                    value={formData.experienceRequired}
                                    onChange={handleChange}
                                    options={[
                                        { value: '', label: 'Select level' },
                                        ...experienceLevels.map(level => ({ value: level, label: level }))
                                    ]}
                                />
                                <Input
                                    label="Application Deadline"
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    error={errors.deadline}
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Job Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Job Description</h2>
                            <div className="space-y-6">
                                <Textarea
                                    label="Description *"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={errors.description}
                                    rows={6}
                                    placeholder="Provide a detailed description of the role, responsibilities, and what makes this opportunity exciting..."
                                />
                                <Textarea
                                    label="Requirements (one per line)"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="3+ years of experience with React&#10;Strong understanding of JavaScript/TypeScript&#10;Experience with RESTful APIs&#10;Excellent communication skills"
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Required Skills</h2>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a skill and press Enter"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleSkillKeyDown}
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={handleAddSkill}>
                                        Add
                                    </Button>
                                </div>
                                {errors.skills && (
                                    <p className="text-sm text-red-600">{errors.skills}</p>
                                )}
                                {formData.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="ml-1 hover:text-indigo-900"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Compensation & Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Compensation & Benefits</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Salary"
                                    name="salary"
                                    type="number"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    error={errors.salary}
                                    placeholder="e.g., 120000"
                                    icon={<span className="text-gray-500">$</span>}
                                />
                                <Select
                                    label="Salary Period"
                                    name="salaryPeriod"
                                    value={formData.salaryPeriod}
                                    onChange={handleChange}
                                    options={salaryPeriods}
                                />
                            </div>
                            <div className="mt-6">
                                <Textarea
                                    label="Benefits (one per line)"
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Health insurance&#10;401(k) matching&#10;Remote work flexibility&#10;Professional development budget&#10;Unlimited PTO"
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-4 justify-end"
                    >
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => navigate('/employer/jobs')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="lg" loading={saving}>
                            {isEditMode ? 'Update Job Posting' : 'Create Job Posting'}
                        </Button>
                    </motion.div>
                </form>
            </div>
        </>
    )
}

export default CreateJob
