import express from 'express';
import { exif } from '../services';
const router = express.Router();

router.post('/extract', async (req, res, next) => {
  const images = req.body;

  const lla = await exif.extractExifs(images);

  res.send(lla);
});

export default router;