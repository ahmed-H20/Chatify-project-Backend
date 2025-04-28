import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../Models/userModel.js';


export const  protectRoute =asyncHandler(async(req,res,next)=>{
    // 1) check if token is exist , if exist get
        let token= req.cookies.jwt;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return next(new Error('You are not login, Please login to get access this route',401));
        }

    // 2) Verify token (no change happens, expired token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    // 3) Check if user exists
    const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return next(new Error('The user that belong to this token does no longer exist',404));
        } 
        req.user = user;
        next();
});     