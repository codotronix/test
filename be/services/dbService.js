/**
 * This file will do all the db read / write / update services.
 * The services should have a clear reusable input / output interfaces.
 */
const path = require('path')
const { getDB } = require('./mongo')
const CONFIG = require('../../config')
const {getRandomString} = require('./misc.service')
const MSG = require('../constants/msg')
const { refineObject } = require('./misc.service')

module.exports = {
    readAllStories,
    searchTales,
    createUpdateUsername,
    saveUpdateMyProfile,
    addToHistory,
    updateMyPrefs,
    getStoryImgUploadDir
}

async function searchTales (queryObject) {
    let query = { isPublished: true }   // mandatory param
    let queryForUI = {} // To display in UI what is this result for
    let tales = []
    let queryValid = false
    const validFields = {   
        name: 'Name', 
        genre: 'Genre', 
        lang: 'Language', 
        tags: 'Tags',
        authorDisplayName: 'Author'
    }
    Object.keys(queryObject).map(k => {
        if(Object.keys(validFields).includes(k)) {
            let val = decodeURIComponent(queryObject[k])
            let arrayOfValues = val.toString().split(',').map(s => s.trim())
            query[`info.${k}`] = { "$in": arrayOfValues }
            queryForUI[validFields[k]] = val
            queryValid = true
        }
    })

    if(!queryValid) {
        return {
            status: 200,
            tales, 
            queryForUI
        }
    }

    try {
        const db = getDB()
        // console.log("query = ", query)
        tales = await db.collection(CONFIG.talesCollection)
                                .find(query)
                                .limit(1000)
                                .project({
                                    _id: 0,
                                    info: 1
                                })
                                .toArray()

        // console.log("tales = ", tales)
        
        return {
            status: 200,
            tales, queryForUI
        }
    }
    catch (err) {
        return err
    }
}


/**
 * Get all the published stories,
 * of a writer IFF email address is provided
 * @param {String} byEmail | Email address
 */
async function readAllStories (byEmail) {
    const query = { isPublished: true }
    if(byEmail) query["info.authorEmail"] = byEmail

    try {
        const db = getDB()
        const tales = await db.collection(CONFIG.talesCollection)
                                .find(query)
                                .limit(1000)
                                .project({
                                    _id: 0,
                                    info: 1
                                })
                                .toArray()
        return {
            status: 200,
            tales
        }
    }
    catch (err) {
        return err
    }
}

/**
 * This function will create an Unique username for the user,
 * If username is provided, it will try to use the one
 */
async function createUpdateUsername (username, email) {
    const usernameMinLen = 6
    const usernameMaxLen = 20
    try {
        const usersCollection = getDB().collection(CONFIG.usersCollection)
        
        if(!username) username = getRandomString(usernameMinLen).toLowerCase()
        else if(username.length < usernameMinLen) username += getRandomString(usernameMinLen-username.length).toLowerCase()
        else if(username.length > usernameMaxLen) username = username.substr(0, usernameMaxLen)

        // if not available, keep on appending 1, 2, 3, ... , n
        let isDesiredUsernameFound = false
        let rand = 0
        let suggestedUsername = username
        while(!isDesiredUsernameFound) {
            const existingUser = await usersCollection.findOne({ username: suggestedUsername })

            if(!existingUser) {
                isDesiredUsernameFound = true
            }
            else if(existingUser && existingUser.email === email) {
                return MSG.USERNAME_SAMEASNOW
            }
            else {
                rand += Math.floor(Math.random() * 99 + 1)
                suggestedUsername = username + '-' + rand
            }
        }

        // Update the username
        await usersCollection.updateOne(
            { email },
            { $set: { username: suggestedUsername } }
        )

        return {
            status: 200,
            msg: "Successfully set new username",
            info: {
                username,
                newUsername: suggestedUsername,
                email
            }
        }
    }
    catch (err) {
        return err
    }
}

// async function createUpdateUsername (username, email) {
//     const usernameMinLen = 6
//     const usernameMaxLen = 20
//     try {
//         const usersCollection = getDB().collection(CONFIG.usersCollection)
        
//         if(!username) username = getRandomString(usernameMinLen)
//         else if(username.length < usernameMinLen) username += getRandomString(usernameMinLen-username.length)
//         else if(username.length > usernameMaxLen) username = username.substr(0, usernameMaxLen)

//         const existingUser = await usersCollection.findOne({ username })

//         if(!existingUser) {
//             // isDesiredUsernameFound = true
//             // Update the username
//             await usersCollection.updateOne({ email },{ $set: { username } })
//             return {
//                 status: 200,
//                 msg: "Successfully set new username",
//                 info: {
//                     username,
//                     email
//                 }
//             }
//         }
//         else if(existingUser && existingUser.email === email) {
//             return MSG.USERNAME_SAMEASNOW
//         }
//         else {
//             return MSG.USERNAME_NOTAVAILABE
//         }
//     }
//     catch (err) {
//         return err
//     }
// }

async function saveUpdateMyProfile (email, user) {
    // Delete sensitive infos as this is bulk save of full profile data
    // so we don't want to accidentally overwrite primary keys / unique fields
    // like username or email
    const keysToSave = [
        'firstname',
        'lastname',
        'gender',
        'country',
        'lang1',
        'lang2',
        'lang3',
        'dob',
        'aboutme',
        'facebookID',
        'twitterID'
    ]
    let refinedUser = {}
    for(let k of keysToSave) {
        if(typeof(user[k]) !== "undefined") {
            refinedUser[k] = user[k]
        }
    }

    try {
        const usersCollection = getDB().collection(CONFIG.usersCollection)

        const existingUser = await usersCollection.findOne({ email })

        if(!existingUser) {
            return MSG.MYPROFILE_USERDOESNOTEXIST
        }
        else {
            // Update the user
            await usersCollection.updateOne({ email }, { $set: refinedUser })
            return {
                updatedUserData: refinedUser,
                status: 200,
                msg: 'Profile successfully updated'
            }
        }
    }
    catch (err) {
        return err
    }
}

/**
 * This will add this history object in user history
 * @param {String} email 
 * @param {Object} historyObj 
 */
async function addToHistory (email, historyObj) {
    // To get rid off unnecessary data
    const validKeys = ['storyName', 'storyUrl']
    let refinedObj = refineObject(historyObj, validKeys)

    refinedObj['timestamp'] = (new Date()).getTime()

    try {
        const usersCollection = getDB().collection(CONFIG.usersCollection)

        const existingUser = await usersCollection.findOne({ email })

        // This scenario should never occur
        if(!existingUser) {
            return MSG.MYPROFILE_USERDOESNOTEXIST
        }
        else {
            // Update the user
            const history = existingUser.history || []

            // Don't push same object again and again repeatedly
            // If the last object has same storyUrl, then skip db update
            if(history.length > 0 && history[history.length-1].storyUrl === refinedObj.storyUrl) {
                //skip
            }
            else {
                history.push(refinedObj)
                const limit = 50    // Store only last 50 histories
                if(history.length > limit) {
                    history = history.slice(history.length-limit)
                }
                await usersCollection.updateOne({ email }, { $set: { history } })
            }
            
            return {
                history,
                status: 200,
                msg: 'History successfully updated'
            }
        }
    }
    catch (err) {
        return err
    }
}


/**
 * Update the preferences of an user
 * @param {*} email 
 * @param {*} prefObj | The preference object See below the type definition as declared in FE
 *  
 *  defaultSave: E_SAVE_TYPES,
    favAuthor: string
    favTales: TTalesRef[]
    readFontSize: number
 */
async function updateMyPrefs (email, partialPrefs) {
    // To get rid off unnecessary data
    const validKeys = [
        'defaultSave', 'favAuthor', 'favTales', 'readFontSize'
    ]
    partialPrefs = refineObject(partialPrefs, validKeys)

    try {
        const usersCollection = getDB().collection(CONFIG.usersCollection)
        const existingUser = await usersCollection.findOne({ email })
        let prefs = existingUser.prefs || {}
        prefs = { ...prefs, ...partialPrefs }   // update only the newer prefs
        await usersCollection.updateOne({ email }, { $set: { prefs } })
            
        return {
            prefs,
            status: 200,
            msg: 'Preferences successfully updated'
        }
    }
    catch (err) {
        return err
    }
}

/**
 * Path where story banner images resides, uploaded by user
 */
function getStoryImgUploadDir () {
    return path.join(__dirname, '..', 'user-uploads', 'banners')
}