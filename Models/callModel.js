import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
    participants:[{  // Users in the call
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }], 
    callType: {  // Call type
        type: String,
        enum: ['audio', 'video'], 
        required: true 
    }, 
    initiatedAt: {  // When the call starts ringing
        type: Date, 
        //required: true }, 
    },   
    answeredAt: {  // When the call is answered
        type: Date,
     }, 
     startedAt: {  // When the conversation starts (same as answeredAt)
         type: Date 
        }, 
    endedAt: {   // End time (optional if ongoing)
        type: Date
     }, 
    status: {  // Call status
        type: String, 
        enum: ['ringing','ongoing', 'missed', 'completed', 'rejected'],
        default: 'ringing' 
    }, 
    roomId: { 
        type: String, 
        unique: true }, 
  },
  {timestamps:true}
);

  const Call = new mongoose.model('Call' , callSchema);

  export default Call;
