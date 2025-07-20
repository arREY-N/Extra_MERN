import { Router } from "express";
import {
    createUser,
    getUserById,
    getUserByUsername,
    getUsers,
    updateUser,
    deleteUser
} from '../controller/userController.js'
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/id/:id')
    .get(getUserById)
    .put(protect, updateUser)
    .delete(protect, deleteUser);

router.route('/username/:username')
    .get(getUserByUsername);

export default router;