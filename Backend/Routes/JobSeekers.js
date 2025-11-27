const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateProfile } = require('./../Controllers/JobSeekerController');
const authMiddleware = require('../middewares/AuthMiddleware');
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware)
router.use(async (req, res, next) => {
    try {
        console.log('ln 11 ', req.body);

        if (req.userType !== 'Jobseeker') {
            let error = new Error("Employer don't have permission")
            error.status = 403
            throw error
        }
        else next()
    }
    catch (error) {
        next(error)
    }
})
// router.post('/updateProfile', upload.fields([
//     { name: 'resume', maxCount: 1 },
//     { name: 'coverLetter', maxCount: 1 }
// ]
// ), (req, res)=>{
//     console.log('ln 29 ', req);

// }, authMiddleware, updateProfile);

router.post('/updateProfile', async (req, res, next) => {
    console.log('ln 35 ', req.body);
     await updateProfile(req, res, next);
   
})
// router.get('/getProfile', async (req, res, next) => {
//     try {
//         const userId = req.userId
//         await 
//     }
//     catch (error) {
//         next(error)
//     }
// })

module.exports = router;
