const express = require('express');
const EmployeerController = require('../Controllers/EmployeerController');
const authMiddleware = require('./../middewares/AuthMiddleware')
const router = express.Router();

router.use(authMiddleware)
router.use((req, res, next) => {
  try {
    if (req.userType !== 'Employeer') {
      let error = new Error("Jobseeker don't have permission")
      error.status = 403
      throw error
    }
    else next()
  }
  catch (error) {
    next(error)
  }
})
router.post('/createProfile', async (req, res, next) => {
  try {
    await EmployeerController.updateProfile(req, res, next);
    // console.log('ln 27 ', updatedResponse);
    // if(!updatedResponse) {
    //   let error = new Error('Unable to update employeer profile')
    //   error.status = 500
    //   throw error
    // }
    // else res.json({message:"Successfully updated Employeer profile "+ req.userId})
  } catch (error) {
    next(error);
  }
});


// create employeer profile
// router.post('/api/v1/createProfile/employeer', async(req,res,next)=>{
//     try{
//         const body = req.body

//         res.status(201).json({"message":"Employeer profile created successfully"})
//     }
//     catch(error){
//         throw error
//     }
// })
module.exports = router