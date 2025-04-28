import express from 'express';

import {getPrivateConversation,getUserChats} 
        from '../controller/conversationController.js';

import { protectRoute } from '../middlewares/protectRoute.js';

const conversationRoute = express.Router();

// Get Private Message
conversationRoute.route('/privateConversation/:id')
        .get(protectRoute,getPrivateConversation);
// getUserChats
conversationRoute.route('/getUserChats')
        .get(protectRoute,getUserChats);


export default conversationRoute;