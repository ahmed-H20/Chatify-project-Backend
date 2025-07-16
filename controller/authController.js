import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import {v4 as uuidv4} from 'uuid';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler'
import { OAuth2Client } from 'google-auth-library';
import QRCode from 'qrcode';
import User from '../Models/userModel.js';
import apiError from '../utils/apiError.js';
import { sanitizeUser } from '../utils/sanitize.js';
import { generateToken } from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';
import {reSendVerificationEmail, sendPasswordResetEmail , sendVerificationEmail} from '../utils/emails.js';


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
  const hashedverificationCode = crypto.createHash("sha256").update(verificationCode).digest("hex");
  const { name , phone , email, password , confirmPassword} = req.body;
  const qrcode = await QRCode.toDataURL(req.body.email);
  if(password !== confirmPassword){
    return next(new apiError('Password and Confirm Password do not match', 400));
  }
  const user = await User.create({
    name,
    phone,
    email,
    password,
    confirmPassword,
    profile_picture: req.body.profile_picture,
    qrCode: qrcode,
    isVerified: false,
    verificationCode: hashedverificationCode,
    verificationCodeExpiresAt
  });

  if (!user) {
    return next(new apiError('User creation failed', 500));
  }

  try {
    await sendVerificationEmail(user.email, user.name, verificationCode);
  } catch (error) {
    user.verificationCode = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
    return next(new apiError('Failed to send verification code email. Please try again.', 500));
  }
  res.status(201).json({
    status: 'success',
    message: 'Verification code sent to your email. Please verify your account'
  });
});

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public

// export const verifyEmail = asyncHandler(async (req, res, next) => {
//   const { verificationCode, email } = req.body;

//   if (!verificationCode || !email) {
//     return next(new apiError("Verification code and email are required", 400));
//   }

//   const hashedCode = crypto
//     .createHash("sha256")
//     .update(verificationCode)
//     .digest("hex");

//   const user = await User.findOne({
//     email,
//     verificationCode: hashedCode,
//     verificationCodeExpiresAt: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new apiError("Invalid or expired verification code", 400));
//   }

//   user.isVerified = true;
//   user.verificationCode = undefined;
//   user.verificationCodeExpiresAt = undefined;

//   await user.save();

//   const token = generateToken(user._id, res); 

//   res.status(200).json({
//     status: "success",
//     message: "Email verified successfully.",
//     token,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       profile_picture: user.profile_picture,
//       isVerified: user.isVerified,
//     },
//   });
// });
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { verificationCode, email } = req.body;

  if (!verificationCode || !email) {
    return next(new apiError("Verification code and email are required", 400));
  }

  const hashedCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  const user = await User.findOne({
    email,
    verificationCode: hashedCode,
    verificationCodeExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new apiError("Invalid or expired verification code", 400));
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;
  await user.save();

  const token = generateToken(user._id, res);
  user.status = 'online';
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email verified and user logged in successfully.",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_picture: user.profile_picture,
      isVerified: user.isVerified,
    },
  });
});



// @desc    Login with QR Code
// @route   POST/api/v1/auth/qr-login
// @access  private

// @desc    Login
// @route   POST/api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password, } = req.body;
  /*if (qrCode) {
    const user = await User.findOne({ qrCode });
    if (user) {
      const token = generateToken(user._id, res);
      delete user.password;
      user.status = 'online';
      user.lastOnline = Date.now();
      res.status(200).json({
        message: 'User logged in via QR Code',
        data: sanitizeUser(user), token
      });
    } else {
      res.status(404).json({
        message: 'User not found with this QR code'
      });
    }
  } */ 
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new apiError('Incorrect email or password', 401));
    }
    const token = generateToken(user._id, res);
    delete user.password;
    user.status = 'online';
    await user.save();
  res.status(200).json({
    message: 'User logged in successfully', 
    data : user,
    token
  });
});


export const generateQrcode = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User not found' });
  }

  QRCode.toDataURL(userId, (err, url) => {
    if (err) {
      return res.status(500).json({ error: 'error in generating Qrcode' });
    }
    res.json({ qrcode: url });
  });
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc   Login with google
// @route  POST/api/v1/auth/google
// @access private
export const googleLogin = asyncHandler(async (req, res, next) => {
  
  const { id_token } = req.body;
  console.log("Received token:", id_token);
console.log("Expected audience:", process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name, avatar: picture });
    }
    const token = generateToken(user._id, res);

    res.json({
      success: true, 
      token,
      user: {
        id: user._id,
        email, 
        name } });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
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
export const verifyResetPassword = asyncHandler(async (req, res, next) => {
  const { resetCode , email } = req.body;
  const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

  const user = await User.findOne({ resetPasswordToken: hashedResetCode , email });
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


// @desc    Change current user's password
// @route   PUT /api/v1/auth/change-password
// @access  Private (Requires Authentication)

export const changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // موجود بعد ما تتأكد من التوكن في middleware
  const { currentPassword, newPassword } = req.body;

  // التحقق من وجود البيانات
  if (!currentPassword || !newPassword) {
    return next(new apiError("Current and new password are required", 400));
  }

  // إيجاد المستخدم
  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new apiError("User not found", 404));
  }

  // التحقق من كلمة المرور الحالية
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new apiError("Current password is incorrect", 401));
  }

  // تغيير كلمة المرور
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});


// @desc    Logout
// @route   POST/api/v1/auth/logout
// @access  private
export const logout = asyncHandler(async(req, res,next) => {
    if (!req.user) {
      return next(new apiError('User not authenticated', 401));
    }
    // Update user status to 'offline'
    await User.findByIdAndUpdate(req.user._id, { status: 'offline' });
    res.cookie('jwt', '', {maxAge:0});
    res.status(200).json({message: 'Logged Out Successfully'});

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



// Resend verify
export const resendVerificationCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new apiError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new apiError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new apiError("Email is already verified", 400));
  }

  // Generate new verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto.createHash("sha256").update(verificationCode).digest("hex");

  user.verificationCode = hashedCode;
  user.verificationCodeExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  await reSendVerificationEmail(user.email, user.name, verificationCode); // use the helper function

  res.status(200).json({
    message: "Verification code resent successfully",
  });
});





