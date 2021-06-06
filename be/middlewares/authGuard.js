/**
 * This middleware will let only loggedIn users pass,
 * ((Hey, it might be stolen though, and where is time check ???))
 * Also IF user is succesfully logged in, 
 * Add the logged in email in req.email
 */
const crypter = require('../utils/crypter')
const MSG = require('../constants/msg')

const authGuard = (req, res, next) => {
    try {
        let authToken = req.get('Authorization')
        if(!authToken) throw('Bearer token not found')
        authToken = authToken.split(' ')[1]
        if(!authToken) throw('Bearer token not found')
        let tok = crypter.decodeToken(authToken)
        if(!tok) throw('Bearer token not found')
        req.email = tok.email
        next()
    }
    catch (e) {
        res.json(MSG.GENERIC_NOTSIGNEDIN)
    }
}

module.exports = authGuard