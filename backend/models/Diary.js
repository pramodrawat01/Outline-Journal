import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 200, default: '' },
    icon: { type: String, default: '📓' },
    cover: { type: String, default: 'emerald' },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  },
  { timestamps: true }
);

export default mongoose.model('Diary', diarySchema);