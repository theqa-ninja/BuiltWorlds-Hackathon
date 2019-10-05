import express from 'express';
import { extractExifs } from '../services';
const router = express.Router();

router.post('/extract', async (req, res, next) => {
  const images = req.body;

  const lla = await extractExifs(images);

  res.send(lla);
});

export default router;