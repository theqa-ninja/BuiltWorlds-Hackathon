import express from 'express';
import { processImages } from '../services';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const images = req.body;
  const token = req.session.credentials['autodesk'];

  try {
    await processImages(images, token);
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

export default router;