/**
 * This will give the author his / her story
 * i.e. it will not check if isPublished === true
 * 
 * This must be protected by both authGuard and authorGuard
 */
const { getBannerImgRoot } = require('../constants/globals')

 const getMyStoryController = async (req, res, next) => {
    // Since it has passed both authGuard and authorGUard
    // The tale is available in req.tale
    res.json({
        status: 200,
        tale: req.tale,
        bannerImgRoot: getBannerImgRoot()
    })
 }

 module.exports = getMyStoryController