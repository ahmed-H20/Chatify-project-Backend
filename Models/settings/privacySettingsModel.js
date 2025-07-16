import mongoose from 'mongoose';

const privacySettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // كل مستخدم له إعدادات واحدة فقط
  },
  photoVisibility: {
    type: String,
    enum: ['everyone', 'contacts', 'no_one'],
    default: 'everyone',
  },
  canAddMe: {
    type: String,
    enum: ['everyone', 'friends_only'],
    default: 'everyone',
  },
  canMessageMe: {
    type: String,
    enum: ['everyone', 'contacts'],
    default: 'everyone',
  },
}, {
  timestamps: true,
});

export default mongoose.model('PrivacySettings', privacySettingsSchema);
