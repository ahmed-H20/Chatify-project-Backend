import asyncHandler from 'express-async-handler';
import Call from '../Models/callModel.js';
import apiError from '../utils/apiError.js';
import { generateRoomId } from '../utils/generateRoomId.js';

// @desc    Create a new call
// @route   POST /api/v1/call/create
// @access  Private
export const createCall = asyncHandler(async (req, res, next) => {
  try {
    const { participants, callType } = req.body;
    if(!req.user || !req.user._id){
      return next(new apiError('User not authenticated', 401));
  }
    if (!participants || participants.length < 2) {
      return next(new apiError('At least two participants required', 400));
    }

    const roomId = generateRoomId(participants);

    const newCall = new Call({
      participants,
      callType,
      initiatedAt: new Date(),
      status: 'ringing',
      roomId,
    });

    const savedCall = await newCall.save();

    const receiverId = participants[1];
    const receiverSocketId = global.onlineUsers?.[receiverId];

    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit('incomingCall', {
        callId: savedCall._id,
        callerId: participants[0],
        callType,
        roomId,
      });
    }

    res.status(201).json({ data: savedCall });
  } catch (err) {
    console.error('Error in createCall:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// @desc    Accept a call
// @route   POST /api/v1/call/accept/:id
// @access  Private
export const acceptCall = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if(!req.user || !req.user._id){
        return next(new apiError('User not authenticated', 401));
    }
    const call = await Call.findById(id);

    if (!call) {
      return next(new apiError('Call not found', 404));
    }

    call.status = 'accepted';
    await call.save();

    global.io.to(call.roomId).emit('callAccepted', { callId: id });

    res.status(200).json({ message: 'Call accepted', data: call });
  } catch (err) {
    console.error('Error in acceptCall:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// @desc    Reject a call
// @route   POST /api/v1/call/reject/:id
// @access  Private
export const rejectCall = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if(!req.user || !req.user._id){
        return next(new apiError('User not authenticated', 401));
    }
    const call = await Call.findById(id);

    if (!call) {
      return next(new apiError('Call not found', 404));
    }

    call.status = 'rejected';
    await call.save();

    global.io.to(call.roomId).emit('callRejected', { callId: id });

    res.status(200).json({ message: 'Call rejected', data: call });
  } catch (err) {
    console.error('Error in rejectCall:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// @desc    End a call
// @route   POST /api/v1/call/end/:id
// @access  Private
export const endCall = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id);
    if(!req.user || !req.user._id){
          return next(new apiError('User not authenticated', 401));
    }
    if (!call) {
      return next(new apiError('Call not found', 404));
    }

    call.status = 'ended';
    await call.save();

    global.io.to(call.roomId).emit('callEnded', { callId: id });

    res.status(200).json({ message: 'Call ended', data: call });
  } catch (err) {
    console.error('Error in endCall:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// @desc    Get all calls
// @route   GET /api/v1/call/all
// @access  Private
export const getCalls = asyncHandler(async (req, res, next) => {
  try {
    if(!req.user || !req.user._id){
        return next(new apiError('User not authenticated', 401));
      }
    const calls = await Call.find();
    res.status(200).json({ data: calls });
  } catch (err) {
    console.error('Error in getCalls:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// @desc    Get single call by ID
// @route   GET /api/v1/call/:id
// @access  Private
export const getCall = asyncHandler(async (req, res, next) => {
  try {
    const call = await Call.findById(req.params.id);
    if(!req.user || !req.user._id){
          return next(new apiError('User not authenticated', 401));
           }
    if (!call) {
      return next(new apiError('Call not found', 404));
    }

    res.status(200).json({ data: call });
  } catch (err) {
    console.error('Error in getCall:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// @desc    Delete call
// @route   DELETE /api/v1/call/delete/:id
// @access  Private
export const deleteCall = asyncHandler(async (req, res, next) => {
  try {
    if(!req.user || !req.user._id){
      return next(new apiError('User not authenticated', 401));
  }
    const call = await Call.findById(req.params.id);

    if (!call) {
      return next(new apiError('Call not found', 404));
    }

    await Call.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Call deleted' });
  } catch (err) {
    console.error('Error in deleteCall:', err.message);
    return next(new apiError('Server Error', 500));
  }
});

// import asyncHandler from 'express-async-handler'
// import Call from '../Models/callModel.js';
// import apiError from '../utils/apiError.js';
// import { generateRoomId } from '../utils/generateRoomId.js'; 
// //import {sanitizeCall} from '../utils/sanitize.js';


// // @desc    Create call
// // @route   GET/ api/v1/call/createCall
// // @access  Public
// export const createCall = asyncHandler(async(req,res,next)=>{
//     try{
//         const {participants , callType } = req.body;
//         if(!participants|| participants.length<2){
//             return next(new apiError('At least two participants required',400));
//         }
//         const roomId = generateRoomId(participants); // Generate a unique room ID for the call
//         // Check if the call already exists in the database
//         const existingCall = await Call.findOne({ participants, callType });
//         if (existingCall) {
//             return res.status(200).json({ data: existingCall });
//         }
//         // Create a new call entry in the database
//         const newCall = new Call({
//             participants,
//             callType,
//             initiatedAt : new Date(),
//             status: 'ringing',
//             roomId,
//         });
//         const receiverId = participants[1]; // The second participant
//         const receiverSocketId = global.onlineUsers?.[receiverId]; // Retrieve socket ID from online users
//         //Emit a socket event to notify the receiver about the incoming call
//         if (receiverSocketId) {
//             global.io.to(receiverSocketId).emit('incomingCall', {
//                 callId: savedCall._id,
//                 callerId: participants[0],
//                 callType,
//                 roomId,
//             });
//         }
//         const savedCall = await newCall.save();
//         res.status(201).json({
//             data : savedCall,
//         });
//     }catch(err){
//         console.log('Error in create call',err.message); 
//         return next(new apiError('Server Error',500));
//     }
// });

// // @desc    Get all calls
// // @route   GET/ api/v1/call/calls
// // @access  Public
// export const getCalls = asyncHandler(async(req,res,next)=>{
// try{
//     const userId = req.user._id;
//     if(!userId){ 
//         return next(new apiError('You are not authorized',500));
//     }
//     const calls = await Call.find();
//     if(!calls){
//         return next(new apiError('Calls not found',400));
//     }
//     return res.status(200).json({data : calls});

// }catch(err){
//     console.log('Error in get calls',err.message); 
//     return next(new apiError('Server Error',500));
// }
// });

// // @desc    Get call
// // @route   GET/ api/v1/call/id
// // @access  Public
// export const getCall = asyncHandler(async(req,res,next)=>{
//     try{
//         const userId = req.user._id;
//         const callId = req.params.id;
//         if(!userId){ 
//             return next(new apiError('You are not authorized',400));
//         }
//         const call = await Call.findById(callId);
//         if(!call){
//             return next(new apiError('Call not found',400));
//         }
//         return res.status(200).json({data : call});
    
//     }catch(err){
//         console.log('Error in get call',err.message); 
//         return next(new apiError('Server Error',500));
//     }
// });

// // @desc    Update call by id
// // @route   PUT/api/v1/call/update/id
// // @access  Public
// export const updateCall = asyncHandler(async(req,res,next)=>{
//     try{
//         const userId = req.user._id;
//         const callId = req.params.id;
//         if(!userId){ 
//             return next(new apiError('You are not authorized',400));
//         }
//         const call = await Call.findById(callId);
//         if(!call){
//             return next(new apiError('Call not found',400));
//         }
//         const updatedCall = await Call.findByIdAndUpdate(
//             callId,
//             req.body,
//             {new:true}
//         );
//         return res.status(200).json({data : updatedCall});
//     }catch(err){
//         console.log('Error in update call',err.message); 
//         return next(new apiError('Server Error',500));
//     }
// });

// // @desc    Delete call by id
// // @route   DELETE/api/v1/call/delete/id
// // @access  Public
// export const deleteCall = asyncHandler(async(req,res,next)=>{
//     try{
//         const userId = req.user._id;
//         const callId = req.params.id;
//         if(!userId){ 
//             return next(new apiError('You are not authorized',400));
//         }
//         const call = await Call.findById(callId);
//         if(!call){
//             return next(new apiError('Call not found',400));
//         }
//         await Call.findByIdAndDelete(callId);
//         return res.status(200).json({data : {}});
//     }catch(err){
//         console.log('Error in delete call',err.message); 
//         return next(new apiError('Server Error',500));
//     }
// });


// // Ensure the function calling fetch is marked as async
// export const acceptCall = asyncHandler(async(req,res,next)=>{
//     try {
//       const response = await fetch('http://localhost:5000/api/v1/call/acceptCall', {
//         method: 'POST', // Or 'GET', depending on your API
//         headers: {
//           'Content-Type': 'application/json',
//           // Any additional headers if needed
//         },
//         body: JSON.stringify({ /* your data here */ }) // if you need to send data
//       });
  
//       const data = await response.json();
//       console.log('Call accepted:', data);
//     } catch (error) {
//       console.error('Error accepting call:', error);
//     }
//   });
  