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