import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { listMyBlogs, getMyBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';

const router = express.Router();
router.use(protectRoute);

router.route('/').get(listMyBlogs).post(createBlog);
router.route('/:id').get(getMyBlog).put(updateBlog).delete(deleteBlog);


export default router;