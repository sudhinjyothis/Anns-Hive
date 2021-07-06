var db = require("../config/connection")
var collection = require("../config/collections")
const promise = require("promise")
const { resolve, reject } = require("promise")
const objectID = require("mongodb").ObjectID
module.exports = {
    // adding a new product
    addProduct: (product) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne({
                name: product.name,
                description: product.description,
                selling_price: product.selling_price,
                category: product.category,
                sku: "test",
                hsn: 1234,
                tax: '',
                discount: ''

            }).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },
    // fetching all products
    getAllProducts: () => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    // deleting a specific product
    deleteProduct: (productId) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectID(productId) }).then((response) => {
                resolve(response)
            })
        })
    },
    // fetching a specific product
    getOneProduct: (proId) => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectID(proId) })
            resolve(product)
        })

    },
    // updating a specific product
    updateProduct: (proId, proDetails) => {
        return new promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectID(proId) }, {
                $set: {
                    name: proDetails.productName,
                    description: proDetails.productDescription,
                    selling_price: proDetails.productPrice,
                    category: proDetails.productCategory,
                    sku: "test",
                    hsn: 1234,
                    tax: '',
                    discount: ''
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    // fetching limited number of products
    getLimitedProducts: (limit) => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().limit(limit).toArray()
            resolve(product)
        })
    },
    // fetching limited number of random products
    getLimitedRandomProducts: (limit) => {
        return new promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([{ $sample: { size: limit } }]).toArray()
            resolve(product)
        })
    },
    getProductInCart: (proId) => {
        return new promise((resolve, reject) => {
            let cart = db.get().collection(collection.CART_COLLECTION).find({}, {
                products: {
                    $elemMatch:
                    {
                        item: proId
                    }
                }
            }).toArray()
            resolve(cart)
        })
    },
    returnProductsShiprocket: (products) => {
        order_items = []
        products.forEach(element => {
            order_items.push({
                name: element.product.name,
                sku: element.product._id,
                units: element.units,
                selling_price: element.product.selling_price,
                discount: element.product.discount,
                tax: element.product.tax,
                hsn: element.product._id1
            })
        });
        return order_items
    }
}
