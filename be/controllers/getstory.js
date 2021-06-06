const MSG = require('../constants/msg')
// const Tale = require('../models/tale')
// const { getDB } = require('../services/mongo')
// const CONFIG = require('../../config')
const { getStoriesBy } = require('../services/firestore.service')
const { getBannerImgRoot } = require('../constants/globals')

const getStoryController = async (req, res, next) => {
    const storyUrl = req.params.storyUrl

    if(!storyUrl) {
        res.json(MSG.GENERIC_PARAMSMISSING)
        return
    }

    try {
        // const db = getDB()
        // const tale = await db.collection(CONFIG.talesCollection).findOne({"info.storyUrl": storyUrl})
        let tale = null
        let temp = await getStoriesBy({"info.storyUrl": storyUrl})
        if(temp && Array.isArray(temp) && temp.length > 0) tale = temp[0]

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
            tale,
            bannerImgRoot: getBannerImgRoot()
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = getStoryController
