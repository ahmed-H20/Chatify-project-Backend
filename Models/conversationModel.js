import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default : [],
    }],
    lastSeenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    lastMessageTimestamp: {
        type: Date,
    },
    unreadMessagesCount: {
        type: Number,
    },
    lastSeenTimestamp: {
        type: Date,
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    groupTitle: {
        type: String,
    },
    groupDescription: {
        type: String,
    },
    groupPicture: {
        type: String,
    }
},{timeseries:true,});

const Conversation = new mongoose.model('Conversation', conversationSchema);

export default Conversation;