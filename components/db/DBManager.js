require("dotenv").config();
var { UserToken } = require("./UserToken");
var mongoose = require("mongoose");
var conn;

async function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    conn = mongoose.connection;
    console.log("Database Connected Successfully!");
  } catch (e) {
    console.error(e);
  }
}

/**
 * Creating the refresh token record according to the user ID in the database
 * @param {*} pUserID
 * @param {*} pRefreshToken
 */
async function createRefreshToken(userID, refreshToken) {
  let issue = Date.now();
  let exp = new Date();
  exp.setDate(exp.getDate() + 30); //Expires after 30 day. After that user will have to sign in again

  let newUserToken = {
    refreshToken: refreshToken,
    issuedAt: issue,
    expireAt: exp,
  };

  var filter = { _id: userID },
    update = { $push: { tokens: newUserToken } },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  try {
    let result = await UserToken.findOneAndUpdate(filter, update, options);
    return result != null;
  } catch (e) {
    console.error(e);
  }
}

async function validateRefreshToken(userId, refreshToken) {
  try {
    const userToken = await UserToken.findOneAndUpdate(
      { _id: userId, "tokens.refreshToken": refreshToken },
      { $pull: { tokens: { refreshToken } } },
    );
    if (userToken !== null) {
      return true; // Token found and removed
    } else {
      return false; // Token not found for the user
    }
  } catch (error) {
    console.error("Error validating refresh token:", error);
    return false; // Handle errors appropriately
  }
}

module.exports = {
  connectDB,
  createRefreshToken,
  validateRefreshToken,
};
