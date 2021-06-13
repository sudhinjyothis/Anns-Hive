const mongoClient = require("mongodb").MongoClient
const state = {
    db: null
}

module.exports.connect = function (done) {
    const url = "mongodb+srv://annshive:sin30equaltocos60@cluster0.2ilxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const devurl = process.env.MONGODB_URL
    const dbname = process.env.MONGODB_DB
    mongoClient.connect(url, { useUnifiedTopology: true }, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })


}
module.exports.get = function () {
    return state.db
}