import express from 'express';
import { handleChatbotRequest } from '../controller/chatbotController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const chatbotRouter = express.Router();

chatbotRouter.route('/')
    .post(protectRoute, handleChatbotRequest);

export default chatbotRouter;