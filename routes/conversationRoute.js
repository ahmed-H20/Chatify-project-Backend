import express from 'express';

import {accessPrivateConversation, getAllPrivateConversation,getPrivateConversationById} 
        from '../controller/conversationController.js';

import { protectRoute } from '../middlewares/protectRoute.js';

const conversationRoute = express.Router();

// Get Private Message
conversationRoute.route('/privateConversation/:id')
        .get(protectRoute,getPrivateConversationById);
// getUserChats
conversationRoute.route('/allPrivateConversation')
        .get(protectRoute,getAllPrivateConversation);

conversationRoute.post('/accessPrivateConversation', protectRoute, accessPrivateConversation);
export default conversationRoute;