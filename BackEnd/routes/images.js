import express from 'express';
import { images } from '../models'
const router = express.Router();

// ../images/
router.get('/', async (req, res, next) => {
  try
  {
    var temp = await images.findAll();
    res.status(200);
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

// ../images/:image_id
router.get('/:image_id', async (req, res, next) => {
  try
  {
    var image_id = req.params.image_id;
    var temp = await images.findByPk(image_id);
    res.status(200);
    if (temp == null)
      res.json(image_id + " is not a valid image id")
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

export default router;
