import express from 'express';
import process from './process';
import autodesk from './autodesk';

const router = express.Router();
router.use('/autodesk', autodesk);
router.use('/process', process);

export default router;
