const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const cipher = require('./cipher')
const { google } = require('googleapis')
// google authentication
const CLIENT_ID = process.env.GMAIL_CLIENT_ID
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
module.exports = {
    sendMail: async (mailId) => {
        // creating tokens
        const AnnshivePayload = {
            email: mailId,
            y5NyX1jsf5ABbUkd: process.env.ANNSHIVE_EMAILVERIFY_CLIENTID
        }
        const jwttoken = await jwt.sign(AnnshivePayload, process.env.ANNSHIVE_EMAILVERIFY_TOKEN_ID, { expiresIn: '5m' })
        // encrypting created tokens
        const token = await cipher.encrypt(jwttoken)
        try {
            // authenticating gmail api
            const accessToken = oAuth2Client.getAccessToken()
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'theannshiveauth@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })
            // generating an email
            const mailOptions = {
                from: 'Annshive<annshiveauth@gmail.com>',
                to: mailId,
                subject: 'Verify Email address',
                text: `This is to verify your email addresss with annshive it seems that html in our mail doesnt support on your browser, kindly copy and paste the given url and verify your account https://localhost:3000/api/verifyemail?token=${token}`,
                html: `
                <!DOCTYPE html>
                <html
                    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">

                <head>
                    <meta name="viewport" content="width=device-width" />
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>annshive verify</title>


                    <style type="text/css">
                        img {
                            max-width: 100%;
                        }

                        body {
                            -webkit-font-smoothing: antialiased;
                            -webkit-text-size-adjust: none;
                            width: 100% !important;
                            height: 100%;
                            line-height: 1.6em;
                        }

                        body {
                            background-color: #f6f6f6;
                        }

                        .btn-primary {
                            text-decoration: none;
                            border: none;
                            text-align: center;
                            background: none;
                            cursor: pointer;
                            padding: 0;
                            outline: none;
                            color: #fff;
                            background: rgba(255, 255, 255, 0.141);
                            padding: 15px 20px;
                            border-radius: 10px;
                            transition: background-color ease-in .2s;
                            font-weight: 600;
                            font-size: 16px;
                        }

                        .btn-primary:hover {
                            color: #fff;
                            background-color: #ff7315;
                        }

                        @media only screen and (max-width: 640px) {
                            body {
                                padding: 0 !important;
                            }

                            h1 {
                                font-weight: 800 !important;
                                margin: 20px 0 5px !important;
                            }

                            h2 {
                                font-weight: 800 !important;
                                margin: 20px 0 5px !important;
                            }

                            h3 {
                                font-weight: 800 !important;
                                margin: 20px 0 5px !important;
                            }

                            h4 {
                                font-weight: 800 !important;
                                margin: 20px 0 5px !important;
                            }

                            h1 {
                                font-size: 22px !important;
                            }

                            h2 {
                                font-size: 18px !important;
                            }

                            h3 {
                                font-size: 16px !important;
                            }

                            .container {
                                padding: 0 !important;
                                width: 100% !important;
                            }

                            .content {
                                padding: 0 !important;
                            }

                            .content-wrap {
                                padding: 10px !important;
                            }

                            .invoice {
                                width: 100% !important;
                            }
                        }
                    </style>
                </head>

                <body
                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #3a3535; margin: 0;"
                    bgcolor="#f6f6f6">

                    <table class="body-wrap"
                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #3a3535; margin: 0;"
                        bgcolor="#f6f6f6">
                        <tr
                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;"
                                valign="top">
                            </td>
                            <td class="container" width="600"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
                                valign="top">
                                <div class="content"
                                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                                    <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action"
                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 10px; background-color: #464242c7; margin: 0;padding: 13px;"
                                        bgcolor="#fff">
                                        <tr
                                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                            <td class="content-wrap"
                                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;"
                                                valign="top">
                                                <meta itemprop="name" content="Confirm Email"
                                                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
                                                <table width="100%" cellpadding="0" cellspacing="0"
                                                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                    <tr style="text-align: center;">
                                                        <td
                                                            style="padding-bottom: 20px;font-size: 2em;font-family: sans-serif;font-weight: bolder;color: #f6f6f6;">
                                                            Anns<span style="color: #ff7315;">H</span>ive
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;color: #f6f6f6;">
                                                        <td class="content-block"
                                                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 30px;"
                                                            valign="top">
                                                            Please confirm your email address by clicking the link below.
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                        <td class="content-block" itemprop="handler" itemscope
                                                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                                            valign="top">
                                                            <a style="color: #f6f6f6" href="https://localhost:3000/api/verifyemail?token=${token}" class="btn-primary">Verify
                                                                    email address</a>                                                           
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0px;color: #f6f6f6;">
                                                        <td class="content-block"
                                                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin-top: 0px; padding: 10px 0 0;"
                                                            valign="top">
                                                            privacy policy .... etc here
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;"
                                valign="top"></td>
                        </tr>
                    </table>
                </body>
                </html>`
            }
            // sending email
            const result = await transport.sendMail(mailOptions)
            console.log(result);
            return result

        } catch (err) {
            return err
        }
    }
}