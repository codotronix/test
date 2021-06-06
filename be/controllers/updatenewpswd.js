const crypter = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { OTP_TYPES } = require('../constants/enums')

const updatePswdController = async (req, res, next) => {
    const { email, pswdchangeotp, newpswd } = req.body

    if(!email || !pswdchangeotp || !newpswd) {
        return res.json(MSG.GENERIC_PARAMSMISSING)    
    }

    try {
        const db = getDB()

        let user = await db.collection(CONFIG.usersCollection).findOne({ email })
        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST)
            return
        }

        // New pswd should not be same as prev pswd
        if(crypter.hash(newpswd) === user.pswd) {
            return res.json(MSG.PSWD_SAMEASPREV)
        }

        // IF OTP DOES NOT MATCH
        if (!user[OTP_TYPES.FORGOT_PASSWORD] || pswdchangeotp != user[OTP_TYPES.FORGOT_PASSWORD].split('_')[0]) {
            console.log(user[OTP_TYPES.FORGOT_PASSWORD])
            console.log(pswdchangeotp)
            return res.json(MSG.OTP_MISMATCH)
        }

        // IF EVERYTHING IS FINE
        // DELETE OTP and CHANGE PASSWORD
        user[OTP_TYPES.FORGOT_PASSWORD] = ''
        user.pswd = crypter.hash(newpswd)

        await db.collection(CONFIG.usersCollection).updateOne(
            { email },
            { $set: user }
        )
        
        res.json({
            status: 200,
            msg: 'Password changed successfully ...'
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = updatePswdController