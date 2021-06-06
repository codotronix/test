const MSG = require('../constants/msg')
// const { getDB } = require('../services/mongo')
const { getUserByEmail } = require('../services/firestore.service')

const getLoggedInUserController = async (req, res, next) => {
    // Since this route is auth guarded
    // And this request has reached here means, tok auth is successful
    try {
        // const db = getDB()
        const tokenEmail = req.email
        // let user = await db.collection('users').findOne({ email: tokenEmail })
        let user = await getUserByEmail(tokenEmail)

        if (user) {
            //remove sensitive fields
            delete user._id
            delete user.pswd
            res.json({
                status: 200,
                user
            })
        }
        else {
            res.json(MSG.SIGNIN_EMAILNOTEXIST)
            return
        }
    }
    catch (e) {
        console.log(e)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = getLoggedInUserController