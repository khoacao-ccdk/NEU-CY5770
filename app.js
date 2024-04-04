const express = require('express');
const fs = require('fs');
const jwt = require('./components/jwt/JWT');
const utils = require('./components/utils');
const jwtData = require('./components/jwt/JWTData') //this file contains information that are used to sign/verify jwt
const dbManager = require('./components/db/DBManager');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;

//Read Private and Public key from file
const PRIVATE_KEY  = fs.readFileSync('./components/secret/private.key', 'utf-8').replace(/\\n/g, '\n');
const PUBLIC_KEY  = fs.readFileSync('./components/secret/public.key', 'utf-8').replace(/\\n/g, '\n');

//Connect to MongoDB
dbManager.connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/login', async (req, res) => {
  // Sign the JWT
  const signedToken = jwt.sign(req.body, PRIVATE_KEY, jwtData.SIGN_OPTIONS);

  let userID = req.body.userID;
  await dbManager.writeToDB(userID, "123");
  
  //Return jwt to result
  res.status(200).json({
    token: signedToken
  });
});

app.get('/data', (req, res) => {
  let token = utils.extractToken(req);
  if(token == null) {
    res.status(401);
    return;
  };

  try {
    jwt.verify(token, PUBLIC_KEY);

    res.status(200).send(utils.SAMPLE_RETURN_DATA)
  } catch (e) {
    res.status(401).send(e.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});