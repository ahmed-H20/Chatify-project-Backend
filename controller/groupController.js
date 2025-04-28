import asyncHandler from 'express-async-handler'
import apiError from '../utils/apiError.js';
import Message from '../Models/messageModel.js';
import Conversation from '../Models/conversationModel.js';


// @desc    Create group chat
// @route   POST/ api/v1/group/createGroup
// @access  Public
export const createGroupConversation = asyncHandler(async(req,res,next)=>{
    try{
        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }
        const {participants , groupTitle} = req.body;
        if(!participants||participants.length<2){
            return next(new apiError('A group must have at least 2 participants', 400));
        }
        // Ensure the creator (current user) is included in participants
        if (!participants.includes(req.user._id.toString())) {
            participants.push(req.user._id.toString());
        }
        let conversation = await Conversation.findOne({
            participants: {$all:participants},
            isGroup:true,
        });
        const roomId = generateRoomId(senderId, receiverId);
        if(!conversation){
            conversation = await Conversation.create({
                participants,
                isGroup:true,
                groupTitle,
                roomId,
            });
        }
        return res.status(201).json({
            message: 'Group conversation created successfully',
            data:conversation
        });
    }catch(err){
        console.log('Error in create group conversation',err.message);
        return next(new apiError('Server Error',500));
    }
});
    
// @desc    Send Message in a Group Conversation
// @route   POST/ api/v1/group/groupMessage/id
// @access  Public
export const sendGroupMessage = asyncHandler(async(req,res,next)=>{
    try{
        const {messageType} = req.body;
        const conversationId = req.params.id;
        const senderId = req.user._id;
    
        const conversation = await Conversation.findById(conversationId);
        if(!conversation){
            return next(new apiError('Conversation not found', 404));
        }
        if(!conversation.participants.includes(senderId.toString())){
            return next(new apiError('You are not a participant in this conversation', 403));
        }
        const newMessage = await Message.create({
            senderId,
            //participants,
            conversationId,
            messageType,
            isGroupMessage: conversation.isGroup, 
        });
        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);
        return res.status(201).json({data:newMessage});
    }catch(err){
        console.log('Error in create group conversation',err.message);
        return next(new apiError('Server Error',500));
    }
});

// @desc    Get all group conversation
// @route   GET/api/v1/group/groupConversation
// @access  Public
export const getGroupConversation = asyncHandler(async(req,res,next)=>{
    try{
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        const conversation = await Conversation.find({isGroup:true})
        .populate({path : 'messages',select : '_id messageType'})
        .populate({path : 'participants',select : '_id name'});
        if(!conversation){
            return next(new apiError('Groups not found', 404));
        }
        return res.status(200).json({data:conversation});
    }catch(err){
        console.log('Error in create group conversation',err.message);
        return next(new apiError('Server Error',500));
    }
});

// @desc    Leave group conversation
// @route   DELETE/api/v1/group/leaveGroup
// @access  Public
export const leaveGroup = asyncHandler(async(req,res,next)=>{
    try{
        const conversationId = req.params.id;
        const userId = req.user._id;
        const conversation = await Conversation.findById(conversationId);
        if(!conversation){
            return next(new apiError('Conversation not found', 404));
        }
        if(!conversation.participants.includes(userId.toString())){
            return next(new apiError('You are not a participant in this conversation', 403));
        }
        conversation.participants = conversation.participants
            .filter(participant => participant.toString() !== userId.toString());
        await conversation.save();
        return res.status(200).json({message:'You have left the group'});
    }catch(err){
        console.log('Error in create group conversation',err.message);
        return next(new apiError('Server Error',500));
    }
});