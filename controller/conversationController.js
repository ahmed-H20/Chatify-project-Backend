import asyncHandler from 'express-async-handler'
import apiError from '../utils/apiError.js';
import Conversation from '../Models/conversationModel.js';
import User from "../Models/userModel.js"; 

// @desc    Get private conversation
// @route   GET/api/v1/conversation/privateConversation
// @access  Public
export const getPrivateConversation = asyncHandler(async (req, res, next) => {
    try {

        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }


        const conversation = await Conversation.find({
            conversation,
            isGroup: true, 
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

// @route   GET/api/v1/conversation/privateConversation
// @access  Public
export const getPrivateConversationById = asyncHandler(async (req, res, next) => {
  try {
    const conversationId = req.params.id;

    if (!req.user || !req.user._id) {
      return next(new apiError("User not authenticated", 401));
    }

    if (!conversationId) {
      return next(new apiError("Conversation id not found", 400));
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      isGroup: false,
    })
      .populate({
        path: "messages",
        select: "_id messageType message createdAt senderId isRead",
        populate: {
          path: "senderId",
          select: "_id name avatar"
        },
      })
      .populate({
        path: "participants",
        select: "_id", 
      });

    if (!conversation) {
      return next(new apiError("Private conversation not found", 404));
    }

    const receiverId = conversation.participants.find(
      (participant) => participant._id.toString() !== req.user._id.toString()
    )?._id;

    if (!receiverId) {
      return next(new apiError("Receiver not found", 404));
    }


    const receiver = await User.findById(receiverId)
    // .select("_id name image status");
    
    return res.status(200).json({
      data: conversation,
      receiver,
    });
  } catch (err) {
    console.log("Error in get private conversation", err.message);
    return next(new apiError("Server Error", 500));
  }
});



// @desc    Get all conversation
// @route   GET/api/v1/conversation/allPrivateConversation
// @access  Public
export const getAllPrivateConversation = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return next(new apiError('User not authenticated', 401));
        }

        const conversations = await Conversation.find({
            participants: req.user._id,
            isGroup: false,
        })
        .populate({
            path: 'participants',
            select: '_id name image',
        })
        .populate({
            path: 'messages',
            select: '-participants -roomId',
            options: { sort: { createdAt: -1 } }, // أحدث رسالة في الأول
        });

        if (!conversations || conversations.length === 0) {
            return res.status(200).json([]);
        }

        const formattedChats = conversations
            .map((conv) => {
                const otherUser = (conv.participants || []).find(p =>
                    p && p._id.toString() !== req.user._id.toString()
                );

                if (!otherUser) return null;

                const lastMessage = conv.messages?.[0];

                return {
                    chatId: conv._id,
                    user: {
                        _id: otherUser._id,
                        name: otherUser.name,
                        image: otherUser.image || null,
                    },
                    lastMessage: lastMessage || null,
                    lastMessageAt: lastMessage?.createdAt || null,
                };
            })
            .filter(Boolean)
            .sort((a, b) => {
                const timeA = new Date(a.lastMessageAt || 0).getTime();
                const timeB = new Date(b.lastMessageAt || 0).getTime();
                return timeB - timeA; // الأحدث أولاً
            });

        res.status(200).json({
            data: formattedChats,
        });
    } catch (err) {
        console.log('Error in get user chats', err.message);
        return next(new apiError('Server Error', 500));
    }
});

// @desc    Access or create a private conversation
// @route   POST /api/v1/conversation/accessPrivateConversation
// @access  Private
export const accessPrivateConversation = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const currentUserId = req.user._id;

  if (!userId) {
    return next(new apiError('User ID is required', 400));
  }

  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [currentUserId, userId] }
  });

  if (conversation) {
    return res.status(200).json({ data: conversation });
  }

  // Create new conversation
  conversation = await Conversation.create({
    isGroup: false,
    participants: [currentUserId, userId]
  });

  return res.status(201).json({ data: conversation });
});


