import express from 'express';
import ForgeSDK from 'forge-apis';
import { processImages } from '../services';
import axios from 'axios';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const AUTODESK_CLIENT_ID = process.env.AUTODESK_CLIENT_ID
const AUTODESK_CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET
const AUTODESK_REDIRECT_URL = process.env.AUTODESK_REDIRECT_URL

const router = express.Router();

/**
 * Entry point for oauth workflow. Redirect the user to the forge API
 * for them to approve us getting access to their data.
 */
router.get('/signin', async (req, res) => {
  res.redirect(302, oauthClient().generateAuthUrl());
});

/**
 * The user is returned here with an auth code we
 * can use to make access tokens.
 */
router.get('/callback', (req, res) => {
    oauthClient().getToken(req.query.code).then( (credentials) => {
        req.session.credentials['autodesk'] = credentials;

        // ugh, so bad
        console.log(credentials);

        res.redirect('/');
    }).catch(e => {
        console.error(e);
        res.send("login failed");
    });
});

router.get('/token', (req, res) => {
  const credentials = req.session.credentials['autodesk'];

  res.json({access_token: credentials['access_token']});
});

/**
 * Given a token this will return a list of hubs that
 * token has access to.
 */
router.get('/hubs', (req, res) => {
  const HubsApi = new ForgeSDK.HubsApi();
  const credentials = req.session.credentials['autodesk'];

  HubsApi.getHubs({}, oauthClient(), credentials).then( (contents) => {
    const hubsData = contents.body.data
    res.json(hubsData);
  }).catch(e => {res.send(e)})
})

/**
 * With the ID of the hub they wish to use we can get
 * a list of projects the user has access to within that hub.
 */
router.get('/hub/:hub_id', (req, res) => {
  const ProjectsApi = new ForgeSDK.ProjectsApi();
  const credentials = req.session.credentials['autodesk'];

  const hubId = req.params['hub_id']

  ProjectsApi.getHubProjects(hubId, {}, oauthClient(), credentials).then( (contents) => {
      res.json(contents.body);
  }).catch(e => {res.send(e)})
})

/**
 * Within the project that's in the hub there are folders.
 */
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
/**
 * Within the folders we find the images we're looking for.
 * This method can also kick of the ingestion process.
 */
router.get('/project/:project_id/folder/:folder_id', (req, res) => {
  const FoldersApi = new ForgeSDK.FoldersApi();
  const credentials = req.session.credentials['autodesk'];
  // TODO: Create session Id on import process
  const sessionId = 1;

  const projectId = req.params['project_id'];
  const folderId = req.params['folder_id'];

  FoldersApi.getFolderContents(projectId, folderId, {}, oauthClient(), credentials).then( (contents) => {
      const itemsData = contents.body['data'];
      const items = itemsData.
        map((d) => {
          const link = `${config.baseurl}/api/autodesk/project/${projectId}/item/${d['id']}/thumbnail`;
          return {
            link: link,
            metadataLink: d['links']['self']['href'],
            name: d['attributes']['displayName'],
            project: projectId,
            id: d['id']
          }
      });

     processImages(items, sessionId, credentials['access_token']);

      res.json(items)
  }).catch(e => {
    console.log(e);
    res.send(e)
  });
});

/**
 * If we need detailed information about an individual
 * image this is how we get it.
 */
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

/**
 * Autodesk generates thumbnails of the images, we can't
 * sign a URL for the user to download but we can proxy
 * the images back to the client.
 */
router.get('/project/:project_id/item/:item_id/thumbnail', (req, res, next) => {
  const DerivativesApi = new ForgeSDK.DerivativesApi();
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

/**
 * oauthClient is the base client for accessing
 * the forge API.
 */
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
