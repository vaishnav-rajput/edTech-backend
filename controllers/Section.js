const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSchema = async(req, res) => {
    try {
        //data fetch
        const {sectionName, courseId} = req.body

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        //create section
        const newSection = await Section.create({sectionName})

        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {
                new: true
            })
        //TODO: use populate to replace sections/sub-sections both in the updated course details
        //return respons
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to create section",
            error: error.message
        })
    }
}