const seconds = require("seconds");
// Dummy Payload data to be included in the JWT
const SAMPLE_PAYLOAD = {
  userId: 123456,
  username: "test_user",
};

// Signing options
var SIGN_OPTIONS = {
  expiresIn: 12 * seconds("hour"), //JWT expiration time to 12 hours, converted to seconds
  algorithm: "RS256", //Algorithim used to sign
};

module.exports = {
  SAMPLE_PAYLOAD,
  SIGN_OPTIONS,
};
