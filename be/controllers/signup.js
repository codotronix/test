const crypter = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { sendVerificationMail } = require('../services/mail.service')
const { OTP_TYPES } = require('../constants/enums')
const { createUpdateUsername } = require('../services/dbService')

const signupController = async (req, res, next) => {
    // res.send('sigining up')
    // console.log(req.body)
    let newUser = {...req.body}

    if(
        !newUser.firstname
        || !newUser.lastname
        || !newUser.email
        || !newUser.pswd
    ) {
        res.json(MSG.SIGNUP_PARAMSMISSING)
        return
    }

    try {
        const db = getDB()
        const usersCollection = db.collection(CONFIG.usersCollection)
        // let existingUser = await User.findOne({email: newUser.email})
        let existingUser = await usersCollection.findOne({email: newUser.email})
        if(existingUser) {
            res.json(MSG.SIGNUP_DUPLICATEEMAIL)
            return
        }
        newUser.pswd = crypter.hash(newUser.pswd)
        // let user = new User(newUser)
        newUser[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION] = Math.floor(Math.random() * 900000 + 99999)   // a 6 digit OTP
        newUser[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION] += '_' + Date.now()    // Time when OTP was created
        await usersCollection.insertOne(newUser)

        // Also create an username / handler for this user
        await createUpdateUsername(newUser.firstname, newUser.email)

        // Send Verification Mail
        sendVerificationMail(newUser.email, newUser[OTP_TYPES.SIGNUP_EMAIL_VERIFICATION].split('_')[0], newUser.firstname)

        // let tok = crypter.createToken({ email: newUser.email })
        res.json({
            status: 200,
            msg: 'Signup successful. Please login to continue.'
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.SIGNUP_FAILED)
    }
}

module.exports = signupController