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



export { authenticate, authorizedAdmin};
