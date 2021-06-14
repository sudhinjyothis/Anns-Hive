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
    checkgmailsignup: (req, res, next) => {
        if (req.session.gmailreg) {
            next()
        } else {
            res.redirect('/signin')
        }
    }

}