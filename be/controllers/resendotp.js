// const crypter = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { sendVerificationMail, sendForgotPswdOTPMail } = require('../services/mail.service')
const { OTP_TYPES } = require('../constants/enums')
const { getNewOTP } = require('../services/otp.service')

/**
 * It's a POST API and post params must have email, otpType.
 * otpType is an Enum, can be found inside /constants/enums.js.
 * Since this API can be used to send all sorts of OTPs,
 * otpType will tell us which kind of OTP this request is for.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const resendOTPController = async (req, res, next) => {
    // res.send('sigining up')
    // console.log(req.body)
    const { email, otpType } = req.body

    if(
        !email
        || !otpType
        || !Object.values(OTP_TYPES).includes(otpType)
    ) {
        res.json(MSG.GENERIC_PARAMSMISSING)
        return
    }

    try {
        const db = getDB()
        let user = await db.collection(CONFIG.usersCollection).findOne({ email })
        let isDBUpdateRequired = false
        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST)
            return
        }
        
        // If it is an email verification otp
        if(otpType === OTP_TYPES.SIGNUP_EMAIL_VERIFICATION) {
            let prevOtp = user[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION]
            if(!prevOtp) {
               res.json(MSG.OTP_EMAIL_ALREADY_VERIFIED)
               return
            }

            const newOTP = getNewOTP(prevOtp)
            if(!newOTP) {
                return res.json(MSG.OTP_WAIT_TIME)
            }

            // Send the OTP Mail
            sendVerificationMail(user.email, newOTP.otp, user.firstname)
            res.json({ status: 200, msg: 'OTP sent successfully ...'})

            // Save the New OTP in user
            isDBUpdateRequired = true
            user[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION] = newOTP.formattedOTP
        }

        // if it is a forgot password otp
        else if(otpType === OTP_TYPES.FORGOT_PASSWORD) {
            let prevOtp = user[OTP_TYPES.FORGOT_PASSWORD]
            const newOTP = getNewOTP(prevOtp)

            if(!newOTP) {
                return res.json(MSG.OTP_WAIT_TIME)
            }

            // Send the OTP Mail
            sendForgotPswdOTPMail(user.email, newOTP.otp, user.firstname)
            res.json({ status: 200, msg: 'OTP sent successfully ...'})

            // Save the New OTP in user
            isDBUpdateRequired = true
            user[OTP_TYPES.FORGOT_PASSWORD] = newOTP.formattedOTP
        }

        // If any of the above code made any change in User's OTP,
        // Save it back to DB
        if(isDBUpdateRequired) {
            db.collection(CONFIG.usersCollection).updateOne(
                { email },
                { $set: user }
            )
        }
    }
    catch (err) {
        console.log(err)
        res.json(MSG.OTP_SEND_ERROR)
    }
}


module.exports = resendOTPController