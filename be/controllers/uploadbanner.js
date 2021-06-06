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
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const sharp = require('sharp')
const { getStoryImgUploadDir } = require('../services/dbService')

const IMG_MAX_WIDTH = 810   // 270 * 3, since our card image is 270x150
const IMG_MAX_HEIGHT = 450  // 150 * 3, since our card image is 270x150

const IMG_SQUARE_X = 270    // WhatsApp sharing needs a square image of 300x300

const uploadDir = getStoryImgUploadDir()

const uploadBannerController = async (req, res, next) => {
    try {
        // Since it has passed both authGuard and authorGUard
        // The tale is available in req.tale
        const { fields, files, tale } = req
        const oldpath = files.storybanner.path
        // const newFileName = tale.info.storyUrl + files.storybanner.name.substring(files.storybanner.name.lastIndexOf('.'))
        const newFileName = `${tale.info.storyUrl}___${Date.now()}.webp`
        const newpath = path.join(uploadDir, newFileName)

        const newFileName_Square = `${tale.info.storyUrl}___${Date.now()}.300x.webp`
        const newpath_Square = path.join(uploadDir, newFileName_Square)

        // Old Image path, we need to delete this later
        let oldImgPath = ''
        if(tale.info.imgUrl) {
            oldImgPath = path.join(uploadDir, tale.info.imgUrl)
        }
        
        // RESIZE THE IMAGE
        // WRITE THE NEW IMAGE
        await sharp(oldpath)
                .resize(IMG_MAX_WIDTH, IMG_MAX_HEIGHT, {
                    // fit: "inside",
                    withoutEnlargement: true
                })
                .toFile(newpath)

        // DO THE SAME FOR WHATSAPP SQUARE IMAGE
        await sharp(oldpath)
                .resize(IMG_SQUARE_X, IMG_SQUARE_X, {
                    fit: "fill"
                })
                .toFile(newpath_Square)

        // New File Written Successfully,
        // delete the temp file
        // console.log('oldpath = ', oldpath)
        fs.unlink(oldpath, err => {
            if (err) {
                console.log('Error while trying to delete temp file story banner')
                console.log(err)
            }
        });
        
        // Update the tale in DB
        const dbWriteRes = await getDB().collection(CONFIG.talesCollection)
        .updateOne(
            { "info.storyUrl": tale.info.storyUrl },
            { $set: { "info.imgUrl": newFileName } }
        )

        // Delete The Old Image, if Exists
        if(oldImgPath) {
            fs.unlink(oldImgPath, err => {
                if (err) {
                    console.log('Error while trying to delete old story banner')
                    console.log(err)
                }
                else console.log('Deletion successful for old path = ', oldImgPath)
            });

            // Delet the WhatsApp image also
            const EXT = '.webp'
            let squareImgPath = oldImgPath.substr(0, oldImgPath.length-EXT.length) + '.300x.webp'
            fs.unlink(squareImgPath, err => {
                if (err) {
                    console.log('Error while trying to delete old story banner')
                    console.log(err)
                }
                else console.log('Deletion successful for old path = ', squareImgPath)
            });
        }

        // Finally send the response
        res.json({
            status: 200,
            msg: 'Image uploaded successfully ...',
            dbWriteRes,
            newFileName
        })
        



        // Read the file
        // fs.readFile(oldpath, (err, data) => {
        //     if (err) throw err;

        //     // Write the file
        //     fs.writeFile(newpath, data, async err => {
        //         if (err) throw err;


        //         // New File Written Successfully,
        //         // Now delete the old File
        //         if(tale.info.imgUrl) {
        //             let oldBanner = path.join(uploadDir, tale.info.imgUrl)

        //             //try deleting it, but don't throw error
        //             fs.unlink(oldpath, err => {
        //                 console.log('Error while trying to delete old story banner')
        //                 console.log(err)
        //             });
        //         }

        //         // Update the tale in DB
        //         const dbWriteRes = await getDB().collection(CONFIG.talesCollection)
        //         .updateOne(
        //             { "info.storyUrl": tale.info.storyUrl },
        //             { $set: { "info.imgUrl": newFileName } }
        //         )

        //         // Finally send the response
        //         res.json({
        //             status: 200,
        //             msg: 'Image uploaded successfully ...',
        //             dbWriteRes,
        //             newFileName
        //         })
        //     })
        // })
    }
    catch (e) {
        console.log(e)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = uploadBannerController