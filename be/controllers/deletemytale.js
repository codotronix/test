/**
 * This will give the author ability to delete his / her story
 * 
 * This must be protected by both authGuard and authorGuard
 */
const path = require('path')
const fs = require('fs')
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { getStoryImgUploadDir } = require('../services/dbService')

const { deleteStory } = require('../services/firestore.service')

const uploadDir = getStoryImgUploadDir()

const deleteMyTaleController = async (req, res, next) => {
    // Since it has passed both authGuard and authorGUard
    // The tale is available in req.tale
    const { tale } = req
    try {
        // const db = getDB()
        // await db.collection(CONFIG.talesCollection).deleteOne({"info.storyUrl": tale.info.storyUrl})
        await deleteStory(tale._fireID)

        // Don't forget to delete the image
        if(tale.info.imgUrl) {
            const oldImgPath = path.join(uploadDir, tale.info.imgUrl)
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

        res.json({
            status: 200,
            msg: "Successfully deleted tale " + tale.info.name
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
 }

 module.exports = deleteMyTaleController