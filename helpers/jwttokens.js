let jwt = require('jsonwebtoken')
let cipher = require('./cipher')
module.exports = {
    // verifying created JWT Tokens
    verifyJwtToken: (token) => {
        return new Promise(async (resolve, reject) => {
            jwt.verify(token, process.env.ANNSHIVE_EMAILVERIFY_TOKEN_ID, (err, payload) => {
                if (err) {
                    console.log(err);
                    reject({ err: "invalid token" })
                } else {
                    resolve(payload)
                }
            })
        })
    }
}