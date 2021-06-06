/**
 * This guard will stop anyone from copying someone else's bearer token
 * and use it to get data.
 * Even if someone steals other people's token, he will not be able to use it 
 * unless he knows which bearer token encrypts which email id.
 * 
 * This guard MUST COME AFTER authGuard
 * 
 * To use this protection, the request must contain "email"
 */
const MSG = require('../constants/msg')

const imposterGuard = (req, res, next) => {
    try {
        const email = req.params.email || req.body.email || req.fields.email
        if(req.email !== email) throw "This guy is NOT who he says he is..."
        next()
    }
    catch (e) {
        res.json(MSG.GENERIC_EMAILMISMATCH)
    }
}

module.exports = imposterGuard