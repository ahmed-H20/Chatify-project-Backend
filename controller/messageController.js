import asyncHandler from 'express-async-handler'
import apiError from '../utils/apiError.js';
import Message from '../Models/messageModel.js';
import Conversation from '../Models/conversationModel.js';
import {sanitizeMessage} from '../utils/sanitize.js';
import {generateRoomId} from '../utils/generateRoomId.js';

// @desc    Create message
// @route   POST/api/v1/message/sendMessage/id
// @access  Public
export const sendMessage = asyncHandler(async(req,res,next) => {
    try {
        const { messageType } = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if(!conversation){
            conversation = await Conversation.create({
                participants : [senderId, receiverId]
            });
        }
        const roomId = generateRoomId(senderId, receiverId);
        const newMessage = new Message({
            senderId,
            receiverId,
            participants:[senderId,receiverId],
            messageType,
            roomId,  
        });
        console.log(roomId);
        if(!newMessage){
            return next(new apiError('Failed to send message',400));
        }
        conversation.messages.push(newMessage._id);
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({
            data: sanitizeMessage(newMessage),
        });

    } catch(err){
        console.log('Error in send message',err);
        return next(new apiError('Server Error',500));
    }
});

// @desc    Get messages
// @route   GET/ api/v1/message/getMessages/id
// @access  Public
export const getMessages = asyncHandler(async(req,res,next)=>{
    try{

        const {id:userToChatId} = req.params;
        const senderId = req.user._id;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        if(!senderId){
            return next(new apiError('User not authenticated', 401));
        }
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]}
        }).populate('messages');
        if(!conversation){
            return res.status(200).json([])
        }
        const messages = conversation.messages
        res.status(200).json({
            data: messages.map(sanitizeMessage),
        });
    }catch(err){
        console.log('Error in get messages',err.message);
        return next(new apiError('Server Error',500));
    }
});

// @desc    Get message
// @route   GET/api/v1/message/getMessage/id
// @access  Public
export const getMessage = asyncHandler(async(req,res,next)=>{
    try{
        const messageId = req.params.id;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        const message = await Message.findById(messageId);
        if(!message){
            return res.status(200).json([])
        }
        res.status(200).json({
            data: sanitizeMessage(message),
        });
    }catch(err){
        console.log('Error in get message',err.message);
        return next(new apiError('Server Error',500));
    }
});

// @desc    Update message
// @route   Put/api/v1/message/updateMessage/id
// @access  Public
export const updateMessage = asyncHandler(async(req,res,next)=>{
    try{
        const messageId = req.params.id;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        const message = await Message.findById(messageId);
        if(!message){
            return res.status(200).json({message: 'Message not found'});
        }
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            req.body,
            { new: true }
        )
        res.status(200).json({
            message: 'Message updated',
            data: updatedMessage,
        });
    }catch(err){
        console.log('Error in get message',err.message);
        return next(new apiError('Server Error',500));
    }
});

// @desc    Delete message
// @route   delete/api/v1/message/deleteMessage/id
// @access  Public
export const deleteMessage = asyncHandler(async(req,res,next)=>{
    try{
        const messageId = req.params.id;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        const message = await Message.findById(messageId);
        if(!message){
            return res.status(200).json({message: 'Message not found'});
        }
         await Message.findByIdAndDelete(messageId);
        res.status(200).json({
            message: 'Message deleted',
        });
    }catch(err){
        console.log('Error in get message',err.message);
        return next(new apiError('Server Error',500));
    }
});


// GET unread messages
export const unreadMessage = asyncHandler(async(req, res) => {
    const unread = await Message.find({ receiver: req.params.receiverId, isRead: false });
    res.json(unread);
  });
  // POST to mark as read
export const markAsRead = asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.body;
    await Message.updateMany({ sender: senderId, receiver: receiverId }, { isRead: true });
    res.json({ message: 'Marked as read' });
  });
 export const unreadMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ receiverId: req.params.userId, isRead: false });
    res.json(messages);
  });
    