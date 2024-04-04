const express = require("express");
const utils = require("./components/utils");
const dbManager = require("./components/db/DBManager");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;

//Connect to MongoDB
dbManager.connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", async (req, res) => {
  let { signedToken, refreshToken } = await utils.issueNewTokenPair(
    req.body.userID,
  );
  //Return jwt to result
  res.status(200).json({
    token: signedToken,
    refreshToken: refreshToken,
  });
});

app.get("/data", (req, res) => utils.verifyJWT(req, res));

app.get("/renewSession", async (req, res) => {
  let body = req.body;
  let validRefreshToken = await utils.verifyRefreshToken(
    body.userID,
    body.refreshToken,
  );
  if (!validRefreshToken) {
    res.status(401).send("Invalid Auth. Please sign in again");
  } else {
    let { signedToken, refreshToken } = await utils.issueNewTokenPair(
      req.body.userID,
    );
    res.status(200).json({
      token: signedToken,
      refreshToken: refreshToken,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
