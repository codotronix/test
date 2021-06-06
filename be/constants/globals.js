"use strict";
// module.exports.defaultImg = '/assets/img/bg/small/storytelling-4203628_640.jpg';

module.exports = {
    defaultImg: `${getBannerImgRoot()}/storytelling-4203628_640.jpg`,
    getStoryBannerBucketName,
    getBannerImgRoot
}

function getStoryBannerBucketName () {
    return process.env.TALE_BANNER_BUCKET
}

function getBannerImgRoot () {
    return `https://storage.googleapis.com/${getStoryBannerBucketName()}`
}