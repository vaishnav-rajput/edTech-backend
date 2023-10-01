const Course = require("../models/Course")
const Tag = require("../models/tags")
const User = require("../models/User")

const {uploadImageToCloudinary} = require("../utils/imageUploader")

//createCourse handler function
exports.createCourse = async(req, res) => {
    try {
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage


        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId)
        console.log("instructor details", instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "instructor details not found"
            })
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag)
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "tag details not found"
            })
        }
        
        //Upload image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
        {
            id: instructorDetails._id
        },
        {
            $push : {
                courses: newCourse.id,
            }
        },
        {new: true}
        )

        //update the tag schema
        await Tag.findByIdAndUpdate(
            {
               id: tagDetails._id 
            },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {new: true}
        )

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Created successfully",
            data: newCourse,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Faild to  create course",
            error: error.message
        })
    }
}

//getALLcourses handler Function

exports.showAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({}, {courseName: true,
                                                price: true, thumbnail: true,
                                                instructor: true,
                                                ratingAndReviews: true,
                                                studentsEnrolled: true
                                                 })
                                                 .populate("instructor")
                                                 .exec()
        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses
        })                                         
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Faild to get all course",
            error: error.message
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
        //get Id
        const {courseId} = req.body

        //find course details
        const courseDetails = await Course.find({_id: courseId})
                                                .populate(
                                                    {
                                                        path: "instructor",
                                                        populate: {
                                                            path: "additionalDetails"
                                                        }
                                                    }
                                                )
                                                .populate("category")
                                                .populate("ratingAndReviews")
                                                .populate(
                                                    {
                                                        path: "courseContent",
                                                        populate: {
                                                            path: "subSection"
                                                        }
                                                    }
                                                )
                                                .exec()

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `could not find the course with ${courseId}`
            })
        }                                           

        //return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}