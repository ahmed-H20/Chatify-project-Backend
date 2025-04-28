import express from 'express';

import{
    signup,
    verifyEmail,
    resizeUserImages,
    login,
    logout,
    checkAuth,
    forgetPassword,
    verifyResetToken,
    resetPassword}
from '../controller/authController.js';

import { 
    signupValidator,  
    loginValidator
 } 
    from '../utils/validators/authValidator.js';

import { protectRoute } from '../middlewares/protectRoute.js';

import { uploadUserImage } from '../utils/multer.js';

const auth = express.Router();

// sign up  
auth.route('/signup')
    .post(uploadUserImage,resizeUserImages,signupValidator,signup);
// login 
auth.route('/login')
    .post(loginValidator,login);
// verify email
auth.route('/verify-email')
    .post(verifyEmail);
// auth.route('/login/webBrowser')
// .post(loginWebSiteValidator,loginWebSite);
// Forget Password
auth.route('/forgetPassword')
.post(protectRoute,forgetPassword);
// Forget Password
auth.route('/verifyResetToken')
.post(verifyResetToken);
// Forget Password
auth.route('/resetPassword')
.post(resetPassword);
// logout
auth.route('/logout')
    .post(protectRoute,logout);
// ckeck Authentication
auth.route('/checkAuth')
    .get(protectRoute,checkAuth);

export default auth;