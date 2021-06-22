var userHelper = require("../helpers/user-helper");
module.exports = {
    //checks if the user is already signed in or not 
    activeuser: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/signin')
        }
    },
    // to handle multiple sign up request 
    checkusersignin: (req, res, next) => {
        if (req.session.user) {
            res.redirect('/')
        } else {
            next()
        }
    },
    // to handle rendering gmail registration page
    checksocialsignup: (req, res, next) => {
        if (req.session.socialreg) {
            next()
        } else {
            res.redirect('/signin')
        }
    },
    checksignupauth: (req, res, next) => {
        if (req.session.signupauth === true) {
            next()
        } else {
            res.redirect('/')
        }
    },
    checkaddress: async (req, res, next) => {
        await userHelper.fetchUserById(req.session.user._id).then((data) => {
            if (data.address) {
                next()
            } else {
                res.redirect('/profile')
            }
        })
    }

}