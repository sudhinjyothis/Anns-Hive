const mongoClient = require("mongodb").MongoClient
const state = {
    db: null
}

module.exports.connect = function (done) {
    const url = "mongodb+srv://annshive:4ORbbSXbkdwdBUb5@cluster0.2ilxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const dbname = "annshive"

    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        done()
    })


}
module.exports.get = function () {
    return state.db
}