/**
 * This must pass AuthGuard. Hence email will be available on req
 */
const MSG = require('../constants/msg')
const { createUpdateUsername } = require('../services/dbService')

const updateUsername = async (req, res, next) => {
    const { email, username } = req.body

    if(!email || !username) {
        res.json(MSG.GENERIC_PARAMSMISSING)
        return
    }

    // If supplied email does not match the token email
    if(email !== req.email) {
        res.json(MSG.GENERIC_EMAILMISMATCH)
        return
    }
    const r = await createUpdateUsername(username, email)
    if (r.status === 200 || r.status === 2050 || r.status === 2051) {
        res.json(r)
    }
    else {
        console.log(r)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = updateUsername