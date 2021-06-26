var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var jwtauth = require('../helpers/jwttokens')
var sendmail = require("../helpers/sendmail");
var cipher = require('../helpers/cipher')
const passport = require('passport')
const facebookStrategy = require('passport-facebook')
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const middleware = require('./middleware');
const client = new OAuth2Client(process.env.SIGNIN_CLIENTID);
let facebookuser
// facbook login
passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_CLIENTSECRET,
    callbackURL: "https://localhost:3000/api/facebookCallback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email'],
    enableProof: true

},// facebook will send back the token and profile
    (token, refreshToken, profile, done) => {
        facebookuser = profile._json
        return done(null, profile)
    }
));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
router.get('/facebookauth', passport.authenticate('facebook', { scope: 'email' }), (req, res) => {
    req.session.socialregauth = true
});
router.get('/facebookCallback',
    passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), async (req, res) => {
        userHelper.doCheckSocial(facebookuser.id).then((user) => {
            if (user) {
                req.session.user = user
                res.redirect('/')
            } else {
                req.session.socialreg = facebookuser
                userHelper.checkEmailExist(facebookuser.email).then((response) => {
                    if (response.status) {
                        res.redirect('/gmailsignuserexists')
                    } else {
                        res.redirect('/fbsetup')
                    }
                })
            }
        })
    }
);
// fbsignup
router.post('/createfb', async (req, res) => {
    let user = req.session.socialreg
    if (user) {
        let userExist = await userHelper.doCheckSocial(user.id)
        if (userExist) {
            res.redirect('/')
        } else {
            userHelper.doSignupFacebook(user).then((data) => {
                req.session.socialreg = null
                req.session.user = data
                res.sendStatus(200)
            })
        }
    } else {
        res.send(500)
    }
})

// signout the user
router.get('/signout', (req, res) => {
    req.session.user = null
    res.redirect('/signin')
})
// check if email already exists on registration
router.get('/checkemail', (req, res) => {
    if (req.query.email.indexOf('@') == -1) {
        res.json({ status: "invalidEmail" })
    } else {
        userHelper.checkEmailExist(req.query.email).then((data) => {
            res.json(data)
        })
    }
})
// check empty values
router.post('/checkempty', (req, res) => {
    userText = req.body.toCheck.replace(/^\s+/, '').replace(/\s+$/, '');
    if (userText === '') {
        // text was all whitespace
        res.json({ status: "empty" })
    } else {
        // text has real content, now free of leading/trailing whitespace
        res.json({ status: "notEmpty" })
    }

})
// verify email during registration (not completed)
router.get('/verifyemail', async (req, res) => {
    if (req.query.token) {
        let token = await cipher.decrypt(req.query.token)
        jwtauth.verifyJwtToken(token).then((data) => {
            if (data) {
                req.session.verifyEmail = null
                if (data.y5NyX1jsf5ABbUkd = process.env.ANNSHIVE_EMAILVERIFY_CLIENTID) {
                    userHelper.userEmailVerificationCheck(data.email).then((verify) => {
                        if (verify.status) {
                            res.redirect('/')
                        } else {
                            userHelper.userEmailVerification(data.email).then((response) => {
                                if (response.verified) {
                                    response.user.password = null
                                    req.session.user = response.user
                                    res.redirect('/emailverificationsuccess')
                                }
                            })
                        }
                    })
                }
            }
        }).catch((err) => {
            res.redirect('/tokenexpired')
        })
    } else {
        res.status(400).json({ err: "bad request" })
    }
})
router.get('/sendemailverify', (req, res) => {
    if (req.session.verifyEmail) {
        res.redirect('/verificationsend')
        sendmail.sendMail(req.session.verifyEmail)
    }
    else {
        res.redirect('/manualemailverify')
    }
})
router.post('/manualemailverify', (req, res) => {
    userHelper.userEmailVerificationCheck(req.body.Email).then((response) => {
        if (response.status === true) {
            res.redirect('/')
        } else if (response.status === false) {
            res.redirect('/verificationsend')
            sendmail.sendMail(req.body.Email)
        } else {
            res.redirect('/')
        }
    })
})
// registering new user
router.post('/signup', async (req, res) => {
    req.session.signupauth = true
    // checking if user exists
    let user = await userHelper.checkEmailExist(req.body.email)
    if (user.status) {
        res.redirect('/signup')
    } else {
        // checking if inputed passwords are same
        if (req.body.password === req.body.confirmpassword) {
            // verifying Captcha
            if (req.body.captcha === "" || req.body.captcha === undefined || req.body.captcha === null) {
                res.json({ err: "invalid captcha" })
            } else {
                const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=6Le02TQbAAAAALxo62Dtgb9Yz9uQJNDTwr-uokBg&response=${req.body.captcha}`
                await axios.post(verifyUrl).then((response) => {
                    if (response.data.success) {
                        req.session.captcha = true
                    }
                })
                if (req.session.captcha) {
                    userHelper.doSignup(req.body).then(async (data) => {
                        if (data.err) {
                            res.sendStatus(500)
                        } else {
                            req.session.verifyEmail = req.body.email
                            res.sendStatus(200)
                            // sending gmail
                            sendmail.sendMail(req.body.email)
                            req.session.captcha = false
                        }
                    })
                }
            }

        } else {
            res.status(500).json({ err: "Bad call" })
        }
    }
})
// facebook login

// gmail sign in route
router.post('/gmailsignin', (req, res) => {
    let token = req.body.idtoken
    async function verify() {
        // recieving google sign information as token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.SIGNIN_CLIENTID
        });
        const payload = ticket.getPayload();
        req.session.socialreg = payload
        if (payload.email_verified) {
            let user = await userHelper.doCheckSocial(payload.sub)
            if (user) {
                req.session.user = user
                res.send("logintrue")
            } else {
                userHelper.checkEmailExist(payload.email).then((response) => {
                    if (response.status) {
                        res.send("userExists")
                    } else {
                        res.send("regtrue")
                    }
                })
            }
        } else {
            res.json({ status: "email not verified" })
        }

    }
    verify().catch(console.error);
})
// register user if not exitst after gmail sign in
router.post('/creategmail', async (req, res) => {
    let user = req.session.socialreg
    if (user) {
        let userExist = await userHelper.doCheckSocial(user.sub)
        if (userExist) {
            res.redirect('/')
        } else {
            userHelper.doSignupGmail(user).then((data) => {
                req.session.socialreg = null
                req.session.user = data
                res.sendStatus(200)
            })
        }
    } else {
        res.send(500)
    }
})
// signin
router.post('/signin', (req, res) => {
    userHelper.doLogin(req.body).then((response) => {
        if (response.status) {
            if (req.body.rememberMe === 'false') {
                req.session.cookie.sameSite = true
                req.session.cookie.expires = false
            }
            userHelper.userEmailVerificationCheck(req.body.email).then((verification) => {
                if (verification.status === true) {
                    req.session.user = response.user
                    res.json({ status: true })
                } else {
                    req.session.verifyEmail = req.body.email
                    res.json({ status: "notVerified" })
                }
            })
        } else {
            res.json({ status: false })
        }
    })
})
// adding address
router.post('/addaddress', (req, res) => {
    userHelper.fetchUserById(req.session.user._id).then((data) => {
        if (data.address.length <= 5) {
            userHelper.checkAddressEmail(req.session.user._id, req.body.email).then((response) => {
                if (!response.status) {
                    userHelper.addAddress(req.session.user._id, req.body).then((response) => {
                        res.json(response)
                    })
                }
            })
        }
    })
})
router.post('/editaddress', (req, res) => {
    userHelper.updateAddress(req.session.user._id, req.body.position, req.body).then((response) => {
        res.json(response)
    })
})
router.get('/deleteaddress', async (req, res) => {
    user = req.session.user
    await userHelper.deleteAddress(user._id, req.query.email).then(() => {
    })
    res.redirect('/profile')
})
// check address email exists
router.post('/checkaddressemail', (req, res) => {
    userHelper.checkAddressEmail(req.session.user._id, req.body.email).then((response) => {
        res.json(response)
    })
})
// add to cart 
router.post('/addtocart', middleware.activeuser, (req, res) => {
    userHelper.addToCart(req.body.id, req.session.user._id).then(() => {
        res.json({ success: true })
    })
})
// delete a specific product from cart 
router.post('/deletecartproduct', (req, res) => {
    userHelper.cartDeleteProduct(req.body).then((response) => {
        res.json(response)
    })
})
// change product quantity
router.post('/changeproductquantity', middleware.activeuser, (req, res) => {
    userHelper.changeProductQuantity(req.body).then(() => {
        userHelper.getTotalAmount(req.session.user._id).then((total) => {
            res.json({ total: total })
        })
    })
})
// admin routes
// editing a product in admin page
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
// adding a product in admin page 
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
// deleting a product in admin page 
router.get('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwYdelete', (req, res) => {
    productHelper.deleteProduct(req.query.id).then(() => {
        res.redirect('/uQ2gJOrqg2pEogVy3fZqSlrGmwrjwY')
    })
})
module.exports = router;