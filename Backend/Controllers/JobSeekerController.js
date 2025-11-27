const { getJobSeekerCollection } = require('../utlities/connection');
const { multiUpload } = require('../utlities/multerSetup');

const updateProfile = async (req, res, next) => {
    try {
        multiUpload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: "error in file uploads" })
            }
            else {
                const userId = req.userId; // Extracted from token by middleware

                const { jobPreference, skills, experience, socialProfiles } = req.body;

                // Files
                const resume = req.files.resume ? req.files.resume[0].buffer : null;
                const coverLetter = req.files.coverLetter ? req.files.coverLetter[0].buffer : null;
                const collection = await getJobSeekerCollection();

                // Update the jobseeker document
                const updateData = {
                    jobPreference,
                    skills: skills ? JSON.parse(skills) : [], // Assuming skills is sent as JSON string
                    experience: experience,
                    socialProfiles: socialProfiles ? JSON.parse(socialProfiles) : [],
                };

                if (resume) {
                    updateData.resume = { data: resume, contenttype: req.files.resume[0].mimetype };
                }

                if (coverLetter) {
                    updateData.coverLetter = { data: coverLetter, contenttype: req.files.coverLetter[0].mimetype };
                }

                const result = await collection.updateOne(
                    { _id: userId },
                    { $set: updateData },
                    { new: true, upsert: false } // Don't create new, only update existing
                );

                if (!result) {
                    return res.status(404).json({ message: 'JobSeeker not found' });
                }

                res.status(200).json({ message: 'Profile updated successfully', data: result });
            }
        })


    } catch (error) {
        next(error)
    }
};


module.exports = { updateProfile };
