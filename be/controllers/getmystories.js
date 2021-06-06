/**
 * Return ALL the stories of this loggedIn user
 * This route must be protected with authGuard
 */

const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')

const getMyStoriesController = async (req, res, next) => {

    try {
        // Since it should pass authGuard
        // Check for accidental bypasing
        if (!req.email) {
            res.json(MSG.GENERIC_NOTSIGNEDIN)
            return
        }

        const db = getDB()
        const tales = await db.collection(CONFIG.talesCollection)
            .find({ "info.authorEmail": req.email })
            .project({_id: 0, info: 1})
            .toArray()

        res.json({
            status: 200,
            tales
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = getMyStoriesController