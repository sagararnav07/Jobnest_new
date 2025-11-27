const express = require('express')
const app = express()
const router = express.Router()
const User = require('./../models/Users')
const Profile = require('../models/profile')
const AuthController = require('../Controllers/AuthController');
const JobSeekerController = require('../Controllers/ProfileController')
const multer = require('multer')
const Job = require('../Controllers/ViewJobController')
const authMiddleware = require('../middewares/AuthMiddleware')
const dbModel = require('../utlities/connection')

// signup
router.post('/auth/signup', async (req, res, next)=>{
    try{
    const body  = req.body;
    const user = new User(body)
    const newUser = await AuthController.register(body)
    res.status(201).json({
        message: "User created successfully",
        token: newUser.token,
        user: {
            _id: newUser.newUser._id,
            name: newUser.newUser.name,
            emailId: newUser.newUser.emailId,
            userType: newUser.newUser.userType
        }
    })   
    }
    catch(error) {
        next(error)
    }
})

// login
router.post('/auth/login', async (req, res, next)=>{
    try{
        const body = req.body
        const sessionToken = await AuthController.login(body)
        res.json({message:"Login Successfull", sessionToken})
    }
    catch(error) {
        next(error)
    }
})

// Get current user profile
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        let user = null
        if (req.userType === 'Jobseeker') {
            const collection = await dbModel.getJobSeekerCollection()
            user = await collection.findOne({ _id: req.userId })
        } else {
            const collection = await dbModel.getEmployeerCollection()
            user = await collection.findOne({ _id: req.userId })
        }
        
        if (!user) {
            let error = new Error('User not found')
            error.status = 404
            throw error
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user
        res.json({ user: userWithoutPassword })
    } catch (error) {
        next(error)
    }
})

// Get current user profile (alias)
router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
        let user = null
        if (req.userType === 'Jobseeker') {
            const collection = await dbModel.getJobSeekerCollection()
            user = await collection.findOne({ _id: req.userId })
        } else {
            const collection = await dbModel.getEmployeerCollection()
            user = await collection.findOne({ _id: req.userId })
        }
        
        if (!user) {
            let error = new Error('User not found')
            error.status = 404
            throw error
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user.toObject()
        res.json({ user: userWithoutPassword })
    } catch (error) {
        next(error)
    }
})

// Get user by ID (for messaging/networking)
router.get('/profile/:userId', authMiddleware, async (req, res, next) => {
    try {
        const jobSeekerCollection = await dbModel.getJobSeekerCollection()
        const employeerCollection = await dbModel.getEmployeerCollection()
        
        let user = await jobSeekerCollection.findOne({ _id: req.params.userId })
        if (!user) {
            user = await employeerCollection.findOne({ _id: req.params.userId })
        }
        
        if (!user) {
            let error = new Error('User not found')
            error.status = 404
            throw error
        }
        
        // Return only public info
        res.json({ 
            user: {
                _id: user._id,
                name: user.name,
                emailId: user.emailId,
                userType: user.userType,
                skills: user.skills,
                experience: user.experience,
                industry: user.industry,
                description: user.description
            }
        })
    } catch (error) {
        next(error)
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, "uploads/"),
    filename: (req, file, cb) =>{
        const ext = file.originalname.split(".").pop();
        cb(null, file.fieldname + "_" + Date.now() + "." + ext);

    }
})

const upload = multer({storage: storage})

//profile register
router.post('/createprofile/jobseeker',
    upload.fields([
        {name:"resume", maxCount:1},
        {name:"coverLetter", maxCount:1}
    ]),
    JobSeekerController.updateJobSeekerProfile)


//view jobs (authenticated - matched jobs)
router.get('/jobs', authMiddleware, async(req,res,next)=>{
    try{
        const viewJobs = await Job.viewJobs(req.userId);
        res.json({ jobs: viewJobs })
    }catch(error){
        next(error)
    }
})

// Get assessment results
router.get('/assessment-results', authMiddleware, async (req, res, next) => {
    try {
        if (req.userType !== 'Jobseeker') {
            let error = new Error('Only jobseekers can view assessment results')
            error.status = 403
            throw error
        }
        
        const resultCollection = await dbModel.getResultCollection()
        const result = await resultCollection.findOne({ userId: req.userId })
        
        if (!result) {
            let error = new Error('Assessment not completed yet')
            error.status = 404
            throw error
        }
        
        res.json({ result })
    } catch (error) {
        next(error)
    }
})


module.exports = router