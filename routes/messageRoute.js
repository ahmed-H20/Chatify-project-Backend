import express from 'express';

import {sendMessage,getMessages,getMessage,updateMessage,deleteMessage,
        unreadMessage,markAsRead,unreadMessages} 
    from '../controller/messageController.js';

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
// Get Unread Message
messageRoute.route('/unreadMessage/:receiverId')
    .get(protectRoute,unreadMessage);
// Mark Message as Read
messageRoute.route('/markAsRead/:senderId/:receiverId')
    .post(protectRoute,markAsRead);
// Get Unread Messages
messageRoute.route('/unreadMessages/:senderId/:receiverId')
    .get(protectRoute,unreadMessages);


export default messageRoute;
