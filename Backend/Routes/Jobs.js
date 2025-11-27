const express = require('express');
const router = express.Router();
const authMiddleware = require('./../middewares/AuthMiddleware')
const { createJob, getAllJobs, getJobById, getJobsByEmployer, updateJob, deleteJob } = require('./../Controllers/JobController')

// Public route - get all jobs (no auth required)
router.get('/', async (req, res, next) => {
    try {
        const jobs = await getAllJobs()
        res.json({ jobs })
    } catch(error) {
        next(error)
    }
})

// Get job by ID (no auth required)
router.get('/:jobId', async (req, res, next) => {
    try {
        const job = await getJobById(req.params.jobId)
        res.json({ job })
    } catch(error) {
        next(error)
    }
})

// Protected routes below
router.use(authMiddleware)

// Employer only middleware for create/update/delete
const employerOnly = (req, res, next) => {
    try {
        if(req.userType === 'Jobseeker') {
            let error = new Error("Jobseeker don't have permission")
            error.status = 403
            throw error 
        }
        next()
    } catch(err) {
        next(err)
    }
}

// Create job (employer only)
router.post('/create', employerOnly, async (req, res, next) => {
    try {
        const body = req.body
        const newJob = await createJob(body, req.userId)
        res.status(201).json({ message: "Job created successfully", job: newJob })
    } catch(error) {
        next(error)
    }
})

// Get jobs by employer
router.get('/employer/my-jobs', employerOnly, async (req, res, next) => {
    try {
        const jobs = await getJobsByEmployer(req.userId)
        res.json({ jobs })
    } catch(error) {
        next(error)
    }
})

// Update job (employer only)
router.put('/:jobId', employerOnly, async (req, res, next) => {
    try {
        const updatedJob = await updateJob(req.params.jobId, req.body, req.userId)
        res.json({ message: "Job updated successfully", job: updatedJob })
    } catch(error) {
        next(error)
    }
})

// Delete job (employer only)
router.delete('/:jobId', employerOnly, async (req, res, next) => {
    try {
        await deleteJob(req.params.jobId, req.userId)
        res.json({ message: "Job deleted successfully" })
    } catch(error) {
        next(error)
    }
})

module.exports = router