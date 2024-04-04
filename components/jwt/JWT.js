const crypto = require("crypto");
const utils = require("../utils");

/**
 * Signs the payload using a private key
 * @param {*} payload
 * @param {*} privateKey
 * @returns
 */
function sign(payload, privateKey, signOptions) {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  // Add 'iat' (issued at) and 'exp' (expiration time) to the payload
  const now = Math.floor(Date.now() / 1000);
  const iat = now;
  const exp = now + (signOptions.expiresIn || 3600); // Default expiration in 1 hour if not provided
  const extendedPayload = Object.assign({}, payload, { iat, exp });

  //Encoding header and payload using base64
  const encodedHeader = encodeBase64(header);
  const encodedPayload = encodeBase64(extendedPayload);

  //Create a signature using RSA
  const signature = crypto
    .sign("sha256", Buffer.from(encodedHeader + "." + encodedPayload), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    })
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies the given jwt using the public key
 * @param {*} token
 * @param {*} publicKey
 * @returns
 */
function verify(token, publicKey) {
  //Split the token into individual parts
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  // Decode the JWT header
  const decodedHeader = decodeBase64(encodedHeader);

  // Verify that the 'alg' header is RSA (RS256)
  if (decodedHeader.alg !== "RS256") {
    throw new Error("Invalid algorithm");
  }

  const verifyResult = crypto.verify(
    "sha256",
    Buffer.from(encodedHeader + "." + encodedPayload),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    Buffer.from(signature, "base64"),
  );

  if (!verifyResult) {
    throw new Error("Invalid signature");
  }

  const decodedPayload = decodeBase64(encodedPayload);
  const now = Math.floor(Date.now() / 1000);

  if (decodedPayload.exp && decodedPayload.exp < now) {
    throw new Error("Token expired");
  }

  return decodedPayload;
}

function encodeBase64(originalString) {
  var encodedString = Buffer.from(
    JSON.stringify(originalString),
    "utf-8",
  ).toString("base64");
  encodedString = encodedString
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=+$/, "");
  return encodedString;
}

function decodeBase64(encodedString) {
  // reverse to original encoding
  if (encodedString.length % 4 != 0) {
    encodedString += "===".slice(0, 4 - (encodedString.length % 4));
  }
  encodedString = encodedString.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(Buffer.from(encodedString, "base64").toString());
}

module.exports = {
  sign,
  verify,
};
