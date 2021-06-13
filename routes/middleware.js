module.exports = {
    activeuser: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/signin')
        }
    },
    checkusersignin: (req, res, next) => {
        if (req.session.user) {
            res.redirect('/')
        } else {
            next()
        }
    }, checkgmailsignup: (req, res, next) => {
        if (req.session.gmailreg) {
            next()
        } else {
            res.redirect('/signin')
        }
    }

}