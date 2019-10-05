import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import proxy from 'express-http-proxy';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;
const VUE_PROXY_URL = process.env.VUE_PROXY_URL || 'http://localhost:8080';

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
    access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJ1c2VyaWQiOiJKN1FVSjVUTjhTQVQiLCJleHAiOjE1NzAzMDkwNDAsInNjb3BlIjpbInVzZXItcHJvZmlsZTpyZWFkIiwiZGF0YTpzZWFyY2giLCJkYXRhOnJlYWQiLCJidWNrZXQ6cmVhZCIsImFjY291bnQ6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6ImFVakdBR1FKdlc0ak9qQXA3RHQ0bEFNRVB6Q2ZxYll1IiwiZ3JhbnRfaWQiOiJRd0Q3RTAyZ2s1MXFpdm12ZE5XbGFDZEdiN3Zsa2U3ciIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6IlR5WnoxWUp5cEtmWVVqcGtCQmNXQk83dTdNdGg5Tklja2tWOHBJb29lbDZvOTJKblhNdlFDZXFEWnVMb2VjTkcifQ.xIFdbvWE7d-CWafbICx8s5jVOUP64wwT3VZxnHGSsjc',
    refresh_token: 'xYvvz8SOPyw3thGFL90A4xlzn8cg697RreUuvoVkDi',
    token_type: 'Bearer',
    expires_in: '3599',
    expires_at: '2019-10-05T20:57:19.504Z'
  }

  next()
});

app.use('/api', routes);
app.use('/', proxy(VUE_PROXY_URL));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
