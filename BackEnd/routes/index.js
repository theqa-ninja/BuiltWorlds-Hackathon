import express from 'express';
import process from './process';
import autodesk from './autodesk';
import images from './images';
import clusters from './clusters';
import unique from './unique';

const router = express.Router();
router.use('/autodesk', autodesk);
router.use('/process', process);
router.use('/images', images);
router.use('/clusters', clusters);
router.use('/unique', unique);

export default router;
