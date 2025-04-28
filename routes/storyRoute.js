import express from 'express';

import {
    createStory,
    getStatusPageData,
    deleteStory
} 
from '../controller/storyController.js';

import { protectRoute } from '../middlewares/protectRoute.js';

const storyRouter = express.Router();

// Create a new story
storyRouter.route('/createStory')
    .post(protectRoute, createStory);
// Get all stories
storyRouter.route('/status')
    .get(protectRoute, getStatusPageData);
// Delete a story
storyRouter.route('/deleteStory/:id')
    .delete(protectRoute, deleteStory);
export default storyRouter;