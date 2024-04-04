var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const UserTokenSchema = new Schema({
    _id: String,
    refreshToken: String,
    issuedAt: {type: Date, default: null},
    expireAt: {type: Date, default: null}
});

const UserToken = mongoose.model('UserToken', UserTokenSchema);

module.exports = {
    UserToken
}