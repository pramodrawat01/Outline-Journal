import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { listMyBlogs, getMyBlog, createBlog, deleteBlog } from '../controllers/blogController.js';

const router = express.Router();
router.use(protectRoute);

router.route('/').get(listMyBlogs).post(createBlog);
router.route('/:id').get(getMyBlog).delete(deleteBlog);

export default router;