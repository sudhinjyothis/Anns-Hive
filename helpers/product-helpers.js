var db = require("../config/connection")
var collection = require("../config/collections")
const promise = require("promise")
const { resolve, reject } = require("promise")
const objectID = require("mongodb").ObjectID
module.exports = {
    addProduct: (product) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
                resolve(data.ops[0]._id)
            })
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
                    productName: proDetails.productName,
                    productDescription: proDetails.productDescription,
                    productPrice: proDetails.productPrice,
                    productCategory: proDetails.productCategory
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    getLimitedProducts: (limit) => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().limit(limit).toArray()
            resolve(product)
        })
    },
    getLimitedRandomProducts: (limit) => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([{ $sample: { size: limit } }]).toArray()
            resolve(product)
        })
    }
}