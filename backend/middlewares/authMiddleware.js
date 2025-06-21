import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from './asyncHandler.js';
import bcrypt from 'bcryptjs';

const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password'); // ✅ fixed key

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

// check for the admin 
const authorizedAdmin = (req, res, next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find({});
    res.json(users);
})

const getCurrentUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id).select('-password');
    if(user){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const updateCurrentUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

export { authenticate, authorizedAdmin, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile };
