var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var jwtauth = require('../helpers/jwttokens')
var sendmail = require("../helpers/sendmail");
var cipher = require('../helpers/cipher')
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios')
const client = new OAuth2Client(process.env.SIGNIN_CLIENTID);
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
    // checking if user exists
    let user = await userHelper.checkEmailExist(req.body.email)
    if (user.status) {
        res.redirect('/signup')
    } else {
        // checking if inputed passwords are same
        if (req.body.password === req.body.confirmpassword) {
            // verifying Captcha
            if (req.body.captcha === "" || req.body.captcha === undefined || req.body.captcha === null) {
                res.send(500).json({ err: "invalid captcha" })
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
                            req.session.catch = null
                        }
                    })
                }
            }

        } else {
            res.status(500).json({ err: "Bad call" })
        }
    }
})
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
        if (payload.email_verified) {
            let user = await userHelper.doCheckGmail(payload.sub)
            if (user) {
                user.id = ""
                req.session.user = user
                res.send("logintrue")
            } else {
                userHelper.checkEmailExist(payload.email).then((response) => {
                    if (response.status) {
                        res.send("userExists")
                    } else {
                        req.session.gmailreg = payload
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
    let user = req.session.gmailreg
    if (user) {
        let userExist = await userHelper.doCheckGmail(user.sub)
        if (userExist) {
            res.redirect('/')
        } else {
            userHelper.doSignupGmail(user).then((data) => {
                req.session.gmailreg = null
                req.session.user = data
                res.send(200)
            })
        }
    } else {
        res.send(500)
    }
})
// signin
router.post('/signin', (req, res) => {
    userHelper.userEmailVerificationCheck(req.body.email).then((verification) => {
        if (verification.status === true) {
            userHelper.doLogin(req.body).then((response) => {
                if (response.status) {
                    if (req.body.rememberMe === 'false') {
                        req.session.cookie.sameSite = true
                        req.session.cookie.expires = false
                    }
                    req.session.user = response.user
                    res.json({ status: true })
                } else {
                    res.json({ status: false })
                }
            })
        } else {
            req.session.verifyEmail = req.body.email
            res.json({ status: "notVerified" })
        }
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