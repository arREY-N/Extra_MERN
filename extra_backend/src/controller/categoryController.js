import Category from "../models/Category";
import mongoose from "mongoose";

const createCategory = async (req, res, next) => {
    try{
        const { categoryName, color } = req.body;

        if(!categoryName || !color){
            return res.status(400).json({
                message: 'Please enter a category and color'
            });
        }

        const existingCategory = await Category.findOne({categoryName});
        
        if(existingCategory){
            return res.status(400).json({
                message: 'Category with this name already exists.'
            });
        }

        const newCategory = await Category.create({
            categoryName: categoryName,
            color: color
        });

        res.status(201).json({
            message: 'Category successfully created.',
            category: newCategory
        });
    } catch (error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: messages.join(', ')});
        } 

        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({message: `A category with that ${field} already exists`})
        }
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try{
        const categories = await Category.find().sort({categoryName: 1});
        res.status(200).json(categories); 
    } catch (error){
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try{
        const { id } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid Category ID format'})
        }

        const category = await Category.findById(id);

        if(!category){
            return res.status(404).json({message: 'Category not found'})
        }

        res.status(200).json(category);
    } catch(error){
        next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { categoryName, color } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid Category ID format'});
        }

        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({message: 'Category not found'});
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { categoryName, color },
            { new: true, runValidators: true}
        );

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.messages);
            return res.status(400).json({message: messages.join(', ')});
        }

        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({message: `A category with that ${field} already exists`})
        }
        next(error);
    }
}

const deleteCategory = async (req, res, next) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid Category ID format'});
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if(!deletedCategory){
            return res.status(404).json({message: 'Category not found'});
        }

        res.status(204).send();
    } catch(error){
        next(error);
    }
};


export {
    createCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}