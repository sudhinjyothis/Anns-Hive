var db = require("../config/connection")
var collection = require("../config/collections")
const bcrypt = require("bcrypt")
const { resolve, reject } = require("promise")
const objectId = require("mongodb").ObjectID
const { response } = require("express")
const Razorpay = require('razorpay')
// creating razorpay instance 
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEYID,
    key_secret: process.env.RAZORPAY_SECRET,
});
module.exports = {
    // registering a user
    doSignup: (userdata) => {
        return new Promise(async (resolve, reject) => {
            if (userdata.password) {
                userdata.password = await bcrypt.hash(userdata.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(
                    {
                        name: userdata.name,
                        email: userdata.email,
                        password: userdata.password,
                        isVerified: false,
                        gmailLogin: false

                    }
                ).then((data) => {
                    resolve(data.ops[0])
                })
            } else {
                resolve({ err: true })
            }
        })
    },
    // registering user while sign in with gmail
    doSignupGmail: (userdata) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(
                {
                    name: userdata.name,
                    email: userdata.email,
                    id: userdata.sub,
                    isVerified: userdata.email_verified,
                    gmailLogin: true
                }
            ).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    //fetching gmail using specific ID
    doCheckGmail: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ id: userid }).then((data) => {
                resolve(data)
            })
        })
    },
    // logging a user 
    doLogin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userdata.email, gmailLogin: false })
            if (user) {
                bcrypt.compare(userdata.password, user.password).then((status) => {
                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }

                })
            } else {
                resolve({ status: false })
            }
        })
    },
    // to fecth the user with gmail
    checkEmailExist: (email) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).findOne({ email: email }).then((data) => {
                if (data) {
                    resolve({ status: true, user: data })
                } else {
                    resolve({ status: false })
                }
            })
        })
    },
    // fetching user email verification detail
    userEmailVerificationCheck: (email) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).findOne({ email: email }).then((data) => {
                if (data) {
                    resolve({ status: data.isVerified })
                } else {
                    resolve({ status: "no user found" })
                }
            })
        })
    },
    userEmailVerification: (email) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).updateOne({ email: email }, {
                $set: {
                    isVerified: true
                }
            }).then(async () => {
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: email })
                resolve({ verified: true, user: user })
            })
        })
    }
    ,
    // adding a product to cart
    addToCart: (proId, userId) => {
        let proObj = {
            item: objectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                let ProExists = userCart.products.findIndex(product => product.item == proId)
                if (ProExists != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId), 'products.item': objectId(proId) }, {
                        $inc: { 'products.$.quantity': 1 }
                    }).then(() => {
                        resolve()
                    })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) }, {
                        $push: {
                            products: proObj
                        }
                    }).then((response) => {
                        resolve()
                    })
                }

            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    // fetching all cart products
    getAllCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }

                },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        item: "$products.item",
                        quantity: "$products.quantity"
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: "item",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ["$product", 0] }
                    }
                }
            ]).toArray()
            resolve(cartItems)
        })
    },
    // fetching cart count
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
                resolve(count)
            } else {
                resolve(count)
            }
        })
    },
    // changing a product quantity
    changeProductQuantity: (details) => {
        details.quantity = parseInt(details.quantity)
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(details.cartId), 'products.item': objectId(details.productId) }, {
                $inc: { 'products.$.quantity': parseInt(details.value) }
            }).then((response) => {
                resolve(true)
            })
        })
    },
    // deleting a product in cart
    cartDeleteProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(details.cartId) }, {
                $pull: { products: { item: objectId(details.productId) } }
            }).then((response) => {
                resolve({ productRemoved: true })
            })
        })
    },
    // fetching total amount of a cart linked to a specific user
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }

                },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        item: "$products.item",
                        quantity: "$products.quantity"
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: "item",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ["$product", 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: [{ $toInt: '$quantity' }, { $toInt: '$product.price' }] } }
                    }
                }
            ]).toArray()
            if (total.length != 0) {
                resolve(total[0].total)
            } else {
                resolve(total)
            }
        })

    },
    // fetching cart products[array] of a specifi user
    getUserProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            resolve(cart.products)
        })
    },
    // placing an order
    placeOrder: (order, products, total) => {
        return new Promise((resolve, reject) => {
            let status = order['paymentMethod'] === "COD" ? "placed" : "pending"
            let orderObj = {
                deliveryDetails: {
                    mobile: order.mobile,
                    address: order.address,
                    pincode: order.pincode
                },
                userId: objectId(order.userId),
                paymentMethod: order['paymentMethod'],
                products: products,
                status: status,
                total: total,
                date: new Date()
            }
            db.get().collection(collection.ORDERS_COLLECTION).insertOne(orderObj).then((response) => {
                resolve(response.ops[0]._id)

            })
        })

    },
    // fetching order details 
    getOrderDetails: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let order = await db.get().collection(collection.ORDERS_COLLECTION).findOne({ _id: objectId(orderId) })
            resolve(order)
        })
    },
    // fetching ordered product details 
    getOrderedProductDetails: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let order = await db.get().collection(collection.ORDERS_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }

                },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        item: "$products.item",
                        quantity: "$products.quantity"
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: "item",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ["$product", 0] }
                    }
                }
            ]).toArray()
            resolve(order)
        })
    },
    // fetching all the orders of a specific user
    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDERS_COLLECTION).find({ userId: objectId(userId), status: 'placed' }).toArray()
            resolve(orders)
        })
    },
    // generating razorpay payment 
    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: total * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: `${orderId}`
            };
            instance.orders.create(options, function (err, order) {
                resolve(order)
            });
        })
    },
    // verifying razorpay payment
    verifyPayment: (details) => {
        return new Promise(async (resolve, reject) => {
            const { createHmac, } = await import('crypto');
            let hmac = createHmac('sha256', 'EkyokO6IoBrCEpXyJ9UrFesb');
            hmac.update(details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }
        })
    },
    // changing payment status 
    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDERS_COLLECTION).updateOne({ _id: objectId(orderId) }, {
                $set: {
                    status: 'placed'
                }
            }).then(() => {
                resolve(orderId)
            })
        })
    },
    // deleting a cart 
    deleteCartItemsWhenOrder: (userId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CART_COLLECTION).removeOne({ user: objectId(userId) })
            resolve()
        })
    }
}