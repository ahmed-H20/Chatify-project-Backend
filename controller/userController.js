import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js';
import apiError from '../utils/apiError.js';
import cloudinary from '../utils/cloudinary.js';
import {sanitizeUsersForSidebar} from '../utils/sanitize.js';


// Get all users in sidebar
export const getUsersForSidebar =asyncHandler(async(req, res, next)=>{
    try{
        const loggedInUserId = req.user._id;
        
        const users = await User.find({ _id: {$ne : loggedInUserId}});
        if(users.length == 0){
            return res.status(200).json([]);
        }
        res.status(200).json({data: users.map(sanitizeUsersForSidebar)});
    }catch(err){
        console.log('Error in get users for sidebar',err.message);
        return next(new apiError('Server Error',500));
    }
});

// Get specific users for sidebar
export const getUserForSidebar =asyncHandler(async(req, res, next)=>{
    try{
        //const loggedInUserId = req.user._id;
        const userId  = req.params.id;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({data: sanitizeUsersForSidebar(user)});
    }catch(err){
        console.log('Error in get users for sidebar',err.message);
        return next(new apiError('Server Error',500));
    }
});

// Update Your Account or profile
export const updateProfile =asyncHandler(async(req, res, next)=>{
   try{
    const { profile_picture , name , about }= req.body;
    const userId  = req.user._id;

    const updateResponse= await cloudinary.uploader.upload(profile_picture);
    const updatedUser = await User.findByIdAndUpdate(userId, {
        profile_picture: updateResponse.secure_url,
        name,
        about
    },{new: true});
    res.json({
        message: 'Profile updated successfully',
        data: updatedUser
    });
    }catch(error){
        console.log(error);
        next(new apiError('Server Error', 500));
    }
});

