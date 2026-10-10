import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createChallenge, listChallenges, deleteChallenge } from '../controllers/challengeController.js';
import { listJournals, getJournal, saveJournal } from '../controllers/journalController.js';

const router = express.Router();
router.use(protectRoute);

router.route('/').get(listChallenges).post(createChallenge);
router.delete('/:id', deleteChallenge);
router.get('/:id/journals', listJournals);
router.route('/:id/journals/:date').get(getJournal).put(saveJournal);

export default router;