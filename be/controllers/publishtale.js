/**
 * This ill publish / unpublish a tale
 */
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')

const publishTaleController = async (req, res, next) => {
    try {
        await getDB().collection(CONFIG.talesCollection)
            .updateOne(
                { "info.storyUrl": req.body.storyUrl },
                { $set: { isPublished: req.body.isPublished } }
            )

        res.json({
            status: 200,
            msg: (req.body.isPublished ? 'Published' : 'Unpublished') + ' successfully ...'
        })
    }
    catch (e) {
        console.log(e)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = publishTaleController