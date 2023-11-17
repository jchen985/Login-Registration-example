/*
jsonwbetoken functions such as verify() or sign() use algorithm that needs a secret key (as String)
to encode and decode token
this is to export my own secret String
*/

module.exports = {
    secret: "jianan-secret-key"
};