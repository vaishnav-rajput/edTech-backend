const Category = require("../models/Category")

//create category handler function
exports.createCategory = async (req, res) => {
    try {
        //fetch data
        const {name, description} = req.body;

        //validation
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //create entry in DB
        const CategoryDetails  = await Category.create({
            name: name,
            description: description,
        })
        console.log(CategoryDetails) 

        //return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully" 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// //get all category handler function
exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, {name: true, description: true })
        res.status(200).json({
            success: true,
            message: "ALl tags returned successfully",
            data: allCategories
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
    try {
        //get CategoryId     
        const {categoryId} = req.body

        //get courses for specified Id
        const selectedCategory = await Category.findById(categoryId)
                                                .populate("courses")
                                                .exec()
        
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }

        //get courses for different categories
        const differentCategories = await Category.find({
            _id: {$ne: categoryId},
        })
        .populate("courses")
        .exec()

        //get top 10 selling courses 
        //TODO: above controller as hw

        //return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            }
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}