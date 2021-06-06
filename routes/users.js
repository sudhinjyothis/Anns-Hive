var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('users/index', { header: true, home: true })
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
  res.render('users/about', { header: true, about: true })
})
router.get('/signin', (req, res) => {
  res.render("users/signin", { header: false })
})

module.exports = router;
