import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js';
import Conversation from '../Models/conversationModel.js';
import apiError from '../utils/apiError.js';
import cloudinary from '../utils/cloudinary.js';
import {sanitizeUser, sanitizeUsersForSidebar} from '../utils/sanitize.js';


// Get all users in sidebar
export const getUsersForSidebar = asyncHandler(async (req, res, next) => {
    const loggedInUserId = req.user._id;
    // نجيب كل المحادثات اللي يشارك فيها المستخدم
    const conversations = await Conversation.find({
        participants: loggedInUserId
    }).select('participants');

    const userIds = new Set();

    conversations.forEach(conv => {
        conv.participants.forEach(participantId => {
            if (participantId.toString() !== loggedInUserId.toString()) {
                userIds.add(participantId.toString());
            }
        });
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } });

    res.status(200).json({ data: users.map(sanitizeUsersForSidebar) });
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
        res.status(200).json({data: sanitizeUser(user)});
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

    const updatedUser = await User.findByIdAndUpdate(userId, {
        profile_picture: profile_picture,
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

// @desc    Search for users
// @route   GET /api/v1/user/search?query=ahmed
// @access  Private
export const searchUsers = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } },
    ],
  }).select("_id name phone profile_picture");

  res.status(200).json({ data: users });
});

