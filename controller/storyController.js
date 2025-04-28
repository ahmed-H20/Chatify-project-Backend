import asyncHandler from 'express-async-handler';
import Story from '../Models/storyModel.js';
import Conversation from '../Models/conversationModel.js';
import apiError from '../utils/apiError.js';

// @desc    Create a new story
// @route   POST/api/v1/story/createStory
// @access  Public
export const createStory = asyncHandler(async (req, res, next) => {
    try {
        const {mediaUrl, mediaType, caption } = req.body;
        if(!req.user || !req.user._id){
            return next(new apiError('User not authenticated', 401));
        }
        // Validate required fields
        if (!mediaUrl || !mediaType) {
            return next(new apiError('media URL, and media type are required', 400));
        }
        // Create a new story
        const newStory = await Story.create({
            user: req.user._id,
            mediaUrl,
            mediaType,
            caption,
        });
        await newStory.save();

        res.status(201).json({
            success: true,
            message: 'Story created successfully',
            data: newStory,
        });
    } catch(err){
        console.log('Error creating story:',err);
        next(new apiError('Server Error', 500));
      }
});

// @desc    Get status page data 
// @route   POST/api/v1/story/allStories
// @access  private
export const getStatusPageData = asyncHandler(async (req, res, next) => {
    try {
        const myUserId = req.user._id;
        if (!myUserId) {
            return next(new apiError('User not authenticated', 401));
        }

        // 1. My Status 
        const myStories = await Story.find({
            user: myUserId,
            createdAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 }, // Get stories created in the last 24 hours
        }).sort({ createdAt: -1 }); // Sort by createdAt in descending order
        if (!myStories) {
            return res.status(200).json([]);
        }

        // 2. Get Users with whom the user has had conversations
        const conversations = await Conversation.find({
            participants: { $in: [myUserId] } // Find conversations with this user
        });

        // Extract user IDs who are participants in the conversations (excluding the current user)
        const conversationParticipants = conversations.flatMap(conversation =>
            conversation.participants.filter(participant => participant.toString() !== myUserId.toString())
        );

        // 3. Other Users' Statuses (excluding user stories, only users from conversations)
        const otherUserStories = await Story.find({
            user: { $in: conversationParticipants }, // Only users who are in the conversations
            createdAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 }, // Get stories created in the last 24 hours
        }).populate('user', 'name profile_picture') // Populate user details
          .sort({ createdAt: -1 }); // Sort by createdAt in descending order
          if (!otherUserStories){
            return res.status(200).json([]);
        }
        res.status(200).json({
            success: true,
            message: 'Stories fetched successfully',
            myStatus: myStories,
            otherStatus: otherUserStories,
        });
    } catch (err) {
        console.log('Error getting stories:', err);
        next(new apiError('Server Error', 500));
    }
});

// @desc    Delete a story
// @route   DELETE /api/v1/story/:id
// @access  Private
export const deleteStory = asyncHandler(async (req, res, next) => {
    try {
        const myUserId = req.user._id;
        const storyId = req.params.id;
        if (!myUserId) {
            return next(new apiError('User not authenticated', 401));
        }
        const story = await Story.findById(storyId);
        if (!story) {
            return next(new apiError('Story not found', 404));
        }
        if (story.user.toString() !== myUserId.toString()) {
            return next(new apiError('You are not authorized to delete this story', 403));
        }
        await Story.findByIdAndDelete(storyId);
        res.status(200).json({
            success: true,
            message: 'Story deleted successfully',
        });
    }catch (err) {
        console.log('Error deleting story:', err);
        next(new apiError('Server Error', 500));
    }

});
  