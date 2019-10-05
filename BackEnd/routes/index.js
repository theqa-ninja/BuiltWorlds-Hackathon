import express from 'express';
import exif from './exif';
import autodesk from './autodesk';

const router = express.Router();
router.use('/exif', exif);
router.use('/autodesk', autodesk);

export default router;
