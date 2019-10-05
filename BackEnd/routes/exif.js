import express from 'express';
import { Exif } from '../services';
const router = express.Router();


router.post('/extract', async (req, res, next) => {
  const images = req.body;

  const exifs = images.map((image) => {
    return new Exif(url);
  })
  res.send(exif);
});

export default router;