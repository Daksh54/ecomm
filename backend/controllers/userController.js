import User from '../models/userModels.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from 'bcryptjs';
import  generateToken  from '../utils/CreateToken.js';

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
     

    const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword, 
    });

    try {
        await newUser.save();
        generateToken(res, newUser._id);

        res.status(201).json({ 
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    } catch (error) {
        res.status(400);
        throw new Error('Invalid user data'); 
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    generateToken(res, existingUser._id);

    res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
    });
});


const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiration date to the past
    });
    res.status(200).json({ message: 'User logged out successfully' });
});

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
        generateToken(res, updatedUser._id);
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

const deleteUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        if(user.isAdmin){
            res.status(400).json({message:"Cannot delete admin user"});
            return;
        }
        await user.deleteOne({ _id: user._id });
        res.json({message:"User removed successfully"});
    }
    else{
        res.status(404).json({message:"User not found"});
    }
})

const getUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        if(user.isAdmin){
            res.status(400).json({message:"Cannot get admin user"});
            return;
        }
        res.json(user);
    }
    else{
        res.status(404).json({message:"User not found"});
    }
})

const updateUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = boolean(req.body.isAdmin);

        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            username: updateUser.username,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        });
    }
    else{
        res.status(404).json({message:"User not found"});
    }
})



// Export controller
export { createUser,
     loginUser, 
     logoutCurrentUser,
     getAllUsers,
     getCurrentUserProfile,
     updateCurrentUserProfile,
     deleteUserById,
     getUserById,
     updateUserById};
