import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { Card, Badge, Button, Select, Modal, LoadingSpinner, Toast } from '../../components/ui'
import { employerService } from '../../api'

const Applications = () => {
    const [searchParams] = useSearchParams()
    const jobFilter = searchParams.get('job')
    
    const [applications, setApplications] = useState([])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedJob, setSelectedJob] = useState(jobFilter || '')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [updating, setUpdating] = useState(false)
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [applicationsResponse, jobsResponse] = await Promise.all([
                employerService.getApplications(),
                employerService.getMyJobs()
            ])
            setApplications(applicationsResponse.applications || [])
            setJobs(jobsResponse.jobs || [])
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to load applications',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            setUpdating(true)
            await employerService.updateApplicationStatus(applicationId, newStatus)
            setApplications(prev => 
                prev.map(app => 
                    app._id === applicationId 
                        ? { ...app, status: newStatus }
                        : app
                )
            )
            setToast({
                show: true,
                message: 'Application status updated',
                type: 'success'
            })
        } catch (error) {
            setToast({
                show: true,
                message: 'Failed to update status',
                type: 'error'
            })
        } finally {
            setUpdating(false)
            setSelectedApplication(null)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'Applied': { variant: 'info', label: 'New' },
            'Inprogress': { variant: 'warning', label: 'Reviewing' },
            'To Be Interviewed': { variant: 'primary', label: 'Interview' },
            'Hired': { variant: 'success', label: 'Hired' },
            'Rejected': { variant: 'danger', label: 'Rejected' }
        }
        const config = statusMap[status] || { variant: 'default', label: status }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const filteredApplications = applications.filter(app => {
        const matchesJob = !selectedJob || app.job?._id === selectedJob
        const matchesStatus = !selectedStatus || app.status === selectedStatus
        return matchesJob && matchesStatus
    })

    const statuses = ['Applied', 'Inprogress', 'To Be Interviewed', 'Hired', 'Rejected']

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

            {/* Application detail modal */}
            <Modal
                isOpen={!!selectedApplication}
                onClose={() => setSelectedApplication(null)}
                title="Application Details"
                size="lg"
            >
                {selectedApplication && (
                    <div className="space-y-6">
                        {/* Applicant info */}
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-indigo-600 font-bold">
                                    {selectedApplication.applicant?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {selectedApplication.applicant?.name || 'Applicant'}
                                </h3>
                                <p className="text-gray-500">
                                    {selectedApplication.applicant?.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Applied {dayjs(selectedApplication.appliedAt).format('MMM D, YYYY')}
                                </p>
                            </div>
                        </div>

                        {/* Job info */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Applied for</p>
                            <p className="font-medium text-gray-900">
                                {selectedApplication.job?.jobTitle}
                            </p>
                        </div>

                        {/* Cover letter */}
                        {selectedApplication.coverLetter && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {selectedApplication.coverLetter}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {selectedApplication.applicant?.skills?.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApplication.applicant.skills.map((skill) => (
                                        <Badge key={skill} variant="default">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resume link */}
                        {selectedApplication.applicant?.resumeUrl && (
                            <div>
                                <a
                                    href={selectedApplication.applicant.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Resume
                                </a>
                            </div>
                        )}

                        {/* Status update */}
                        <div className="border-t pt-6">
                            <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                            <div className="flex flex-wrap gap-2">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(selectedApplication._id, status)}
                                        disabled={updating || selectedApplication.status === status}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedApplication.status === status
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {status === 'Inprogress' ? 'In Progress' : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications</h1>
                    <p className="text-gray-600">Review and manage job applications</p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select
                                label="Filter by Job"
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                options={[
                                    { value: '', label: 'All Jobs' },
                                    ...jobs.map(job => ({ 
                                        value: job._id, 
                                        label: job.jobTitle 
                                    }))
                                ]}
                            />
                            <Select
                                label="Filter by Status"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                options={[
                                    { value: '', label: 'All Statuses' },
                                    ...statuses.map(status => ({ 
                                        value: status, 
                                        label: status === 'Inprogress' ? 'In Progress' : status 
                                    }))
                                ]}
                            />
                            <div className="flex items-end">
                                <p className="text-sm text-gray-500">
                                    Showing {filteredApplications.length} of {applications.length} applications
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Applications list */}
                {filteredApplications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                            <p className="text-gray-600">
                                {applications.length === 0 
                                    ? 'You haven\'t received any applications yet'
                                    : 'No applications match your filters'}
                            </p>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        {filteredApplications.map((application, index) => (
                            <motion.div
                                key={application._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card hover>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-indigo-600 font-bold">
                                                    {application.applicant?.name?.charAt(0) || 'A'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {application.applicant?.name || 'Applicant'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {application.applicant?.email}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Applied for <span className="font-medium">{application.job?.jobTitle}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                {getStatusBadge(application.status)}
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {dayjs(application.appliedAt).format('MMM D, YYYY')}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedApplication(application)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    )
}

export default Applications
