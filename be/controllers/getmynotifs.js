/**
 * This route must be protected with authGuard
 */

const MSG = require('../constants/msg')
const { getNotifications } = require('../services/firestore.service')

const getMyNotifsController = async (req, res, next) => {

    try {
        // Since it should pass authGuard
        // Check for accidental bypasing
        if (!req.email) {
            res.json(MSG.GENERIC_NOTSIGNEDIN)
            return
        }

        const notifs = await getNotifications('forEmails', req.email)

        res.json({
            ...MSG.GENERIC_SUCCESS,
            notifs, 
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = getMyNotifsController