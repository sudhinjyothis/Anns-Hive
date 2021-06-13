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
  res.render('users/index', { home: true, footer: true, products, user })
})
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
router.get('/about', (req, res) => {
  let user = req.session.user
  res.render('users/about', { about: true, footer: true, user })
})
router.get('/contact', (req, res) => {
  let user = req.session.user
  res.render("users/contact", { contact: true, footer: true, user })
})
router.get('/signin', (req, res) => {
  res.render("users/signin", { header: true })
})
router.get('/gmailsetup', middleware.checkgmailsignup, (req, res) => {
  let user = {
    name: req.session.gmailreg.name,
    email: req.session.gmailreg.email
  }
  res.render('users/gmailsetup', { user })
})
// admin routes start
router.get('/admin', function (req, res, next) {
  res.render("admin/dashboard", { header: true, adminheader: true });
});
router.get('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY', async (req, res) => {
  let products = await productHelper.getAllProducts()
  res.render("admin/products", { header: true, adminheader: true, products })
})
router.get('/dVM217UcHzCpO4dr6mshiNbxLqTu1i', (req, res) => {
  res.render("admin/addproduct", { header: true, adminheader: true, })
})
router.get('/SCmVRbJpEXjopyOHKFMaWTunotqPBj', async (req, res) => {
  let product = await productHelper.getOneProducts(req.query.id)
  res.render('admin/editproduct', { header: true, adminheader: true, product })
})
router.get('/WAQURo05NjNlVfQI92MBh6qnqeV5JE', (req, res) => {
  res.render('admin/inbox', { header: true, adminheader: true })
})
// admin routes end
module.exports = router;
