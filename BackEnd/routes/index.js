import express from 'express';
import exif from './exif';

const router = express.Router();
router.use('/exif', exif);

export default router;
