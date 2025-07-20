import { Router } from "express";
import { User } from '../models/index.js'
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = Router();

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign( {id}, jwtSecret, {
        expiresIn: '1h',
    });
};

router.post('/register', async (req, res, next) => {
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

        const newUser = new User({
            username,
            password
        });

        const savedUser = await newUser.save();

        const token = generateToken(savedUser.id);

        res.status(201).json({
            message: 'User successfully created',
            user: {
                id: savedUser.id,
                username: savedUser.username
            },
            token: token
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
});

router.get('/login', async (req, res, next) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({message: 'Please enter username and password'});
        }

        const user = await User.findOne({username}).select('+password');

        if(!user){
            return res.status(401).json({message: 'Invalid user credentials'});
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({message: 'Wrong password'});
        }

        const token = generateToken(user.id);

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user.id,
                username: user.username
            },
            token
        });
    }catch(error){
        next(error);
    }
});

export default router;