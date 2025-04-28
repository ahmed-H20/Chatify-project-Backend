import express from 'express';

import { getUserValidator } 
    from '../utils/validators/userValidator.js';

import {getUsersForSidebar , getUserForSidebar , updateProfile} 
    from '../controller/userController.js'
import { uploadUserImage } from '../utils/multer.js';
import { resizeUserImages } from '../controller/authController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const userRoute =  express.Router();

// Get all users in sidebar
userRoute.route('/')
    .get(protectRoute, getUsersForSidebar);
// Get specific user in sidebar
userRoute.route('/:id')
    .get(protectRoute,getUserValidator, getUserForSidebar);
// Update Your Account or profile
userRoute.route('/update-Profile')
    .put(protectRoute,uploadUserImage,resizeUserImages,updateProfile);


export default userRoute;