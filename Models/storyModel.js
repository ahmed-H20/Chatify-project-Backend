
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mediaUrl: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ['text','image', 'video'],
    required: true,
  },
  caption: {
    type: String,
  },
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 ساعة بالثواني: عشان الستوري تمسح تلقائيًا
  },
});

const Story = mongoose.model('Story', storySchema);

export default Story;
