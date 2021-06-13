var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers")
var userHelper = require("../helpers/user-helper");
var jwtauth = require('../helpers/jwttokens')
var sendmail = require("../helpers/sendmail");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.SIGNIN_CLIENTID);
// signout the user
router.get('/signout', (req, res) => {
    req.session.destroy()
    res.redirect('/signin')
})
// check if email already exists on registration
router.get('/checkemail', (req, res) => {
    userHelper.checkEmailExist(req.query.email).then((data) => {
        res.json(data)
    })
})
// verify email during registration (not completed)
router.get('/verifyemail', (req, res) => {
    if (req.query.token) {
        jwtauth.verifyJwtToken(req.query.token).then((data) => {
            console.log(data);
            if (data) {
                req.session.verifyEmail = null
                if (data.y5NyX1jsf5ABbUkd = process.env.ANNSHIVE_EMAILVERIFY_CLIENTID) {
                    userHelper.userEmailVerificationCheck(data.email).then((verification) => {
                        if (verification) {
                            res.redirect('/')
                        } else {
                            console.log(verification);
                        }
                    })
                }
            }
        }).catch(() => {
            res.redirect('/tokenexpired')
            // redirect to rendered expiry page (token expiry not rendered)
        })
    } else {
        res.status(400).json({ err: "bad request" })
    }
})
// registering new user
router.post('/signup', async (req, res) => {
    let user = await userHelper.checkEmailExist(req.body.email)
    if (user.status) {
        res.redirect('/signup')
    } else {
        if (req.body.f28a24ee25d797ed9acd === "476026041d7271641ee1") {
            userHelper.doSignup(req.body).then(async (data) => {
                if (data.err) {
                    res.status(500).json({ err: "not found" })
                } else {
                    req.session.verifyEmail = req.body.email
                    // verification page to be redirected
                    res.redirect('/')
                    // sending gmail
                    sendmail.sendMail(req.body.email).then(result => console.log(result))
                }
            })
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
            audience: process.env.SIGNIN_CLIENTID,
        });
        const payload = ticket.getPayload();
        if (payload.email_verified) {
            user = await userHelper.doCheckGmail(payload.sub)
            if (user) {
                user.id = ""
                req.session.user = user
                res.send("logintrue")
            } else {
                req.session.gmailreg = payload
                res.send("regtrue")
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