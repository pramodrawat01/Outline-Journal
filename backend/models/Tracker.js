import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true, maxlength: 60 },
  archived: { type: Boolean, default: false },
});

const trackerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    startDate: { type: String, required: true }, // YYYY-MM-DD
    useRating: { type: Boolean, default: true },
    habits: [habitSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Tracker', trackerSchema);