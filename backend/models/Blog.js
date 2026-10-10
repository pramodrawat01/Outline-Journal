import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: mongoose.Schema.Types.Mixed, default: null }, // Tiptap JSON
    excerpt: { type: String, default: '' },
    readTime: { type: Number, default: 1 },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  },
  { timestamps: true }
);

blogSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Blog', blogSchema);