import express from 'express';
import {
  getAuthorProfile,
  getAuthorItems,
  getFeed,
  getPublicBlog,
  getPublicJournal,
  getPublicDiary,
  getPublicDiaryEntry,
} from '../controllers/publicController.js';

const router = express.Router();

router.get('/feed', getFeed);
router.get('/blogs/:id', getPublicBlog);
router.get('/journals/:id', getPublicJournal);
router.get('/diaries/:id', getPublicDiary);
router.get('/diaries/:id/entries/:entryId', getPublicDiaryEntry);
router.get('/users/:username', getAuthorProfile);
router.get('/users/:username/items', getAuthorItems);

export default router;