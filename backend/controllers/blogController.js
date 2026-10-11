import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { makeExcerpt, readTimeOf } from '../utils/excerpt.js';

const notFound = (res) => res.status(404).json({ message: 'Blog not found' });

export const listMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id })
      .select('-content')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load blogs' });
  }
};

export const getMyBlog = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const blog = await Blog.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!blog) return notFound(res);
    res.json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load blog' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, visibility } = req.body;

    const t = String(title ?? '').trim().slice(0, 150);
    if (!t) return res.status(400).json({ message: 'A title is required' });
    if (content != null && typeof content !== 'object') {
      return res.status(400).json({ message: 'Invalid content' });
    }

    const blog = await Blog.create({
      user: req.user._id,
      title: t,
      content: content ?? null,
      excerpt: makeExcerpt(content),
      readTime: readTimeOf(content),
      visibility: visibility === 'private' ? 'private' : 'public',
    });

    res.status(201).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not publish blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const deleted = await Blog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return notFound(res);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete blog' });
  }
};


export const updateBlog = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const { title, content, visibility } = req.body;

    const t = String(title ?? '').trim().slice(0, 150);
    if (!t) return res.status(400).json({ message: 'A title is required' });
    if (content != null && typeof content !== 'object') {
      return res.status(400).json({ message: 'Invalid content' });
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $set: {
          title: t,
          content: content ?? null,
          excerpt: makeExcerpt(content),
          readTime: readTimeOf(content),
          visibility: visibility === 'private' ? 'private' : 'public',
        },
      },
      { new: true }
    );
    if (!blog) return notFound(res);

    res.json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save changes' });
  }
};