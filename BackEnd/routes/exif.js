import express from 'express';
import { Exif } from '../services';
const router = express.Router();


router.post('/extract', async (req, res, next) => {
  const images = req.body;

  const exifs = images.map(async (url) => {
    const exif = new Exif(url);
    return await exif.extractGPSAsArray();
  })

  console.log(exifs);
  res.send(exifs);
});

export default router;