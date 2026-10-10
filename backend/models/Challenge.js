import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300, default: '' },
    startDate: { type: String, required: true }, // YYYY-MM-DD
    endDate: { type: String, required: true },   // YYYY-MM-DD
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    cover: { type: String, default: 'emerald' },
  },
  { timestamps: true }
);

export default mongoose.model('Challenge', challengeSchema);