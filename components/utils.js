const crypto = require("crypto");
const fs = require("fs");
const jwt = require("./jwt/JWT");
const jwtData = require("./jwt/JWTData"); //this file contains information that are used to sign/verify jwt
const dbManager = require("./db/DBManager");

//Read Private and Public key from file
const PRIVATE_KEY = fs
  .readFileSync(__dirname + "/secret/private.key", "utf-8")
  .replace(/\\n/g, "\n");
const PUBLIC_KEY = fs
  .readFileSync(__dirname + "/secret/public.key", "utf-8")
  .replace(/\\n/g, "\n");

/**
 * Extracts jwt from Authorization header of the request
 * @param {*} req
 * @returns
 */
function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
}

function generateRefreshToken(userID) {
  let timestamp = Date.now();
  let randomBytes = crypto.randomBytes(16); // Example using shorter random bytes
  let secret = userID.concat(timestamp);
  return crypto.createHash("sha256", randomBytes).update(secret).digest("hex");
}

async function issueNewTokenPair(userID) {
  // Sign the JWT
  let payload = {
    userID: userID,
  };
  const signedToken = jwt.sign(payload, PRIVATE_KEY, jwtData.SIGN_OPTIONS);

  let refreshToken = generateRefreshToken(userID);
  await dbManager.createRefreshToken(userID, refreshToken);

  return { signedToken, refreshToken };
}

function verifyJWT() {
  let token = utils.extractToken(req);
  if (token == null) {
    res.status(401);
    return;
  }
  try {
    jwt.verify(token, PUBLIC_KEY);
    res.status(200).send(utils.SAMPLE_RETURN_DATA);
  } catch (e) {
    res.status(401).send(e.message);
  }
}

async function verifyRefreshToken(userID, refreshToken) {
  let isTokenValid = dbManager.validateRefreshToken(userID, refreshToken);
  return isTokenValid;
}

//Sample return data
const SAMPLE_RETURN_DATA = {
  data1: "Data 1",
  data2: "Data 2",
  data3: "Data 3",
  data4: "Data 4",
};

module.exports = {
  extractToken,
  generateRefreshToken,
  issueNewTokenPair,
  verifyJWT,
  verifyRefreshToken,
  SAMPLE_RETURN_DATA,
};
