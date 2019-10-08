import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import proxy from 'express-http-proxy';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
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

  if(env == 'development') {
    req.session.credentials['autodesk'] = {
      access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJ1c2VyaWQiOiJKN1FVSjVUTjhTQVQiLCJleHAiOjE1NzAzOTAwMzAsInNjb3BlIjpbInVzZXItcHJvZmlsZTpyZWFkIiwiZGF0YTpzZWFyY2giLCJkYXRhOnJlYWQiLCJidWNrZXQ6cmVhZCIsImFjY291bnQ6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6ImFVakdBR1FKdlc0ak9qQXA3RHQ0bEFNRVB6Q2ZxYll1IiwiZ3JhbnRfaWQiOiI1dDJXR25rS0JjUTZXV3NBYnZSMDc0NnJCUFFQeUxETSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6IlpzVTQ5YlBScnVpSmZGN0VHaU13ZFpDaVB3V3FoUGE1Z3RPdldONWpkaVp6Yjl1VWYxb0VEUTdoUXBXS1d5UkwifQ.fP4NbeHoc8u1sfXFe9asgfKR2YqHQS5fe0UW6qZ_Jt4',
      refresh_token: 'oHTTNzt7yAz9TTz40hm3Jv0rgX4q6IsDi8IO2qW6MI',
      token_type: 'Bearer',
      expires_in: 3599,
      expires_at: '2019-10-06T19:27:09.452Z'
    }
  }
  next()
});

app.use('/api', routes);
app.use('/', proxy(VUE_PROXY_URL));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
