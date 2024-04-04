var ms = require("milliseconds");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _id: false,
  refreshToken: { type: String, index: true },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: ms.months(1), //Refresh tokens are only valid for 1 month. After that the user needs to sign in again
  },
});

const UserTokenSchema = new Schema({
  _id: String,
  tokens: [TokenSchema],
});

const UserToken = mongoose.model("UserToken", UserTokenSchema);

module.exports = {
  UserToken,
};
