import express from 'express';

import{
    signup,
    verifyEmail,
    resizeUserImages,
    login,
    googleLogin,
    generateQrcode,
    logout,
    checkAuth,
    forgetPassword,
    verifyResetPassword,
    resetPassword,
}
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
// verify email
auth.route('/verify-email')
    .post(verifyEmail);
// login 
auth.route('/login')
    .post(loginValidator,login);
// generate qrcode
auth.route('/generate-qrcode')
    .post(generateQrcode);
// google login
auth.route('/google')
    .post(googleLogin);

// auth.route('/login/webBrowser')
// .post(loginWebSiteValidator,loginWebSite);
// Forget Password
auth.route('/forgetPassword')
.post(protectRoute,forgetPassword);
// Forget Password
auth.route('/verifyResetPassword')
.post(verifyResetPassword);
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