import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  listDiaries,
  getDiary,
  createDiary,
  updateDiary,
  deleteDiary,
} from '../controllers/diaryController.js';

const router = express.Router();
router.use(protectRoute);

router.route('/').get(listDiaries).post(createDiary);
router.route('/:id').get(getDiary).put(updateDiary).delete(deleteDiary);

export default router;