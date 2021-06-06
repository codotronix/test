/**
 * This will let only the Author of This story Pass
 * So, either in GET or POST
 * Required Parameter is 'storyUrl'
 * It will read story from db and compare authorEmail with tokenEmail
 * IF emails match,
 * Add the story in req object in req.tale
 * 
 * **IMPORTANT**
 * IT MUST BE CALLED AFTER authGuard
 */
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')

const authorGuard = async (req, res, next) => {
    const storyUrl = req.params.storyUrl || req.body.storyUrl || req.fields.storyUrl // got GET and POST and FileUpload
    const email = req.email || req.fields.email
    // console.log(req.fields)
    // console.log(req.files)

    if (!storyUrl) {
        res.json(MSG.GUARDERROR_PARAMMISSING)
    }

    // This guard MUST COME after authGuard
    if(!req.email) {
        res.json(MSG.GUARDERROR_CALLINGSEQUENCE)
    }

    // Read the Story from DB
    try {
        const db = getDB()
        const tale = await db.collection(CONFIG.talesCollection).findOne({"info.storyUrl": storyUrl})

        if(!tale) {
            res.json(MSG.STORY_NOTFOUND)
            return
        }
        
        if(tale.info.authorEmail !== email) {
            res.json(MSG.GENERIC_EMAILMISMATCH)
            return
        }

        // Reached this point means this User is Author
        req.tale = tale
        next()
    }
    catch (err) {
        res.json(MSG.GENERIC_NOTSIGNEDIN)
    }
}

module.exports = authorGuard