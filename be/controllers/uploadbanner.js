/**
 * This will 
 * 1. delete the old banner for that tale
 * 2. upload the new banner image
 * 3. process the image if required
 * 4. update the tale's imgUrl path
 * 
 * This must be protected by both authGuard and authorGuard
 */
const path = require('path')
const fs = require('fs')
const MSG = require('../constants/msg')
const { getStoryBannerBucketName, getBannerImgRoot } = require('../constants/globals')
const sharp = require('sharp')
const { getStoryImgUploadDir } = require('../services/dbService')
const { updateStory } = require('../services/firestore.service')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const BUCKETNAME = getStoryBannerBucketName()

const IMG_MAX_WIDTH = 810   // 270 * 3, since our card image is 270x150
const IMG_MAX_HEIGHT = 450  // 150 * 3, since our card image is 270x150

const IMG_SQUARE_X = 300    // WhatsApp sharing needs a square image of 300x300

const uploadDir = getStoryImgUploadDir()

const uploadBannerController = async (req, res, next) => {
    try {
        // Since it has passed both authGuard and authorGUard
        // The tale is available in req.tale
        const { files, tale } = req
        const oldpath = files.storybanner.path
        // const newFileName = tale.info.storyUrl + files.storybanner.name.substring(files.storybanner.name.lastIndexOf('.'))
        const newFileName = `${tale.info.storyUrl}___${Date.now()}.webp`
        const newpath = path.join(uploadDir, newFileName)

        const newFileName_Square = `${tale.info.storyUrl}___${Date.now()}.300x.webp`
        const newpath_Square = path.join(uploadDir, newFileName_Square)
        
        // RESIZE THE IMAGE
        // WRITE THE NEW IMAGE
        await sharp(oldpath)
                .resize(IMG_MAX_WIDTH, IMG_MAX_HEIGHT, {
                    // fit: "inside",
                    withoutEnlargement: true
                })
                .toFile(newpath)

        // Upload in GCP
        let errors = []
        try {
            await storage.bucket(BUCKETNAME).upload(newpath, {
                destination: newFileName,
            });
        }
        catch(err) {
            errors.push('Error while uploading the image file to bucket.')
        }

        // DO THE SAME FOR WHATSAPP SQUARE IMAGE
        await sharp(oldpath)
            .resize(IMG_SQUARE_X, IMG_SQUARE_X, {
                fit: "fill"
            })
            .toFile(newpath_Square)

        try {
            await storage.bucket(BUCKETNAME).upload(newpath_Square, {
                destination: newFileName_Square,
            });
        }
        catch(err) {
            errors.push('Error while uploading the square image file to bucket.')
        }

        // New File Written Successfully,
        // delete the local files
        // console.log('oldpath = ', oldpath)
        fs.unlink(oldpath, err => {
            if (err) {
                console.log('Error while trying to delete temp file story banner at =' + oldpath)
                console.log(err)
            }
        });
        fs.unlink(newpath, err => {
            if (err) {
                console.log('Error while trying to delete local file story banner at = ' + newpath)
                console.log(err)
            }
        });
        fs.unlink(newpath_Square, err => {
            if (err) {
                console.log('Error while trying to delete local square-file story banner at = ' + newpath_Square)
                console.log(err)
            }
        });
        const updatedInfo = { 
            ...tale.info,
            imgUrl: newFileName
        }
        updateStory(tale._fireID, { info: updatedInfo })

        // Delete The Old Image, if Exists
        
        if(tale.info.imgUrl) {
            const EXT = '.webp'
            let squareImgUrl = tale.info.imgUrl.substr(0, tale.info.imgUrl.lastIndexOf(EXT)) + '.300x.webp'
            // try {
                storage.bucket(BUCKETNAME).file(tale.info.imgUrl).delete().catch(err => console.log(err))
            // }
            // catch(err) {
            //     errors.push('error while trying to delete the old image.')
            // }
            // try {
                storage.bucket(BUCKETNAME).file(squareImgUrl).delete().catch(err => console.log(err))
            // }
            // catch(err) {
            //     errors.push('error while trying to delete the square image.')
            // }
        }

        // Finally send the response
        // https://storage.googleapis.com/rtl-story-banner-dev/bell-the-cat___1617210115579.webp
        res.json({
            status: 200,
            msg: 'Image uploaded successfully ...',
            imgUrl: `${getBannerImgRoot()}/${newFileName}`,
            errors
        })

    }
    catch (e) {
        console.log(e)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = uploadBannerController