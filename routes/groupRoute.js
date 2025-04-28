import express from 'express';

import {createGroupConversation,sendGroupMessage,getGroupConversation,leaveGroup} 
    from '../controller/groupController.js';

// import {createMessageValidator , getMessageValidator , deleteMessageValidator} 
//     from '../utils/validators/messageValidator.js'

import { protectRoute } from '../middlewares/protectRoute.js';


const groupRoute = express.Router();

// Create Group Conversation 
groupRoute.route('/createGroup')
    .post(protectRoute,createGroupConversation);
// Create Group Conversation 
groupRoute.route('/groupMessage/:id')
    .post(protectRoute,sendGroupMessage);
// Get Group Message
groupRoute.route('/groupConversation')
    .get(protectRoute,getGroupConversation);
// Leave Group
groupRoute.route('/leaveGroup/:id')
    .delete(protectRoute,leaveGroup);
 // Create Group Conversation 
// messageRoute.route('/group')
//     .get(protectRoute,createGroupConversation);


export default groupRoute;  
