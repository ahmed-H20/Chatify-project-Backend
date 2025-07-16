import asyncHandler from 'express-async-handler'
import apiError from '../utils/apiError.js';
import Message from '../Models/messageModel.js';
import Conversation from '../Models/conversationModel.js';
import {sanitizeMessage} from '../utils/sanitize.js';
import {generateRoomId} from '../utils/generateRoomId.js';

// @desc    Create message
// @route   POST/api/v1/message/sendMessage/id
// @access  Public
// export const sendMessage = asyncHandler(async(req,res,next) => {
//     try {
//         const { messageType } = req.body;
//         const {id:receiverId} = req.params;
//         const senderId = req.user._id;
//         if(!req.user || !req.user._id){
//             return next(new apiError('User not authenticated', 401));
//         }
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         });
//         if(!conversation){
//             conversation = await Conversation.create({
//                 participants : [senderId, receiverId]
//             });
//         }
//         const roomId = generateRoomId(...conversation.participants);
//         const newMessage = new Message({
//             senderId,
//             receiverId,
//            // participants,
//             message: req.body.message,
//             messageType,
//             roomId,  
//             isRead: false,
//             seenBy: senderId,
//         });
//         console.log(roomId);
//         if(!newMessage){
//             return next(new apiError('Failed to send message',400));
//         }
//         conversation.messages.push(newMessage._id);
//         // await conversation.save();
//         // await newMessage.save();
//         await Promise.all([conversation.save(), newMessage.save()]);

//         res.status(201).json({
//             data: sanitizeMessage(newMessage),
//         });

//     } catch(err){
//         console.log('Error in send message',err);
//         return next(new apiError('Server Error',500));
//     }
// });
export const sendMessage = asyncHandler(async (req, res, next) => {
    try {
        const { messageType, message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }

        // ❌ منع إرسال رسالة لنفسك
        if (senderId.toString() === receiverId.toString()) {
            return next(new apiError('You cannot send a message to yourself', 400));
        }

        // ترتيب المشاركين
        const participants = [senderId.toString(), receiverId.toString()].sort();

        let conversation = await Conversation.findOne({
            participants: { $all: participants },
            isGroup: false
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants,
                isGroup: false
            });
        }

        const roomId = generateRoomId(...participants);

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            messageType,
            roomId,
            isRead: false,
            seenBy: senderId,
            conversationId: conversation._id,
        });

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        const populatedMessage = await Message.findById(newMessage._id)
        .populate({ path: 'senderId', select: '_id name avatar' })
        .populate({ path: 'receiverId', select: '_id name avatar' });

        res.status(201).json({
        data: sanitizeMessage(populatedMessage),
        });


    } catch (err) {
        console.log('Error in send message', err);
        return next(new apiError('Server Error', 500));
    }
});


// @desc    Get messages
// @route   GET/ api/v1/message/getMessages/id
// @access  Public
export const getMessages = asyncHandler(async(req,res,next)=>{
    try{
        const {id:userToChatId} = req.params; // Receiver id
        const senderId = req.user._id;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        if(!userToChatId){
            return next(new apiError('User to chat id not found', 400));
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
            return next(new apiError('Message not found', 404));
        }
        const oneHour = 60 * 60 * 60 * 1000; // 1 hour in milliseconds
        const currentTime = new Date();
        const messageTime = new Date(message.createdAt);
        const timeDiff = currentTime - messageTime;
        if(timeDiff > oneHour){
            return next(new apiError('Message cannot be updated after 1 hour', 400));
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
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        const currentTime = new Date();
        const messageTime = new Date(message.createdAt);
        const timeDiff = currentTime - messageTime;
        if(timeDiff > oneHour){
            return next(new apiError('Message cannot be deleted after 1 hour', 400));
        } 
        res.status(200).json({
            message: 'Message deleted',
        });
    }catch(err){
        console.log('Error in get message',err.message);
        return next(new apiError('Server Error',500));
    }
});
// @desc    Get unread messages
// @route   GET/api/v1/message/unreadMessages
// @access  Private
export const getUnreadMessages = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }

        const receiverId = req.user._id;
        const unread = await Message.find({ receiver: receiverId, isRead: false });

        res.status(200).json({ data: unread });
    } catch (err) {
        console.log('Error getting unread messages:', err.message);
        next(new apiError('Server error', 500));
    }
});
// @desc    Post mark messages as read
// @route   POST/api/v1/message/markMessagesAsRead
// @access  Private
export const markMessagesAsRead = asyncHandler(async (req, res, next) => {
    try {
        const { senderId } = req.body;
        const receiverId = req.user._id;

        if (!senderId || !receiverId) {
            return next(new apiError('Sender and receiver are required', 400));
        }

        await Message.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (err) {
        console.log('Error marking messages as read:', err.message);
        next(new apiError('Server error', 500));
    }
});
// @desc    Get count unread messages
// @route   GET/api/v1/message/countUnreadMessages
// @access  Private
export const countUnreadMessages = asyncHandler(async (req, res, next) => {
    try {
        const receiverId = req.user._id;

        const count = await Message.countDocuments({ receiver: receiverId, isRead: false });

        res.status(200).json({ unreadCount: count });
    } catch (err) {
        console.log('Error counting unread messages:', err.message);
        next(new apiError('Server error', 500));
    }
});


    