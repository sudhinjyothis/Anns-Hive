var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");
const { response } = require('express');
const { data } = require('jquery');
/* GET home page. */
router.get('/', async (req, res) => {
  let products = await productHelper.getLimitedProducts(2)
  res.render('users/index', { home: true, footer: true, products })
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
router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((data) => {
    console.log(data);
    res.redirect('/')
  })
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
// editing a product
router.post('/SCmVRbJpEXjopyOHKFMaWTunotqPBj', async (req, res) => {
  productHelper.updateProduct(req.query.id, req.body)
  var jpegErr = false
  try {
    try {
      var tempImage1 = req.files.productImage1
      if (tempImage1.mimetype === "image/jpeg") {
        tempImage1.mv("./public/images/products/" + req.query.id + ".jpg")
      } else {
        jpegErr = true
      }
    } catch (err) { console.log(err); }
    try {
      var tempImage2 = req.files.productImage2
      if (tempImage2.mimetype === "image/jpeg") {
        tempImage2.mv("./public/images/products/" + req.query.id + "1" + ".jpg")
      } else {
        jpegErr = true
      }
    } catch { }
    try {
      var tempImage3 = req.files.productImage3
      if (tempImage3.mimetype === "image/jpeg") {
        tempImage3.mv("./public/images/products/" + req.query.id + "2" + ".jpg")
      } else {
        jpegErr = true
      }
    } catch { }
    res.redirect('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY', jpegErr)
  }
  catch (err) {
    res.redirect('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY', jpegErr)
    console.log(err);
  }
})
// adding a product
router.post("/dVM217UcHzCpO4dr6mshiNbxLqTu1i", async (req, res) => {
  await productHelper.addProduct(req.body).then((id) => {
    try {
      try {
        var tempImage1 = req.files.productImage1
        if (tempImage1.mimetype === "image/jpeg") {
          tempImage1.mv("./public/images/products/" + id + ".jpg")
        }
      } catch (err) { console.log(err); }
      try {
        var tempImage2 = req.files.productImage2
        if (tempImage2.mimetype === "image/jpeg") {
          tempImage2.mv("./public/images/products/" + id + "1" + ".jpg")
        }
      } catch { }
      try {
        var tempImage3 = req.files.productImage3
        if (tempImage3.mimetype === "image/jpeg") {
          tempImage3.mv("./public/images/products/" + id + "2" + ".jpg")
        }
      } catch { }
      res.redirect('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY')
    }
    catch (err) {
      console.log(err);
      res.redirect('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY')
    }
  })
})

router.get('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwYdelete', (req, res) => {
  productHelper.deleteProduct(req.query.id).then(() => {
    res.redirect('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY')
  })
})
router.get('/WAQURo05NjNlVfQI92MBh6qnqeV5JE', (req, res) => {
  res.render('admin/inbox', { header: true, adminheader: true })
})
// admin routes end
module.exports = router;
