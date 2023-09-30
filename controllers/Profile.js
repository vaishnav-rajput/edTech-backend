const Profile = require("../models/Profile")
const User = require("../models/User")

exports.updateProfile = async (req, res) => {
    try {
        //get data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body //here dateOfBirth="" is done because it's a
        //optional field so the default value is set to "" if not found in req.body

        //get userId
        const id = req.user.id

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //find profile
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about;
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber
        await profileDetails.save()  //here save() is used because the object was already created with value as null

        //return response
        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message

        })
    }
}