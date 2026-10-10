import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkUsername, saveOnboarding } from '../controllers/profileController.js';

const router = express.Router();
router.use(protectRoute);

router.get('/username-check', checkUsername);
router.patch('/onboarding', saveOnboarding);

export default router;