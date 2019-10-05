import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import proxy from 'express-http-proxy';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(session({
  secret: 'this was randomly selected',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  if(!req.session.credentials){
      req.session.credentials = {}
  }

  req.session.credentials['autodesk'] = {
    access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJ1c2VyaWQiOiJKN1FVSjVUTjhTQVQiLCJleHAiOjE1NzAzMDI3NjUsInNjb3BlIjpbInVzZXItcHJvZmlsZTpyZWFkIiwiZGF0YTpzZWFyY2giLCJkYXRhOnJlYWQiLCJidWNrZXQ6cmVhZCIsImFjY291bnQ6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6ImFVakdBR1FKdlc0ak9qQXA3RHQ0bEFNRVB6Q2ZxYll1IiwiZ3JhbnRfaWQiOiIzOHRSelZCYWVCdkRsNE5XT296UG1ldXU3WXBMRkhneiIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6IklGdGk5d0NYMEwxUmhOTmJ0d1lqM2U1aEVCVnhURmowcERwUDJ4TDF1cXVBN0t2bWZLQ1NySnJDQU9zVXg5TmMifQ.DMtUsQTV4bS0BYSth1Ie515hKKwq9ObDMDF2P0vOGjE',
    refresh_token: 'Hg2sGhN77yPtxgNjnRUDa2k8tYJUQFuA6Pcuqtt6Sc',
    token_type: 'Bearer',
    expires_in: 3599,
    expires_at: '2019-10-05T19:12:44.539Z' }

  next()
});

app.use('/api', routes);
app.use('/', proxy('http://localhost:8080'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
