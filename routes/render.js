var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var middleware = require('./middleware')
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");
var axios = require('axios')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.SIGNIN_CLIENTID);
// handlebars
Handlebars.registerHelper('increment', function (num) {
  return num + 1
})
Handlebars.registerHelper('sum', function (num1, num2) {
  return num1 + num2
})
/* GET home page. */
router.get('/', async (req, res) => {
  let products = await productHelper.getLimitedRandomProducts(8)
  let user = req.session.user
  let cartCount = 0
  if (!req.session.shiprocketToken) {
    var data = JSON.stringify({
      "email": "sudhinjyothis23@gmail.com",
      "password": "sin30equaltocos60"
    })
    var config = {
      method: 'post',
      url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    await axios(config)
      .then(function (response) {
        req.session.shiprocketToken = response.data.token
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  try {
    cartCount = await userHelper.getCartCount(req.session.user._id)
    user.name = user.name.split(' ')[0]
  } catch { }
  res.render('users/index', { home: true, footer: true, products, user, cartCount })
})
// renders signup page
router.get('/signup', middleware.checkusersignin, (req, res) => {
  res.render('users/signup', { header: true })
})
// renders about page
router.get('/about', async (req, res) => {
  let user = req.session.user
  let cartCount = 0
  try {
    cartCount = await userHelper.getCartCount(req.session.user._id)
  } catch { }
  res.render('users/about', { about: true, footer: true, user, cartCount })
})
// renders contact page 
router.get('/contact', async (req, res) => {
  let user = req.session.user
  let cartCount = 0
  try {
    cartCount = await userHelper.getCartCount(req.session.user._id)
  } catch { }
  res.render("users/contact", { contact: true, footer: true, user, cartCount })
})
// profile 
router.get('/profile', middleware.activeuser, async (req, res) => {
  var user = req.session.user
  try {
    if (user.gmailLogin) {
      var socialmedia = true
    } else if (user.fbLogin) {
      var socialmedia = true
    }
  } catch {
    var socialmedia = false
  }
  await userHelper.fetchUserById(req.session.user._id).then(async (data) => {
    var address = data.address
    cartCount = await userHelper.getCartCount(req.session.user._id)
    if (data.address.length >= 5) {
      var limitExceeded = true
      req.session.addresslimit = limitExceeded
    } else {
      var limitExceeded = false
    }
    res.render("users/profile", { user, footer: true, imgheader: 'Profile', socialmedia, address, limitExceeded, cartCount })
  })
})
// add address 
router.get('/addaddress', middleware.activeuser, (req, res) => {
  if (req.session.addresslimit) {
    res.redirect('/profile')
  } else {
    var indianStates = [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jammu & Kashmir',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Tripura',
      'Uttarakhand',
      'Uttar Pradesh',
      'West Bengal'
    ]
    res.render('users/addaddress', { header: true, indianStates, footer: true })
  }
})
// edit address
router.get('/editaddress', middleware.activeuser, middleware.checkaddress, async (req, res) => {
  var indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal'
  ]
  await userHelper.fetchUserById(req.session.user._id).then((data) => {
    var position = req.query.id
    var address = data.address[position]
    res.render("users/editaddress", { footer: true, header: true, indianStates, address, position })
  })
})
// renders signin page
router.get('/signin', (req, res) => {
  res.render("users/signin", { header: true })
})
// renders register user if not exists while gmail sign in page
router.get('/gmailsetup', (req, res) => {
  let user = {
    name: req.session.socialreg.name,
    email: req.session.socialreg.email
  }
  res.render('users/gmailsetup', { user })
})
router.get('/fbsetup', (req, res) => {
  let user = {
    name: req.session.socialreg.name,
    email: req.session.socialreg.email
  }
  res.render('users/fbsetup', { user })
})
// emailverification success page
router.get('/emailverificationsuccess', (req, res) => {
  req.session.signupauth = null
  res.render('users/verificationsuccess')
})
// token expired page
router.get('/tokenexpired', (req, res) => {
  res.render('users/tokenexpired')
})
// email already exists page
router.get('/gmailsignuserexists', (req, res) => {
  req.session.socialreg = null
  res.render('users/gmailsignuserexists')
})
// verification send page
router.get('/verificationsend', (req, res) => {
  email = req.session.verifyEmail
  res.render('users/verificationsend', { email })
})
// manual email verification
router.get('/manualemailverify', (req, res) => {
  res.render('users/emailVerificationInitialise')
})
// not verified page 
router.get('/notverified', (req, res) => {
  res.render('users/notverified')
})
// cart 
router.get('/mycart', middleware.activeuser, async (req, res) => {
  let user = req.session.user
  let cartCount = await userHelper.getCartCount(req.session.user._id)
  let products = await userHelper.getAllCart(req.session.user._id)
  let total = await userHelper.getTotalAmount(req.session.user._id)
  let productsDisplay = await productHelper.getLimitedRandomProducts(5)
  res.render('users/mycart', { imgheader: 'Cart', footer: true, user, cartCount, products, total, productsDisplay })
})
// added to cart 
router.get('/addedtocat', middleware.activeuser, async (req, res) => {
  cartCount = await userHelper.getCartCount(req.session.user._id)
  user = req.session.user
  let productsDisplay = await productHelper.getLimitedRandomProducts(5)
  productHelper.getOneProduct(req.query.id).then((product) => {
    res.render('users/addedtocart', { product, user, header: true, footer: true, cartCount, productsDisplay })
  })
})
router.get('/checkout', middleware.activeuser, async (req, res) => {
  let user = req.session.user
  let total = await userHelper.getTotalAmount(req.session.user._id)
  let freeShipping = false
  if (total > 1000) {
    freeShipping = true
  }
  let cartCount = await userHelper.getCartCount(req.session.user._id)
  let address = await userHelper.fetchAddress(req.session.user._id)
  let defaultAddress = address[0]
  let indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal'
  ]
  var config = {
    method: 'get',
    url: 'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.session.shiprocketToken}`
    },
    data: {
      pickup_postcode: '575007',
      delivery_postcode: parseInt(defaultAddress.pincode),
      cod: 0,
      weight: '1'
    }
  };
  let courier = await axios(config)
  let shippingCompany = courier.data.data.available_courier_companies.find((company, index) => {
    if (company.courier_company_id === courier.data.data.shiprocket_recommended_courier_id) {
      return true
    }
  })
  res.render('users/checkout', { imgheader: 'checkout', footer: true, user, total, cartCount, address, defaultAddress, indianStates, shippingCompany, freeShipping })
})
// ordersuccessfull
router.get('/ordersuccessful', middleware.activeuser, async (req, res) => {
  user = req.session.user
  let products = await userHelper.getOrderedProductDetails(req.query.id)
  let order = await userHelper.getOrderDetails(req.query.id)
  res.render('users/ordersuccessful', { footer: true, header: true, user, products, order })
})
// admin routes start
// renders admin dashboard
router.get('/admin', function (req, res, next) {
  res.render("admin/dashboard", { header: true, adminheader: true });
});
// renders admin products page 
router.get('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY', async (req, res) => {
  let products = await productHelper.getAllProducts()
  res.render("admin/products", { header: true, adminheader: true, products })
})
//renders add product page in products
router.get('/dVM217UcHzCpO4dr6mshiNbxLqTu1i', (req, res) => {
  res.render("admin/addproduct", { header: true, adminheader: true, })
})
// renders edit product page in products
router.get('/SCmVRbJpEXjopyOHKFMaWTunotqPBj', async (req, res) => {
  let product = await productHelper.getOneProduct(req.query.id)
  res.render('admin/editproduct', { header: true, adminheader: true, product })
})
// renders inbox page in admin
router.get('/WAQURo05NjNlVfQI92MBh6qnqeV5JE', (req, res) => {
  res.render('admin/inbox', { header: true, adminheader: true })
})
// admin routes end
module.exports = router;
