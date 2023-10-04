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

//delete account
exports.deleteAccount = async(req, res) => {
    try {
        //get Id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails})
        //TODO: hw unenroll user from all enrolled courses
        //delete user
        await User.findByIdAndDelete({_id: id})

        //return response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted"
        })
    }
}

exports.getAllUserDetails = async(req, res) => {
    try {
        const id = req.user.id

        const userDetails = await User.findById(id).populate("additionalDetails").exec()

        return res.status(200).json({
            success: true, 
            message: "User data fetched successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};






