const crypter = require('../utils/crypter')
const MSG = require('../constants/msg')
// const Tale = require('../models/tale')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { getRandomString } = require('../services/misc.service')

const createTaleController = async (req, res, next) => {
    try {
        // Since it has passed authGurad, loggedIn user email can be found in req
        //console.log('logged in user ', req.email)
        const tokenEmail = req.email
        const submittedTale = req.body
        if(!Array.isArray(submittedTale.info.tags)) {
            submittedTale.info.tags = submittedTale.info.tags.split(',').map(t => t.trim())
        }

        // Tags must must must be LowerCased
        submittedTale.info.tags = submittedTale.info.tags.map(t => t.toString().toLocaleLowerCase().trim())

        // loggedIn email should match the submitted tale authorEmail
        if (
            !submittedTale.info.authorEmail
            || submittedTale.info.authorEmail !== tokenEmail
        ) {
            res.json(MSG.GENERIC_EMAILMISMATCH)
            return
        }

        const db = getDB()
        const talesCollection = db.collection(CONFIG.talesCollection)

        // if storyUrl is already present in the submittedTale, 
        // then it an UPDATE
        // In that case check 
        // IF dbTale.info.authorEmail === submittedTale.info.authorEmail

        // CHECK IF STORYURL and STORY ACTUALLY EXISTS
        // OR JUST A HACKER HAS PUT SOME STORYURL
        let existingTale = null
        if (submittedTale.info.storyUrl) {
            existingTale = await talesCollection.findOne({ "info.storyUrl": submittedTale.info.storyUrl })
        }

        // UPDATE CASE
        if (existingTale) {
            if (existingTale.info.authorEmail !== submittedTale.info.authorEmail) {
                res.json(MSG.GENERIC_EMAILMISMATCH)
            }
            else {
                delete submittedTale._id
                // console.log(submittedTale)
                try {
                    // let tale = new Tale(submittedTale)
                    // await existingTale.updateOne(submittedTale)
                    // await Tale.updateOne({info: {storyUrl: submittedTale.storyUrl}}, tale)
                    
                    // ADD MODIFICATION DATE
                    // submittedTale.info.dateModified = (new Date()).toUTCString()
                    submittedTale.info.doM = (new Date()).getTime()

                    await talesCollection.updateOne(
                        { "info.storyUrl": submittedTale.info.storyUrl },
                        { $set: submittedTale }
                    )

                    res.json({
                        status: 200,
                        submittedTale
                    })
                }
                catch (e) {
                    console.log(e)
                    res.json(MSG.GENERIC_FAILURE)
                }
            }
            return
        }
        
        // CREATE CASE
        else {
            // 
            // IF storyUrl was never cretade before, then
            // check if desiredUrl is 
            // i) Supplied 
            // ii) valid => means only alphanumeric and -, and atleast desiredLength chars long
            // iii) is available to take
            let desiredUrl = submittedTale.info.desiredUrl
            // STEP 1: remove all characters other than alphanum and '-'
            if(desiredUrl) {
                desiredUrl = desiredUrl.replace(/[^A-Z0-9-]/gi, '')
            }

            // STEP 2: if desiredUrl of shorter length, make it of proper length
            const desiredLength = 6
            if(desiredUrl && desiredUrl.length < desiredLength) {
                desiredUrl += '-' + getRandomString(desiredLength - desiredUrl.length - 1).toLowerCase()
            }

            // STEP 3: if no desiredUrl, supply one
            if(!desiredUrl) {
                desiredUrl = getRandomString(desiredLength).toLowerCase()
            }

            // STEP 4: Availability check
            // if not available, keep on appending 1, 2, 3, ... , n
            let isDesiredUrlFound = false
            let iterCount = 0
            let suggestedUrl = desiredUrl
            while(!isDesiredUrlFound) {
                const existingTale = await talesCollection.findOne({ "info.storyUrl": suggestedUrl })

                if(!existingTale) {
                    isDesiredUrlFound = true
                }
                else {
                    ++iterCount
                    suggestedUrl = submittedTale.info.desiredUrl + '-' + iterCount
                }
            }
            
            // URL FOUND AND FINALIZED
            submittedTale.info.storyUrl = suggestedUrl
            // ADD CREATION DATE
            // submittedTale.info.dateCreated = (new Date()).toUTCString()
            submittedTale.info.doC = (new Date()).getTime()     // doC = date of Creation
            submittedTale.info.doM = submittedTale.info.doC     // doM = date of Modification

            /**
             * TADA! A NEW TALE IS BEING BORN HERE
             */
            await talesCollection.insertOne(submittedTale)

            res.json({
                status: 200,
                submittedTale
            })
        }
    }
    catch (e) {
        console.log(e)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = createTaleController