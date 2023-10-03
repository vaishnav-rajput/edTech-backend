const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")
const mongoose = require("mongoose")

//createRating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id

        //fetchdata from req body
        const {rating, review, courseId} = req.body 

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: {$elemMatch: {$eq : userId}}
            }
        )

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "user not enrolled in course"
            })
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        })

        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "course is already reviewed by user"
            })
        }
 
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        })
        
        //update course with this rating and review
        await Course.findByIdAndUpdate({_id: courseId},{
            $push: {
                ratingAndReviews: ratingReview._id,
            }
        }, {new: true })
        console.log(updatedCourseDetails)
        
        //return response
        return res.status(200).json({
            success: true,
            message: "rating and review created successfully",
            ratingReview
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get course Id
        const courseId = req.body.courseId

        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },{
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},

                }
            }
        ])

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        //if no rating/review exist
        return res.status(200).json({
            success: true,
            message: "average rating is 0, no ratings given till now",
            averageRating: 0
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



//getAllRating
 