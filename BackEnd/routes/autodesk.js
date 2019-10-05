import express from 'express';
import ForgeSDK from 'forge-apis';

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

  HubsApi.getHubs({}, oauthClient(), credentials).then( (hubs) => {
      res.json(hubs.body);
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
router.get('/project/:project_id/folder/:folder_id', (req, res) => {
  const FoldersApi = new ForgeSDK.FoldersApi();
  const credentials = req.session.credentials['autodesk'];

  const projectId = req.params['project_id'];
  const folderId = req.params['folder_id'];

  FoldersApi.getFolderContents(projectId, folderId, {}, oauthClient(), credentials).then( (contents) => {
      res.json(contents.body);
  }).catch(e => {res.send(e)});
})

router.get('/object/:id', (req, res) => {
  const ObjectsApi = new ForgeSDK.ObjectsApi();
  const credentials = req.session.credentials['autodesk'];

  const objectId = req.params['id'];

  ObjectsApi.getSignedResource(objectId, {}, oauthClient, credentials).then( (contents) => {
    res.json(contents.body);
  }).catch(e => {res.send(e)});
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
