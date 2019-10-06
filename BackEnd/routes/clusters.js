import express from 'express';
import { clusters } from '../models'
const router = express.Router();

// ../clusters/
router.get('/', async (req, res, next) => {
  try
  {
    var temp = await clusters.findAll();
    res.status(200);
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

// ../clusters/:cluster_id
router.get('/:cluster_id', async (req, res, next) => {
  try
  {
    var cluster_id = req.params.cluster_id;
    var temp = await clusters.findByPk();
    res.status(200);
    if (temp == null)
      res.json(cluster_id + " is not a valid cluster id");
    else
      res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

export default router;
