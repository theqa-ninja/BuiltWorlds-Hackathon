const express = require('express');
const ForgeSDK = require('forge-apis');
const session = require('express-session');
const app = express();
const port = 3000;

const AUTODESK_CLIENT_ID = process.env.AUTODESK_CLIENT_ID
const AUTODESK_CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET
const AUTODESK_REDIRECT_URL = process.env.AUTODESK_REDIRECT_URL

app.set('trust proxy', 1);

app.use(session({
    secret: 'this was randomly selected',
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    console.log('---middleware');

    if(!req.session.credentials){
        req.session.credentials = {}
    }

    req.session.credentials['autodesk'] = {
         access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJ1c2VyaWQiOiJKN1FVSjVUTjhTQVQiLCJleHAiOjE1NzAyOTY0NTcsInNjb3BlIjpbInVzZXItcHJvZmlsZTpyZWFkIiwiZGF0YTpzZWFyY2giLCJkYXRhOnJlYWQiLCJidWNrZXQ6cmVhZCIsImFjY291bnQ6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6ImFVakdBR1FKdlc0ak9qQXA3RHQ0bEFNRVB6Q2ZxYll1IiwiZ3JhbnRfaWQiOiJGNkNwOG9DMXZ0dmlTb3lENUt2b2FnWUtGY0tad0VYVCIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6ImI3bENFcGdhb05pTWtGTjRvY2ZVS1ZaQ3BzeDVvbnh3NjZyeFlxSDRkcWVjVzJ4RHBYZ2JFS3NHZmZDb1VlN1IifQ.abSnGY4RldoF-7xd9gqw6npDB6PaMd4QRBMrDzgsGW8',
        refresh_token: '7j9QJ1SgTOatotUnZpwo8gPjZUCPXHwf6fKC5SJOpB',
        token_type: 'Bearer',
        expires_in: 3599,
        expires_at: '2019-10-05T17:27:36.470Z' }

    next()
});

app.get('/auth/signin', (req, res) => {
    res.redirect(302, oauthClient().generateAuthUrl());
})

app.get('/auth/callback', (req, res) => {
    oauthClient().getToken(req.query.code).then( (credentials) => {
        req.session.credentials['autodesk'] = credentials;

        // ugh, so bad
        console.log(credentials);

        res.redirect('/user_info');
    }).catch(e => {
        console.error(e);
        res.send("login failed");
    });
})

app.get('/user_info', (req, res) => {
    const UserApi = new ForgeSDK.UserProfileApi();
    const credentials = req.session.credentials['autodesk'];

    UserApi.getUserProfile(oauthClient(), credentials).then( (profile) => {
        res.json(profile);
    }).catch(e => {
        res.send(e);
    });
})

app.get('/hubs', (req, res) => {
    const HubsApi = new ForgeSDK.HubsApi();
    const credentials = req.session.credentials['autodesk'];

    HubsApi.getHubs({}, oauthClient(), credentials).then( (hubs) => {
        res.json(hubs);
    }).catch(e => {res.send(e)})
})

app.get('/hub/:hub_id', (req, res) => {
    const ProjectsApi = new ForgeSDK.ProjectsApi();
    const credentials = req.session.credentials['autodesk'];

    const hubId = req.params['hub_id']

    ProjectsApi.getHubProjects(hubId, {}, oauthClient(), credentials).then( (contents) => {
        res.json(contents);
    }).catch(e => {res.send(e)})
})


app.get('/images', (req, res) => {
    const FoldersApi = new ForgeSDK.FoldersApi();
    const credentials = req.session.credentials['autodesk'];

    const projectId = "b91369c2-d2a2-423c-9755-14d71f38ed96"
    const folderId = "DYVvlgcjSfutU4PkWyTtSQ"

    FoldersApi.getFolderContents(projectId, folderId, {}, oauthClient(), credentials).then( (contents) => {
        res.json(contents);
    }).catch(e => {res.send(e)})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

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
