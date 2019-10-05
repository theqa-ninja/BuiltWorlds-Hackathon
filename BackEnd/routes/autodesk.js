import express from 'express';
import ForgeSDK from 'forge-apis';
import { processImages } from '../services';
import axios from 'axios';

const AUTODESK_CLIENT_ID = process.env.AUTODESK_CLIENT_ID
const AUTODESK_CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET
const AUTODESK_REDIRECT_URL = process.env.AUTODESK_REDIRECT_URL

const router = express.Router();

router.get('/signin', async (req, res) => {
  res.redirect(302, oauthClient().generateAuthUrl());
});

router.get('/callback', (req, res) => {
    oauthClient().getToken(req.query.code).then( (credentials) => {
        req.session.credentials['autodesk'] = credentials;

        // ugh, so bad
        console.log(credentials);

        res.redirect('/api/autodesk/hubs');
    }).catch(e => {
        console.error(e);
        res.send("login failed");
    });
});

router.get('/hubs', (req, res) => {
  const HubsApi = new ForgeSDK.HubsApi();
  const credentials = req.session.credentials['autodesk'];

  HubsApi.getHubs({}, oauthClient(), credentials).then( (contents) => {
    const hubsData = contents.body.data
    res.json(hubsData);
  }).catch(e => {res.send(e)})
})

router.get('/hub/:hub_id', (req, res) => {
  const ProjectsApi = new ForgeSDK.ProjectsApi();
  const credentials = req.session.credentials['autodesk'];

  const hubId = req.params['hub_id']

  ProjectsApi.getHubProjects(hubId, {}, oauthClient(), credentials).then( (contents) => {
      res.json(contents.body);
  }).catch(e => {res.send(e)})
})

router.get('/hub/:hub_id/project/:project_id', (req, res) => {
  const ProjectsApi = new ForgeSDK.ProjectsApi();
  const credentials = req.session.credentials['autodesk'];

  const hubId = req.params['hub_id'];
  const projectId = req.params['project_id'];

  ProjectsApi.getProjectTopFolders(hubId, projectId, oauthClient(), credentials).then( (contents) => {
      res.json(contents.body);
  }).catch(e => {res.send(e)})
})

// photo dataset
// project b.b91369c2-d2a2-423c-9755-14d71f38ed96
// folder urn:adsk.wipprod:fs.folder:co.DYVvlgcjSfutU4PkWyTtSQ
// curl http://localhost:3000/api/autodesk/project/b.b91369c2-d2a2-423c-9755-14d71f38ed96/folder/urn:adsk.wipprod:fs.folder:co.DYVvlgcjSfutU4PkWyTtSQ
router.get('/project/:project_id/folder/:folder_id', (req, res) => {
  const FoldersApi = new ForgeSDK.FoldersApi();
  const credentials = req.session.credentials['autodesk'];

  const projectId = req.params['project_id'];
  const folderId = req.params['folder_id'];

  FoldersApi.getFolderContents(projectId, folderId, {}, oauthClient(), credentials).then( (contents) => {
      const itemsData = contents.body['data'];

      const items = itemsData.
        map((d) => {
          return {
            link: d['links']['self']['href'],
            name: d['attributes']['displayName'],
            id: d['id']
          }
      });

//      processImages(items, credentials['access_token']);

      res.json(items)
  }).catch(e => {
    console.log(e);
    res.send(e)
  });
});

router.get('/project/:project_id/item/:item_id', (req, res) => {
  const ItemsApi = new ForgeSDK.ItemsApi();
  const credentials = req.session.credentials['autodesk'];

  const projectId = req.params['project_id'];
  const itemId = req.params['item_id'];

  ItemsApi.getItemTip(projectId, itemId, oauthClient(), credentials).then( (contents) => {
      const itemData = contents.body['data'];

      res.json(itemData)
  }).catch(e => {
    console.log(e);
    res.send(e)
  });
});

router.get('/project/:project_id/item/:item_id/thumbnail', (req, res, next) => {
  const ItemsApi = new ForgeSDK.ItemsApi();
  const credentials = req.session.credentials['autodesk'];

  const projectId = req.params['project_id'];
  const itemId = req.params['item_id'];

  ItemsApi.getItemTip(projectId, itemId, oauthClient(), credentials).then( (contents) => {
    const thumbnailURL = contents.body['data'].relationships.thumbnails.meta.link.href;

    res.writeHead(200, {
      'Content-Type': 'image/png'
    });

    axios({
      method: 'get',
      url: thumbnailURL,
      headers: {
        Authorization: `Bearer ${credentials.access_token}`
      },
      responseType: 'stream'
    }).then( response => {
      response.data.on('data', (chunk) => res.write(chunk));
      response.data.on('end', () => res.end())
    })

  }).catch(e => {
    console.log(e);
    res.send(e)
  });
});

function oauthClient() {
  return new ForgeSDK.AuthClientThreeLegged(
      AUTODESK_CLIENT_ID,
      AUTODESK_CLIENT_SECRET,
      AUTODESK_REDIRECT_URL,
      [
          'data:read',
          'data:search',
          'bucket:read',
          'viewables:read',
          'user-profile:read',
          'account:read',
      ],
      true);
}

export default router;
