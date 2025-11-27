const dbModel = require('./../utlities/connection')
const { validateJob } = require('./../utlities/Validation')

const createJob = async (job, employeerId) =>{
    try{
        const jobCollection = await dbModel.getJobCollection()
        validateJob(job)
        const newJob = await jobCollection.create({
            jobTitle: job.jobTitle,
            salary: job.salary,
            currencytype: job.currencytype,
            skills: job.skills,
            description: job.description,
            jobPreference: job.jobPreference,
            experience: job.experience,
            location: job.location,
            postedDate: new Date(),
            expiryDate: job.expiryDate,
            employeerId: employeerId
        })
        if(!newJob) {
            let error = new Error('Unable to create job')
            error.status = 500
            throw error
        }
        return newJob 
    }
    catch(error) {throw error}
}

const getAllJobs = async () => {
    try {
        const jobCollection = await dbModel.getJobCollection()
        const jobs = await jobCollection.find({})
        return jobs
    } catch(error) {
        throw error
    }
}

const getJobById = async (jobId) => {
    try {
        const jobCollection = await dbModel.getJobCollection()
        const job = await jobCollection.findOne({ _id: jobId })
        if(!job) {
            let error = new Error('Job not found')
            error.status = 404
            throw error
        }
        return job
    } catch(error) {
        throw error
    }
}

const getJobsByEmployer = async (employeerId) => {
    try {
        const jobCollection = await dbModel.getJobCollection()
        const jobs = await jobCollection.find({ employeerId: employeerId })
        return jobs
    } catch(error) {
        throw error
    }
}

const updateJob = async (jobId, jobData, employeerId) => {
    try {
        const jobCollection = await dbModel.getJobCollection()
        const job = await jobCollection.findOne({ _id: jobId })
        
        if (!job) {
            let error = new Error('Job not found')
            error.status = 404
            throw error
        }
        
        if (job.employeerId.toString() !== employeerId.toString()) {
            let error = new Error('Not authorized to update this job')
            error.status = 403
            throw error
        }
        
        const updatedJob = await jobCollection.findByIdAndUpdate(
            jobId,
            { ...jobData, updatedAt: new Date() },
            { new: true }
        )
        return updatedJob
    } catch(error) {
        throw error
    }
}

const deleteJob = async (jobId, employeerId) => {
    try {
        const jobCollection = await dbModel.getJobCollection()
        const job = await jobCollection.findOne({ _id: jobId })
        
        if (!job) {
            let error = new Error('Job not found')
            error.status = 404
            throw error
        }
        
        if (job.employeerId.toString() !== employeerId.toString()) {
            let error = new Error('Not authorized to delete this job')
            error.status = 403
            throw error
        }
        
        await jobCollection.findByIdAndDelete(jobId)
        return { message: 'Job deleted successfully' }
    } catch(error) {
        throw error
    }
}

module.exports = { createJob, getAllJobs, getJobById, getJobsByEmployer, updateJob, deleteJob }