const MSG = require('../constants/msg')
// const Tale = require('../models/tale')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')

const getStoryController = async (req, res, next) => {
    const storyUrl = req.params.storyUrl

    if(!storyUrl) {
        res.json(MSG.GENERIC_PARAMSMISSING)
        return
    }

    try {
        const db = getDB()
        const tale = await db.collection(CONFIG.talesCollection).findOne({"info.storyUrl": storyUrl})

        if(!tale) {
            res.json(MSG.STORY_NOTFOUND)
            return
        }

        // TODO: COMMENT IN AFTER /publish API IS DONE
        if(!tale.isPublished) {
            res.json(MSG.STORY_NOTPUBLISHED)
            return
        }

        res.json({
            status: 200,
            tale
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = getStoryController
