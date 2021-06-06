const MSG = require('../constants/msg')
// const { readAllStories } = require('../services/dbService')
const { readAllStories } = require('../services/firestore.service')
const { getBannerImgRoot } = require('../constants/globals')

const getAllStories = async (req, res, next) => {
    const r = await readAllStories()
    if (r.status === 200) {
        r.bannerImgRoot = getBannerImgRoot()
        res.json(r)
    }
    else {
        console.log(r)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = getAllStories