const jwt = require('jsonwebtoken')
let token = jwt.sign({ username: 'sudhin', password: "hihi" }, "4395d6e965101194f0e0ce55d677f873a60049cdf712678f42126d25988edb51e9d2ab53a82491abe03e2c2c0873dca5e45b3dd048dcdd57159f0d7a02a70168", { expiresIn: 60000 })
console.log(token);
module.exports = {
    createToken: async (data) => {
        let token = await jwt.sign({ username: 'sudhin', password: "hihi" }, "4395d6e965101194f0e0ce55d677f873a60049cdf712678f42126d25988edb51e9d2ab53a82491abe03e2c2c0873dca5e45b3dd048dcdd57159f0d7a02a70168", { expiresIn: 60000 })
        return token
    }
}
