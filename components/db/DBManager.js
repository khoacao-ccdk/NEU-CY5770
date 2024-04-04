require('dotenv').config();
var {UserToken} = require("./UserToken");
var mongoose = require('mongoose');
var conn;

async function connectDB() {
   try{
    mongoose.connect(process.env.MONGO_URI);
    conn = mongoose.connection;
    console.log("Database Connected Successfully!");
   }
   catch(e){
    console.error(e);
   }
}

async function writeToDB(pUserID, pRefreshToken) {
    let issue = Date.now();
    let exp = new Date();
    exp.setDate(exp.getDate() + 30); //Expires after 30 day. After that user will have to sign in again
    
    let newUserToken = {
        refreshToken: pRefreshToken,
        issuedAt: issue,
        expireAt: exp
    }
    newUserToken._id = pUserID; 
    let result = await UserToken.create(newUserToken);
    console.log(result);
}

module.exports = {
    connectDB,
    writeToDB
}