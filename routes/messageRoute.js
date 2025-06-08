import express from 'express';

import {
    sendMessage,
    getMessages,
    getMessage,
    updateMessage,
    deleteMessage,
    getUnreadMessages,
    markMessagesAsRead,
    countUnreadMessages 
}from '../controller/messageController.js';

import {createMessageValidator , getMessageValidator , deleteMessageValidator} 
    from '../utils/validators/messageValidator.js'

import { protectRoute } from '../middlewares/protectRoute.js';


const messageRoute = express.Router();

// Send Message
messageRoute.route('/sendMessage/:id')
    .post(protectRoute,createMessageValidator,sendMessage);   
// Get Messages
messageRoute.route('/getMessages/:id')
    .get(protectRoute, getMessages);
// Get Message
messageRoute.route('/getMessage/:id')
    .get(protectRoute,getMessageValidator,getMessage);
// Update Message
messageRoute.route('/updateMessage/:id')
    .put(protectRoute,updateMessage);
// Delete Message
messageRoute.route('/deleteMessage/:id')
    .delete(protectRoute,deleteMessage);
// Unread Message
messageRoute.route('/unreadMessage')
    .get(protectRoute,getUnreadMessages);
// Mark As Read 
messageRoute.route('/markAsRead/:id')
    .put(protectRoute,markMessagesAsRead);
// Unread Messages
messageRoute.route('/unreadMessages/:id')
    .get(protectRoute,countUnreadMessages);


export default messageRoute;
