import express from 'express';

const router = express.Router();

router.post('/extract', (req, res, next) => {
  const images = req.body;

  console.log(images);
  res.send('it working');
});

export default router;