const nodemailer = require("nodemailer");
const { google } = require('googleapis')
const html = require('../helpers/html')
const CLIENT_ID = '62378267994-dai1c0b351e5ntdme58ag67t4uc4ghjn.apps.googleusercontent.com'
const CLIENT_SECRET = '0ptpZUBs2rIQMDrrTdqSfhzI'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04dNZbEj5fVhOCgYIARAAGAQSNwF-L9Irn_fu3j4hO9xem4o8lZUYs5IKSIutPou_olpvU25XdtHo3ALYZxP6WFIW-qBLgkf4MNw'
module.exports = {
    sendMail: async (mailId, verifyToken) => {
        try {

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'octanesj@gmail.com',
                    pass: 'tan30equaltocot60'

                }
            })
            const mailOptions = {
                from: 'octanesj@gmail.com',
                to: mailId,
                subject: 'hello',
                text: verifyToken,
                html: html.html
            }
            const result = await transport.sendMail(mailOptions)
            return result

        } catch (err) {
            return err
        }
    }
}