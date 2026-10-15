import mongoose from 'mongoose';

const trackerDaySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tracker: { type: mongoose.Schema.Types.ObjectId, ref: 'Tracker', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    done: [{ type: mongoose.Schema.Types.ObjectId }], // habit ids ticked that day
    rating: { type: String, enum: ['', 'good', 'better', 'best'], default: '' },
  },
  { timestamps: true }
);

trackerDaySchema.index({ tracker: 1, date: 1 }, { unique: true });

export default mongoose.model('TrackerDay', trackerDaySchema);