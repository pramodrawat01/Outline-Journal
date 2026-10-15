import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  listTrackers,
  getTracker,
  createTracker,
  updateTracker,
  deleteTracker,
  saveDay,
} from '../controllers/trackerController.js';

const router = express.Router();
router.use(protectRoute);

router.route('/').get(listTrackers).post(createTracker);
router.route('/:id').get(getTracker).put(updateTracker).delete(deleteTracker);
router.put('/:id/days/:date', saveDay);

export default router;