import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import {v4 as uuidv4} from 'uuid';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js';
import apiError from '../utils/apiError.js';
import { sanitizeUser } from '../utils/sanitize.js';
import { generateToken } from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';
import {sendPasswordResetEmail , sendVerificationEmail} from '../utils/emails.js';


const uploadToCloudinary = (buffer, filename, folder, format = 'jpeg', quality = 'auto') => {
  return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
          {
              folder,
              public_id: filename,
              resource_type: 'image',
              format,
              quality,
          },
          (error, result) => {
              if (error) {
                  reject(new apiError(`Cloudinary Upload Error: ${error.message}`, 500));
              } else {
                  resolve(result);
              }
          }
      );
      stream.end(buffer);
  });
};

export const resizeUserImages = asyncHandler(async (req, res, next) => {
  if (!req.file) 
    return next(); // Skip if no image uploaded
      
  try {
      const profileImageFileName = `user-${uuidv4()}-profile.jpeg`;

      // Resize image
      const buffer = await sharp(req.file.buffer)
          .resize(500, 500, {
              fit: sharp.fit.cover,
              position: sharp.strategy.center
          })
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer();

      // Upload to Cloudinary
      const result = await uploadToCloudinary(buffer, profileImageFileName, 'users');

      req.body.profile_picture = result.secure_url; // Save URL to request body

      next();
  } catch (error) {
      next(new apiError('Error processing image upload', 500));
  }
});


// @desc    Sign Up
// @route   POST/api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {

  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const verificationCodeExpiresAt = Date.now() + 60 * 60 * 1000;

  const user = await User.create({
      name: req.body.name,
      phone: req.body.phone,  
      email: req.body.email,
      password: req.body.password,
      profile_picture: req.body.profile_picture,
      isVerified: false,
      verificationCode,
      verificationCodeExpiresAt
  });

  if (!user) {
      return next(new apiError('User creation failed', 500));
  }

  try {
      await sendVerificationEmail(user.email, user.name, verificationCode);
  } catch (error) {
      user.passwordResetCode = undefined;
      user.passwordResetExpiresAt = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      return next(new apiError('Failed to send verification code email. Please try again.', 500));
  }
  user.status = 'online';
  await user.save();
  res.status(201).json({
      status: 'success',
      message: 'Verification code sent to your email. Please verify your account'
  });
});

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({
      email,
      verificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() }
  });

  if (!user) {
      return next(new apiError('Invalid or expired verification code', 400));
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;
  await user.save();

  res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now log in.',
  });
});


// @desc    Login
// @route   POST/api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new apiError('Incorrect email or password', 401));
  }

  const token = generateToken(user._id, res);
  delete user.password;
  user.status = 'online';
  user.lastOnline = Date.now();
  res.status(200).json({ data: sanitizeUser(user), token });
});


// @desc   Forget password
// @route  POST/api/v1/auth/forgotPassword
// @access private
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
      return res.status(400).json({
          success: false,
          message: "User not found",
      });
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpiresAt = Date.now() + 60 * 60 * 1000; // 1 h
  const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  user.resetPasswordToken = hashedResetCode;
  user.resetPasswordTokenExpiration = resetCodeExpiresAt;
  user.passwordResetVerified = false;
  await user.save();

  try {
      await sendPasswordResetEmail(user.email, user.name, resetCode);
  } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiration = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      return next(new apiError('Failed to send password reset email. Please try again.', 500));
  }
  res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email',
  });
});

// @desc    Verify Password Reset Code
// @route   POST/api/auth/verify-resetCode
// @access  Private
export const verifyResetToken = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;
  const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

  const user = await User.findOne({ resetPasswordToken: hashedResetCode });
    if (!user || user.resetPasswordTokenExpiration < Date.now()) {
      return next(new apiError('Reset code invalid or expired', 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
      status: 'Success'
  });
});
// @desc    Reset Password
// @route   POST/api/auth/reset-password
// @access  Private
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
      return next(new apiError("Invalid User email", 404));
  }

  if (!user.passwordResetVerified) {
      return next(new apiError('Reset code not verified', 400));
  }
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiration = undefined;
  user.passwordResetVerified = undefined

  await user.save();
  //const token = createToken(user._id, res);
  //res.status(200).json({ token });
  res.status(200).json({
      stasus: 'Success',
      message: 'Password has been reset successfully. Please log in with your new password.'
  });
});  

// @desc    Logout
// @route   POST/api/v1/auth/logout
// @access  private
export const logout = asyncHandler(async(req, res,next) => {
  try{
    if (!req.user) {
      return next(new apiError('User not authenticated', 401));
    }
    // Update user status to 'offline'
    await User.findByIdAndUpdate(req.user._id, { status: 'offline' });
    res.cookie('jwt', '', {maxAge:0});
    res.status(200).json({message: 'Logged Out Successfully'});
  }catch(err){
    console.log(err);
    next(new apiError('Server Error', 500));
  }
});

// @desc    Check Authentication
// @route   GET/api/v1/auth/checkAuth
// @access  private
export const checkAuth = asyncHandler(async(req,res,next)=>{
  try{
    res.status(200).json({data:sanitizeUser(req.user)});
  }catch(err){
    console.log('Error in checkAuth controller',err);
    next(new apiError('Server Error', 500));
  }
});






