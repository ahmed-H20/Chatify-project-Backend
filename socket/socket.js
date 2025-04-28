import { Server } from 'socket.io';
import cors from 'cors';
import Message from '../Models/messageModel.js';
import Call from '../Models/callModel.js'; 
import { generateRoomId } from '../utils/generateRoomId.js';

let onlineUsers = {}; // تخزين المستخدمين المتصلين

export const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  global.io = io;
  global.onlineUsers = onlineUsers;

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // تسجيل دخول المستخدم
    socket.on('register', (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`👤 User ${userId} registered with socket ID ${socket.id}`);
    });

    // إرسال رسالة خاصة
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      const roomId = generateRoomId(senderId, receiverId);
      socket.join(roomId);

      const newMessage = new Message({
        senderId,
        receiverId,
        messageType: 'text',
        participants: [senderId, receiverId],
        message,
      });

      await newMessage.save();

      io.to(roomId).emit('receiveMessage', {
        senderId,
        message,
      });

      console.log(`✉️ Message sent in room ${roomId}`);
    });

    // بدء مكالمة
    socket.on('startCalling', async ({ callerId, calleeId }) => {
      const roomId = generateRoomId(callerId, calleeId);
      socket.join(roomId);

      const calleeSocket = onlineUsers[calleeId];
      if (calleeSocket) {
        io.to(calleeSocket).emit('incomingCall', {
          callerId,
          roomId,
        });
        console.log(`📞 Calling from ${callerId} to ${calleeId} (room: ${roomId})`);
      }

      // سجل المكالمة الجديدة في قاعدة البيانات
      const newCall = new Call({
        participants: [callerId, calleeId],
        callType: 'audio', // تقدر تخصص حسب نوع الاتصال
        status: 'ringing',
        roomId,
        initiatedAt: new Date(),
      });
      await newCall.save();
    });

    // المستخدم انضم لغرفة
    socket.on('joinRoom', ({ user1, user2 }) => {
      const roomId = generateRoomId(user1, user2);
      socket.join(roomId);
      console.log(`🚪 ${socket.id} joined room ${roomId}`);
    });

    // قبول المكالمة
    socket.on('acceptCall', async ({ roomId }) => {
      io.to(roomId).emit('callAccepted');
      console.log(`✅ Call accepted in room ${roomId}`);

      await Call.findOneAndUpdate({ roomId }, { status: 'ongoing' });
    });

    // إنهاء المكالمة
    socket.on('endCall', async ({ roomId }) => {
      io.to(roomId).emit('callEnded');
      console.log(`🛑 Call ended in room ${roomId}`);

      await Call.findOneAndUpdate({ roomId }, { status: 'ended' });
    });

    // رفض المكالمة
    socket.on('rejectCall', async ({ roomId }) => {
      io.to(roomId).emit('callRejected');
      console.log(`🚫 Call rejected in room ${roomId}`);

      await Call.findOneAndUpdate({ roomId }, { status: 'rejected' });
    });

    // WebRTC - إشارات الاتصال
    socket.on('webrtcOffer', ({ roomId, offer }) => {
      socket.to(roomId).emit('webrtcOffer', offer);
    });

    socket.on('webrtcAnswer', ({ roomId, answer }) => {
      socket.to(roomId).emit('webrtcAnswer', answer);
    });

    socket.on('webrtcCandidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('webrtcCandidate', candidate);
    });

    // قطع الاتصال
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
    });
  });
};



// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import { Server } from 'socket.io';
// import Message from '../Models/messageModel.js';
// import { generateRoomId } from '../utils/generateRoomId.js';

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// global.io = io;

// const onlineUsers = {};

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

// // تسجيل المستخدم
// socket.on('register', (userId) => {
//     onlineUsers[userId] = socket.id;
//     console.log(`User ${userId} registered with socket ID ${socket.id}`);
//   });

// // إرسال رسالة خاصة
// socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
//     const roomId = generateRoomId(senderId, receiverId);
//     socket.join(roomId);

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       messageType: 'text',
//       participants: [senderId, receiverId],
//       message,
//     });

//     await newMessage.save();

//     // إرسال الرسالة للطرفين في نفس الغرفة
//     io.to(roomId).emit('receiveMessage', {
//       senderId,
//       message
//     });

//     console.log(`Message sent in room ${roomId}`);
//   });

// // إجراء مكالمة
// socket.on('callUser', ({ callerId, calleeId }) => {
//     const roomId = generateRoomId(callerId, calleeId);
//     socket.join(roomId);

//     const calleeSocket = onlineUsers[calleeId];
//     if (calleeSocket) {
//       io.to(calleeSocket).emit('incomingCall', {
//         callerId,
//         roomId
//       });
//       console.log(`Call from ${callerId} to ${calleeId} in room ${roomId}`);
//     }
//   });

// // الانضمام لغرفة
// socket.on('joinRoom', ({ user1, user2 }) => {
//     const roomId = generateRoomId(user1, user2);
//     socket.join(roomId);
//     console.log(`${socket.id} joined room ${roomId}`);
//   });

// // قبول المكالمة
// socket.on('acceptCall', ({ roomId }) => {
//     socket.join(roomId);
//     socket.to(roomId).emit('callAccepted');
//   });

// // إنهاء المكالمة
// socket.on('endCall', ({ roomId }) => {
//     io.to(roomId).emit('callEnded');
//   });

// // إشارات WebRTC
// socket.on('webrtcOffer', ({ roomId, offer }) => {
//     socket.to(roomId).emit('webrtcOffer', offer);
//   });

// socket.on('webrtcAnswer', ({ roomId, answer }) => {
//     socket.to(roomId).emit('webrtcAnswer', answer);
//   });

// socket.on('webrtcCandidate', ({ roomId, candidate }) => {
//     socket.to(roomId).emit('webrtcCandidate', candidate);
//   });

// socket.on('rejectCall', ({ roomId }) => {
//     io.to(roomId).emit('callRejected');
//   });

// // عندما يبدأ الاتصال
// socket.on('startCalling', ({ callerId, calleeId, roomId }) => {
//   io.to(roomId).emit('calling', { callerId }); // للمستقبل: "يرن"
//   console.log(` Calling from ${callerId} to ${calleeId}`);
// });

// // عندما يكون "جارٍ الاتصال"
// socket.on('callingProgress', ({ roomId }) => {
//   io.to(roomId).emit('callProgress', { status: 'calling' });
// });

// //  تم الرفض
// socket.on('rejectCall', ({ roomId }) => {
//   io.to(roomId).emit('callRejected');
//   console.log(`Call rejected in room ${roomId}`);
// });

// // تم إنهاء المكالمة
// socket.on('endCall', ({ roomId }) => {
//   io.to(roomId).emit('callEnded');
//   console.log(`Call ended in room ${roomId}`);
// });


// // قطع الاتصال
// socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     for (const userId in onlineUsers) {
//       if (onlineUsers[userId] === socket.id) {
//         delete onlineUsers[userId];
//         break;
//       }
//     }
//   });
// });

// export { app, server, io };
