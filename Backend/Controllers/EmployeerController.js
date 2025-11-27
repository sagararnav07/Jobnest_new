const multer = require('multer');
const { upload }= require('../utlities/multerSetup');
const jwt = require("jsonwebtoken");
const dbModel = require('./../utlities/connection');

exports.updateProfile = async (req, res, next) => {
  upload.single('companyIcon')(req, res, async function (err) {
    if (err) {
      return next(err);
    }

    try {
      const employeerCollection = await dbModel.getEmployeerCollection();
      const userId = req.userId;
      const { description, linkedin, website, industry, skills } = req.body;
      const companyIcon = req.file ? req.file.path : '';
      
      // Fetch existing profile
      let profile = await employeerCollection.findOne({ _id:userId });

      if (!profile) {
        throw new Error("Employer profile not found");
      }

      // Conditionally update fields
      const updateFields = {};
      if (description) updateFields.description = description;
      if (linkedin) updateFields.linkedIn = linkedin;
      if (website) updateFields.website = website;
      if (companyIcon) updateFields.companyIcon = companyIcon;
      if (industry) updateFields.industry = industry;
      if (skills && skills.length > 0) updateFields.skills = skills;
      if (Object.keys(updateFields).length === 0) {
        // throw new Error("No fields to update");
        let error = new Error("No fields to update" )
        error.status = 400
        throw error
      }

      const updateResult = await employeerCollection.updateOne({ _id: userId }, { $set: updateFields });
      
      if (updateResult.modifiedCount === 0) {
        // throw new Error("Employer profile update failed");
        let error = new Error("Employer profile update failed" )
        error.status = 404
        throw error
      }
      // Optionally fetch and return the updated profile
      const updatedProfile = await employeerCollection.findOne({ _id: userId });
      if(updatedProfile)
      return res.json({ message: "Employer profile updated", profile: updatedProfile });
      else {
        let error= new Error('Unable to get employeer details')
        error.status = 500
        throw error
      }
    } catch (error) {
      next(error);
    }
  });
};
