import express from "express";
import { Router } from "express";
import {
    createCategory,
    getCategory,
    getCategoryById,
    getCategoryByName,
    updateCategory,
    deleteCategory   
} from "../controller/categoryController.js";

const router = Router();

router.route('/')
    .post(createCategory)
    .get(getCategory);

router.route('/id/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

router.route('/name/:categoryName')
    .get(getCategoryByName);

export default router;