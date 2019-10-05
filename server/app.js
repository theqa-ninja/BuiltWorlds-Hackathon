const express = require('express');
const ForgeSDK = require('forge-apis');
const session = require('express-session')
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

    next()
});

app.get('/', (req, res) => {res.send("Hello")})

app.get('/auth/signin', (req, res) => {
    res.redirect(302, oauthClient().generateAuthUrl());
})

app.get('/auth/callback', (req, res) => {
    oauthClient().getToken(req.query.code).then( (credentials) => {
        console.log("--- 1 ---");
        req.session.credentials['autodesk'] = credentials;

        console.log(req.session.credentials);

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
        res.send("hello again!");
    }).catch(e => {
        console.error(e);
        res.send("error pulling profile");
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function oauthClient() {
    return new ForgeSDK.AuthClientThreeLegged(
        AUTODESK_CLIENT_ID,
        AUTODESK_CLIENT_SECRET,
        AUTODESK_REDIRECT_URL,
        [
            'data:read'
        ],
        true);
}
