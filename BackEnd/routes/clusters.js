import express from 'express';
import { clusters } from '../models'
import { images } from '../models'
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

// ../clusters/import
router.post('/import/:session_id', async (req, res, next) => {
  try
  {
    var sid = req.params.session_id;
    // console.log(req.body);
    var clust = req.body;
    // console.log(clust);
    var temp = [];
    const generatedToIdMap = {};

    for (let [img, group] of Object.entries(clust)) {
      console.log(img,group);
      if (!generatedToIdMap.hasOwnProperty(group)) {
        //Generate new cluster and map into generatedToIdMap
        const newCluster = await clusters.create({
          session_id: sid,
          generated_id: group
        });

        generatedToIdMap[group] = newCluster.id;
      }

      const newClusterId = generatedToIdMap[group];
      var tweak = await images.update({
        // Update Image
        cluster_id: newClusterId
      }, {
        where: {
          session_id: sid,
          filename: img
        }
      });
      temp.push(tweak);
    }
    res.json(temp);
  }
  catch (ex)
  {
    return next(ex);
  }
});

// // ../clusters/session/:session_id
// router.get('/session/:session_id', async (req, res, next) => {
//   try
//   {
//     var sid = req.params.session_id;
//     var temp = await images.findAll({
//       where: {
//         session_id: sid,
//       },
//       order: [ 'cluster_id', 'created_at' ]
//     });
//     if (temp == null)
//       res.json(sid + " is not a valid session id");
//     else
//       res.json(temp);
//   }
//   catch (ex)
//   {
//     return next(ex);
//   }
// });

export default router;
