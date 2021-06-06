const { decrypt } = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const { readAllStories } = require('../services/dbService')
const CONFIG = require('../../config')
const { defaultImg } = require('../constants/globals')

const viewProfileController = async (req, res, next) => {
    let userId = req.params.userId
    let user = {}   // init user with a blank json 

    try {
        const db = getDB()

        // UserId must be atleast 5 char long
        if(!userId || userId.length < 5) {
            // do nothing
        }
        // If userId starts with '@' then it is a valid username 
        // and can be searched with the same in DB
        // Else, the userId must encrypted emailId,
        // and in this case we can get the user by decyrpting the email id
        else if(userId[0] === '@') {
            // search user db with userId
            userId = userId.substr(1)
            user = await db.collection(CONFIG.usersCollection).findOne({ username: userId })
        }
        else {
            const email = decodeURIComponent(decrypt(userId))
            user = await db.collection(CONFIG.usersCollection).findOne({ email })
        }

        // Now get the stories written by this user, if any
        const talesRes = await readAllStories(user.email)
        let tales = []
        if(talesRes.tales) {
            tales = talesRes.tales.map(t => {
                t.info.imgUrl = t.info.imgUrl ? `/ups/banners/${t.info.imgUrl}` : defaultImg
                return t
            })
        }

        res.render('templates/profile', { user, tales })
    }
    catch (err) {
        console.log(err)
        res.render('templates/profile', { user: {}, tales: [] })
    }
}

module.exports = viewProfileController