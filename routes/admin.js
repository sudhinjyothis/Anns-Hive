var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var Handlebars = require("handlebars");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render("admin/dashboard");
});

module.exports = router;
