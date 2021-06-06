/**
 * This must pass AuthGuard. Hence email will be available on req
 */
const MSG = require('../constants/msg')
const { saveUpdateMyProfile } = require('../services/dbService')

const updateMyProfile = async (req, res, next) => {
    const { email, user } = req.body

    if(!email || !user) {
        res.json(MSG.GENERIC_PARAMSMISSING)
        return
    }
    else if(email !== req.email) {
        return res.json(MSG.GENERIC_EMAILMISMATCH)
    }

    const r = await saveUpdateMyProfile(email, user)
    if (r.status === 200 || r.status === 2101) {
        res.json(r)
    }
    else {
        console.log(r)
        res.json(MSG.GENERIC_FAILURE)
    }
    
}

module.exports = updateMyProfile