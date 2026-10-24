import express from 'express';
import multer from 'multer';
import { protectRoute } from '../middleware/auth.middleware.js'; // same import as blogRoutes.js
import { uploadImage } from '../controllers/uploadController.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, WebP or GIF images are allowed')),
});

// turns multer errors into normal JSON responses
const receive = (req, res, next) =>
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Image must be 8 MB or smaller' });
    }
    return res.status(400).json({ message: err.message || 'Upload failed' });
  });

const router = express.Router();
router.post('/image', protectRoute, receive, uploadImage);

export default router;