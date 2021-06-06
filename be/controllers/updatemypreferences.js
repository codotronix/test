/**
 * This must pass AuthGuard. Hence email will be available on req
 * 
 * partialPrefs: see 'updateMyPrefs' function in dbService to know the keys
 */
const MSG = require('../constants/msg')
const { updateMyPrefs } = require('../services/dbService')

const updateMyPrefences = async (req, res, next) => {
    const { email, partialPrefs } = req.body

    // console.log('req = ', req)
    // console.log('req.body = ', req.body)

    if(!email || !partialPrefs) {
        return res.json(MSG.GENERIC_PARAMSMISSING)
    }
    else if(email !== req.email) {
        return res.json(MSG.GENERIC_EMAILMISMATCH)
    }

    const r = await updateMyPrefs(email, partialPrefs)
    if (r.status === 200) {
        res.json(r)
    }
    else {
        console.log(r)
        res.json(MSG.GENERIC_FAILURE)
    }
    
}

module.exports = updateMyPrefences