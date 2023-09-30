const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async(req, res) => {
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
            }).populate({  //this populate functionality was added by me
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection"
                }
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

exports.updateSection = async (req, res) => {
    try {
        //data fetch
        const {sectionName, sectionId} = req.body
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true})

        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        }) 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to update section",
            error: error.message
        })
    }
}

//delete section
exports.deleteSection = async (req, res) => {
    try {
         //get Id - assuming that we are sending id in params
         const {sectionId} = req.params

         //delete secction
         await Section.findByIdAndDelete(sectionId)

         

         //return response
         return res.status(200).json({
            success: true,
            message: "Section deleted"
         })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "unable to delete section",
                error: error.message
            })
    }
}