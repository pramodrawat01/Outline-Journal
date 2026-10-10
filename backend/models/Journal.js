import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', default: null, index: true },
    diary: { type: mongoose.Schema.Types.ObjectId, ref: 'Diary', default: null, index: true },
    title: { type: String, trim: true, maxlength: 120, default: '' },
    content: { type: mongoose.Schema.Types.Mixed, default: null }, // Tiptap JSON
    excerpt: { type: String, default: '' },
    entryDate: { type: String, required: true }, // YYYY-MM-DD
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  },
  { timestamps: true }
);

// one journal per day per challenge (standalone journals are not restricted)
journalSchema.index(
  { user: 1, challenge: 1, entryDate: 1 },
  { unique: true, partialFilterExpression: { challenge: { $type: 'objectId' } } }
);

export default mongoose.model('Journal', journalSchema);