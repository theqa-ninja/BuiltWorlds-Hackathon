import express from 'express';
// import Sequelize from 'sequelize'
import { images } from '../models'
// import { clusters } from '../clusters'
const router = express.Router();

// ../unique/sessions/
router.get('/sessions/', async (req, res, next) => {
  try
  {
    var temp = await images.findAll({
      attributes: ['session_id'],
      group: ['session_id']
    });
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

// ../unique/clusters/
router.get('/clusters/', async (req, res, next) => {
  try
  {
    var temp = await images.findAll({
      attributes: ['cluster_id'],
      group: ['cluster_id']
    });
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

// ../unique/makemodel/
router.get('/makemodel/', async (req, res, next) => {
  try
  {
    var temp = await images.findAll({
      attributes: ['make', 'model'],
      group: ['make', 'model']
    });
    console.log(temp);
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

export default router;
