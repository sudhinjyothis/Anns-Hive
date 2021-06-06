var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");

/* GET home page. */
router.get('/', (req, res) => {
  res.render('users/index', { home: true, footer: true })
})
router.get('/signup', (req, res) => {
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
  res.render('users/about', { about: true, footer: true })
})
router.get('/contact', (req, res) => {
  res.render("users/contact", { contact: true, footer: true })
})
router.get('/signin', (req, res) => {
  res.render("users/signin", { header: false })
})

module.exports = router;
