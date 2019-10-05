import express from 'express';
import exif from './exif';
import process from './process';
import autodesk from './autodesk';

const router = express.Router();
router.use('/exif', exif);
router.use('/autodesk', autodesk);
router.use('/process', process);

export default router;
