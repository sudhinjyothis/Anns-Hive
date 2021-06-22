var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var middleware = require('./middleware')
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.SIGNIN_CLIENTID);
/* GET home page. */
router.get('/', async (req, res) => {
  let products = await productHelper.getLimitedRandomProducts(2)
  let user = req.session.user
  try {
    user.name = user.name.split(' ')[0]
  } catch { }
  res.render('users/index', { home: true, footer: true, products, user })
})
// renders signup page
router.get('/signup', middleware.checkusersignin, (req, res) => {
  res.render('users/signup', { header: true })
})
// renders about page
router.get('/about', (req, res) => {
  let user = req.session.user
  res.render('users/about', { about: true, footer: true, user })
})
// renders contact page 
router.get('/contact', (req, res) => {
  let user = req.session.user
  res.render("users/contact", { contact: true, footer: true, user })
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
  await userHelper.fetchUserById(req.session.user._id).then((data) => {
    var address = data.address
    res.render("users/profile", { user, footer: true, header: true, socialmedia, address })
  })
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
    var address = data.address
    res.render("users/editaddress", { footer: true, header: true, indianStates, address })
  })
})
// renders signin page
router.get('/signin', middleware.checkusersignin, (req, res) => {
  res.render("users/signin", { header: true })
})
// renders register user if not exists while gmail sign in page
router.get('/gmailsetup', middleware.checksocialsignup, (req, res) => {
  let user = {
    name: req.session.socialreg.name,
    email: req.session.socialreg.email
  }
  res.render('users/gmailsetup', { user })
})
router.get('/fbsetup', middleware.checksocialsignup, (req, res) => {
  let user = {
    name: req.session.socialreg.name,
    email: req.session.socialreg.email
  }
  res.render('users/fbsetup', { user })
})
// emailverification success page
router.get('/emailverificationsuccess', middleware.checksignupauth, (req, res) => {
  req.session.signupauth = null
  res.render('users/verificationsuccess')
})
// token expired page
router.get('/tokenexpired', middleware.checksignupauth, (req, res) => {
  res.render('users/tokenexpired')
})
// email already exists page
router.get('/gmailsignuserexists', middleware.checksocialsignup, (req, res) => {
  req.session.socialreg = null
  res.render('users/gmailsignuserexists')
})
// verification send page
router.get('/verificationsend', middleware.checksignupauth, (req, res) => {
  email = req.session.verifyEmail
  res.render('users/verificationsend', { email })
})
// manual email verification
router.get('/manualemailverify', middleware.checksignupauth, (req, res) => {
  res.render('users/emailVerificationInitialise')
})
// not verified page 
router.get('/notverified', middleware.checksignupauth, (req, res) => {
  res.render('users/notverified')
})
// add address 
router.get('/addaddress', middleware.activeuser, (req, res) => {
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
  res.render('users/addaddress', { header: true, indianStates })
})
// address added suuccessfully
router.get('/addressaddedsuccessfully', (req, res) => {
  res.render('users/addressaddedsuccessfully', { header: true })
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
  let product = await productHelper.getOneProducts(req.query.id)
  res.render('admin/editproduct', { header: true, adminheader: true, product })
})
// renders inbox page in admin
router.get('/WAQURo05NjNlVfQI92MBh6qnqeV5JE', (req, res) => {
  res.render('admin/inbox', { header: true, adminheader: true })
})
// admin routes end
module.exports = router;
