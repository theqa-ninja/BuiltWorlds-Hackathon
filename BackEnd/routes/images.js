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

// ../images/session/:session_id
router.get('/session/:session_id', async (req, res, next) => {
  try
  {
    var sid = req.params.session_id;
    var temp = await images.findAll({
      where: {
        session_id: sid
      },
      order: [ 'cluster_id', 'created_at' ]
    });
    if (temp == null)
      res.json(sid + " is not a valid session id");
    else
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
      res.json(image_id + " is not a valid image id");
    else
      res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

export default router;
