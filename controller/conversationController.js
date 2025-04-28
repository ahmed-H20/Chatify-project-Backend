import asyncHandler from 'express-async-handler'
import apiError from '../utils/apiError.js';
import Conversation from '../Models/conversationModel.js';


// @desc    Get private conversation
// @route   GET/api/v1/conversation/privateConversation
// @access  Public
export const getPrivateConversation = asyncHandler(async (req, res, next) => {
    try {
        const conversationId = req.params.id;

        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }

        if (!conversationId) {
            return next(new apiError('Conversation id not found', 400));
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            isGroup: false, 
        }).populate({
            path: 'messages',
            select: '_id messageType', 
        });

        if (!conversation) {
            return next(new apiError('Private conversation not found', 404));
        }
        return res.status(200).json({ data: conversation });
    } catch (err) {
        console.log('Error in get private conversation', err.message);
        return next(new apiError('Server Error', 500));
    }
});

// @desc    Get all conversation
// @route   GET/api/v1/conversation/getUserChats
// @access  Public
export const getUserChats = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }
        // استرجاع كل المحادثات الخاصة اللي المستخدم طرف فيها
        const conversations = await Conversation.find({
            participants: req.user._id,
            isGroup: false,
        })
        .populate({
            path: 'participants',
            select: '_id name ', // تعديل على حسب بيانات المستخدم
        })
        .populate({
            path: 'messages',
            select: '-participants -roomId', // تعديل على حسب بيانات الرسالة
            options: { sort: { createdAt: -1 } }, // ترتيب الرسائل من الأحدث للأقدم
        });

        if (!conversations || conversations.length === 0) {
            return res.status(200).json([]);
        }
        const formattedChats = conversations.map((conv) => {
            const otherUser = conv.participants.find(p => p._id.toString() !== (req.user._id).toString());
            const lastMessage = conv.messages[0]; // لأنها مرتبة من الأحدث

            return {
                chatId: conv._id,
                user: {
                    _id: otherUser._id,
                    name: otherUser.name,
                    image: otherUser.image ? otherUser.image : null, // تأكد من وجود الصورة
                },
                lastMessage: lastMessage ? lastMessage : null,
                lastMessageAt: lastMessage ? lastMessage.createdAt : null,
            };
        });

        res.status(200).json({
            data: formattedChats,
        });
    } catch (err) {
        console.log('Error in get user chats', err.message);
        return next(new apiError('Server Error', 500));
    }
});
