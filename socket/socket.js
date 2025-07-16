import { Server } from 'socket.io';
import cors from 'cors';
import Message from '../Models/messageModel.js';
import Call from '../Models/callModel.js'; 
import { generateRoomId } from '../utils/generateRoomId.js';

let onlineUsers = {}; // تخزين المستخدمين المتصلين

export const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true, 
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

    socket.on("typing", ({ senderId, receiverId }) => {
      const roomId = generateRoomId(senderId, receiverId)
      io.to(roomId).emit("userTyping", { senderId })
    })


    // إرسال رسالة خاصة
// داخل sendMessage socket event فقط
// داخل sendMessage socket event فقط
socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
  const roomId = generateRoomId(senderId, receiverId);
  socket.join(roomId);

  const newMessage = new Message({
    senderId,
    receiverId,
    messageType: 'text',
    participants: [senderId, receiverId],
    message,
    isRead: false,
  });

  await newMessage.save();

  let sender = { name: "Unknown", avatar: "" };
  try {
    const senderUser = await Message.findById(newMessage._id).populate("senderId", "name avatar");
    if (senderUser && senderUser.senderId) {
      sender = {
        name: senderUser.senderId.name,
        avatar: senderUser.senderId.avatar,
      };
    }
  } catch (err) {
    console.error("❌ Failed to populate sender info:", err);
  }

  const receiverSocketId = onlineUsers[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("updateChatList", {
      id: receiverId,
      name: sender.name,
      avatar: sender.avatar,
      message: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unread: true,
    });
  }

  io.to(roomId).emit("receiveMessage", {
    id: newMessage._id,
    content: newMessage.message,
    senderId: newMessage.senderId,
    createdAt: newMessage.createdAt,
    isRead: newMessage.isRead,
  });

  console.log(`✉️ Message sent in room ${roomId}`);
});




  socket.on("readMessage", async ({ userId, senderId, receiverId }) => {    
    const roomId = generateRoomId(senderId, receiverId);
    try {
      const result = await Message.updateMany(
        {
          participants: { $all: [senderId, receiverId] }, 
          receiverId: receiverId,
          isRead: false,
        },
        { $set: { isRead: true } }
      );

      console.log(`✅ Updated ${result.modifiedCount} messages to read`);

      io.to(roomId).emit("messageRead", { readerId: userId, roomId });
    } catch (error) {
      console.error("❌ Error updating read status:", error);
    }
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

