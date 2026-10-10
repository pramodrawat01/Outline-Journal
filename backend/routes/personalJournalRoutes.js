import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  listPersonalJournals,
  getPersonalJournal,
  createPersonalJournal,
  updatePersonalJournal,
  deletePersonalJournal,
} from '../controllers/personalJournalController.js';

const router = express.Router();
router.use(protectRoute);

router.route('/').get(listPersonalJournals).post(createPersonalJournal);
router.route('/:id').get(getPersonalJournal).put(updatePersonalJournal).delete(deletePersonalJournal);

export default router;