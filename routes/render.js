var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var middleware = require('./middleware')
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config()
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
  var indian_states = [
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
  res.render('users/signup', { header: true, indian_states })
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
// renders signin page
router.get('/signin', (req, res) => {
  res.render("users/signin", { header: true })
})
// renders register user if not exists while gmail sign in page
router.get('/gmailsetup', middleware.checkgmailsignup, (req, res) => {
  let user = {
    name: req.session.gmailreg.name,
    email: req.session.gmailreg.email
  }
  res.render('users/gmailsetup', { user })
})
// emailverification success page
router.get('/emailverificationsuccess', (req, res) => {
  res.render('users/verificationsuccess')
})
// token expired page
router.get('/tokenexpired', (req, res) => {
  res.render('users/tokenexpired')
})
// email already exists page
router.get('/gmailsignuserexists', (req, res) => {
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
