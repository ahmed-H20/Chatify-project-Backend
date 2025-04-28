import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    messageType: {
        type: String,
        required: true
    },
    roomId: {
        type: String, 
      },
    seenBy: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User' ,
    },
    userSeen:{
        type: Boolean,
        default: false
    }
}, {timestamps : true}
);

const Message = new mongoose.model('Message', messageSchema);

export default Message;