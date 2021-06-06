/**
 * This must pass AuthGuard. Hence email will be available on req
 * 
 * historyObj: see 'addToHistory' function in dbService to know the keys
 */
const MSG = require('../constants/msg')
const { addToHistory } = require('../services/dbService')

const updateMyReadHistory = async (req, res, next) => {
    const { email, historyObj } = req.body

    // console.log('req = ', req)
    // console.log('req.body = ', req.body)

    if(!email || !historyObj) {
        return res.json(MSG.GENERIC_PARAMSMISSING)
    }
    else if(email !== req.email) {
        return res.json(MSG.GENERIC_EMAILMISMATCH)
    }

    const r = await addToHistory(email, historyObj)
    if (r.status === 200) {
        res.json(r)
    }
    else {
        console.log(r)
        res.json(MSG.GENERIC_FAILURE)
    }
    
}

module.exports = updateMyReadHistory