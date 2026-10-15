import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getOverview } from '../controllers/statsController.js';

const router = express.Router();
router.use(protectRoute);
router.get('/overview', getOverview);

export default router;