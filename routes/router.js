var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");
/* GET home page. */
router.get('/', async (req, res) => {
  await productHelper.getAllProducts().then((products) => {
    res.render('users/index', { home: true, footer: true, products })
  })
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
  res.render("users/signin", { header: true })
})
router.get('/admin', function (req, res, next) {
  res.render("admin/dashboard", { header: true, adminheader: true });
});
router.get('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY', (req, res) => {
  res.render("admin/products", { header: true, adminheader: true, })
})
router.get('/dVM217UcHzCpO4dr6mshiNbxLqTu1i', (req, res) => {
  res.render("admin/addproduct", { header: true, adminheader: true, })
})
router.get('/SCmVRbJpEXjopyOHKFMaWTunotqPBj', (req, res) => {
  res.render('admin/editproduct', { header: true, adminheader: true, })
})
// adding a product
router.post("/dVM217UcHzCpO4dr6mshiNbxLqTu1i", async (req, res) => {
  await productHelper.addProduct(req.body).then((id) => {
    console.log(req.files.productImage2.mimetype);
    try {
      var flag = 0
      var tempImage1 = req.files.productImage1
      if (tempImage1.mimetype === "image/jpeg") {
        tempImage1.mv("./public/images/products/" + id + ".jpg", (err, done) => {
          if (err) {
            console.log(err);
            flag += 1
          }
        })
      }
      var tempImage2 = req.files.productImage2
      if (tempImage2.mimetype === "image/jpeg") {
        tempImage2.mv("./public/images/products/" + id + "1" + ".jpg", (err, done) => {
          if (err) {
            flag += 1
            console.log(err);
          }
        })
      }
      var tempImage3 = req.files.productImage3
      if (tempImage3.mimetype === "image/jpeg") {
        tempImage3.mv("./public/images/products/" + id + "2" + ".jpg", (err, done) => {
          if (err) {
            flag += 1
            res.redirect('/dVM217UcHzCpO4dr6mshiNbxLqTu1i')
          }
        })
      }
      if (flag == 0) {
        res.redirect('/dVM217UcHzCpO4dr6mshiNbxLqTu1i')
      } else {
        console.log("err");
      }
    }
    catch (err) {
      console.log(err);
    }
  })
})
module.exports = router;
