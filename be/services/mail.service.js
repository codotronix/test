const CONFIG = require('../../config')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(CONFIG.mailKey)

module.exports.sendVerificationMail = (toEmail, OTP, firstname) => {
    const msg = {
        to: toEmail,
        from: 'welcome@reactale.com',
        subject: 'Reactale Signup Email Verification',
        text: `Dear ${firstname || 'Guest'}, Please use ${OTP} as OTP to verify your email address and complete the signup process. Thank you.`,
        html: `Dear ${firstname || 'Guest'}, <br/>Please use <b>${OTP}</b> as OTP to verify your email address and complete the signup process. <br/><br/>Thank you. <br/>Reactale`,
    }
    // console.log('Sending signup email ...')
    sgMail.send(msg, false, (err, result) => {
        if(err) { console.log("Error while trying to send signup email to=", toEmail, err) }
        // else { console.log(result) }
    })
    
}

module.exports.sendForgotPswdOTPMail = (toEmail, OTP, firstname) => {
    const msg = {
        to: toEmail,
        from: 'welcome@reactale.com',
        subject: 'Reactale New Password OTP',
        text: `Dear ${firstname || 'Guest'}, Please use ${OTP} as OTP to create new password. Thank you.`,
        html: `Dear ${firstname || 'Guest'}, <br/>Please use <b>${OTP}</b> as OTP to create new password. <br/><br/>Thank you. <br/>Reactale`,
    }
    // console.log('Sending signup email ...')
    sgMail.send(msg, false, (err, result) => {
        if(err) { console.log("Error while trying to send forgot-password-otp email to=", toEmail, err) }
        // else { console.log(result) }
    })
    
}