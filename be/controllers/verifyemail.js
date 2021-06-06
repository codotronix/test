const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { OTP_TYPES } = require('../constants/enums')
const { getUserByEmail, updateUser } = require('../services/firestore.service')

const verifyEmailController = async (req, res, next) => {
    const { email, otp } = req.body 

    if(!email || !otp) {
        res.json(MSG.SIGNIN_PARAMSMISSING)
        return
    }

    try {
        // const db = getDB()
        // let user = await User.findOne({ email: data.email })
        // let user = await db.collection(CONFIG.usersCollection).findOne({ email })
        let user = await getUserByEmail(email)
        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST)
            return
        }

        let otpInDB = user[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION]

        // If otpInDB is Present, then verify
        // On verification successful, delete it
        if(otpInDB) {
            let actualOTP = otpInDB.split('_')[0] // strcuture is numericOTP_dateTimeInMS
            if(actualOTP == otp) {
                // Delete the OTP from DB
                user[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION] = ''
                // await db.collection(CONFIG.usersCollection).updateOne(
                //     { email },
                //     { $set: user }
                // )
                await updateUser(email, user)

                res.json({ ...MSG.GENERIC_SUCCESS, msg: 'Verification Successful ...'})
            }
            else {
                res.json(MSG.OTP_MISMATCH)
            }
        }
        // Else, it has already been deleted, means verification successful
        else {
            res.json({ ...MSG.GENERIC_SUCCESS, msg: 'Verification Successful ...' })
        }
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = verifyEmailController