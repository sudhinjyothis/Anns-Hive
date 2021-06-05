var db = require("../config/connection")
var collection = require("../config/collections")
const promise = require("promise")
const { resolve, reject } = require("promise")
const objectID = require("mongodb").ObjectID
module.exports = {
    addProduct: (product, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            callback(data.ops[0]._id)
        })
    },
    getAllProducts: () => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteProduct: (productId) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectID(productId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getOneProducts: (proId) => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectID(proId) })
            resolve(product)
        })

    },
    updateProduct: (proId, proDetails) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectID(proId) }, {
                $set: {
                    name: proDetails.name,
                    description: proDetails.description,
                    price: proDetails.price,
                    category: proDetails.category
                }
            }).then((response) => {
                resolve()
            })
        })
    }
}