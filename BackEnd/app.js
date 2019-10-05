import express from 'express';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import session from 'express-session';

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
    access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJ1c2VyaWQiOiJKN1FVSjVUTjhTQVQiLCJleHAiOjE1NzAyOTg4NDIsInNjb3BlIjpbInVzZXItcHJvZmlsZTpyZWFkIiwiZGF0YTpzZWFyY2giLCJkYXRhOnJlYWQiLCJidWNrZXQ6cmVhZCIsImFjY291bnQ6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6ImFVakdBR1FKdlc0ak9qQXA3RHQ0bEFNRVB6Q2ZxYll1IiwiZ3JhbnRfaWQiOiI1NXZ5UFJOcEhkS2xzT1VQZkQ2Z0VwNjF6MlpsMFYwYSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6InFSYmthS3d0UDF4YzhmYlhQeDBCUWlLWUREeks0YVQ5NHFPTHJBY29DTlc5QzF3M010dzBhcWdYVWdZbGlQdEEifQ.0ydJKAMtv471d2jrNMW4UH-703C06z-9oNvihqrS8y8',
    refresh_token: 'nTDrFZZanzho2t4L3s8lGwpNMzFWurXdQ5gkjz51VF',
    token_type: 'Bearer',
    expires_in: 3599,
    expires_at: '2019-10-05T18:07:21.489Z'
  }

  next()
});


app.get('/', (req, res) => {
  res.send("Hello");
})

app.use('/api', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
