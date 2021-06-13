let jwt = require('jsonwebtoken')
module.exports = {
    verifyJwtToken: (token) => {
        return new Promise(async (resolve, reject) => {
            jwt.verify(token, process.env.ANNSHIVE_EMAILVERIFY_TOKEN_ID, (err, payload) => {
                if (err) {
                    reject({ err: "invalid token" })
                } else {
                    console.log(payload);
                    resolve(payload)
                }
            })
        })
    }
}