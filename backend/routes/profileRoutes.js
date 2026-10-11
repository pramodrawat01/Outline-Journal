import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkUsername, getMyProfile, saveOnboarding, updateMyProfile } from '../controllers/profileController.js';

const router = express.Router();
router.use(protectRoute);

router.get('/username-check', checkUsername);
router.patch('/onboarding', saveOnboarding);
router.route('/me').get(getMyProfile).patch(updateMyProfile)

export default router;