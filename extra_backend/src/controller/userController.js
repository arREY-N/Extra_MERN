import mongoose from 'mongoose';
import User from '../models/User.js'

const createUser = async (req, res, next) => {
    try{
        let { username, password } = req.body;

        if(!username || !username.trim() || !password){
            return res.status(400).json({message: 'Please enter a valid username and password'})
        }

        username = username.trim();

        const existingUser = await User.find({ username: { $regex: `^${username}$`, $options: 'i' } });
        
        if(existingUser.length !== 0){
            return res.status(409).json({message: 'Username already in use'}); 
        }

        const newUser = await User.create({
            username,
            password
        });

        res.status(201).json({
            message: 'User successfully created',
            user: newUser
        });
    }catch(error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: `Validation Error: ${messages.join(', ')}`});
        }

        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({message: `A user with the same ${field} already exists`})
        }
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try{
        const users = await User.find().sort({username: 1});
        res.status(200).json(users);
    }catch(error){
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid User ID format'});
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    }catch(error){
        next(error);
    }
}

const getUserByUsername = async (req, res, next) => {
    try{
        let { username } = req.params;

        if(!username || !username.trim()){
            return res.status(400).json({message: 'Provide a valid username'});
        }

        username = username.trim();

        const user = await User.find({username: {$regex: new RegExp(username, 'i')}});

        if(user.length === 0){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    }catch(error){
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = req.user.id;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid User ID format'});
        }

        const existingUser = await User.findById(id);

        
        if(!existingUser){
            return res.status(404).json({message: 'User not found'});
        }
        
        if(user.toString() !== existingUser.id.toString()){
            return res.status(401).json({message: 'Unauthorized to update this user'});
        }
        
        if(Object.keys(req.body).length === 0){
            return res.status(400).json({message: 'No updated field provided'});
        }

        Object.assign(existingUser, req.body);

        const updatedUser = await existingUser.save()

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    }catch(error){
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: `Validation error: ${messages.join(', ')}`});
        }

        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({message: `A user with the same ${field} already exists.`});
        }
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = req.user.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: 'Invalid User ID format'});
        }

        if(id.toString() !== user.toString()){
            return res.status(401).json({message: 'Unauthorized to delete this user'});
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if(!deletedUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(204).send();
    }catch(error){
        next(error);
    }
}

export {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser
}