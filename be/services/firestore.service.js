const Firestore = require('@google-cloud/firestore')
const path = require('path')

let db = null

const USERS_COLLECTION = `${process.env.ENV}_users`
const TALES_COLLECTION = `${process.env.ENV}_tales`
const NOTIFS_COLLECTION = `${process.env.ENV}_notifs`

// If a query string comes as array
// and depending on the field, the operator must be different
const ARRAY_QUERY_HELPERS = {
    'info.name': 'in',
    'info.genre': 'in',
    'info.lang': 'in',
    'info.authorDisplayName': 'in',
    'info.tags': 'array-contains-any'
}
const NOTIF_QUERY_HELPER = {
    'forEmails': 'array-contains-any'
}

module.exports = {
    initFirestore,
    getUserByEmail,
    getUserByUsername,
    setUser,
    updateUser,
    readAllStories,
    getStoriesBy,
    setNewStory,
    updateStory,
    deleteStory,
    getNotifById,
    getNotifications,
    getNotifsBy,
    setNotification,
    deleteNotification
}

async function initFirestore (projectId, keyFilename) {
    db = new Firestore({
        projectId,
        keyFilename
    })
}

async function getUserByEmail (email) {
    const doc = await db.collection(USERS_COLLECTION).doc(email).get()
    if(doc.exists) return doc.data()
    return null
}

async function getUserByUsername (username) {
    let users = []
    const querySnapshot = await db.collection(USERS_COLLECTION).where('username', '==', username).get()
    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        users.push(doc.data())
    });
    if (users.length > 0) return users[0]
    return null
}

async function setUser (user) {
    return await db.collection(USERS_COLLECTION).doc(user.email).set(user)
}

async function updateUser (email, partialUserObject) {
    return await db.collection(USERS_COLLECTION).doc(email).set(partialUserObject, { merge: true })
}


async function getStoriesBy (keyValueObj, config = {}) {
    let tales = []
    // const querySnapshot = await db.collection('rtl').where(key, '==', value).get()
    let query = db.collection(TALES_COLLECTION)

    // Build the query looping over all the where clause
    for(let key in keyValueObj) {
        if (Array.isArray(keyValueObj[key]) ) {
            query = query.where(key, ARRAY_QUERY_HELPERS[key], keyValueObj[key])
        }
        else {
            query = query.where(key, '==', keyValueObj[key])
        }
    }

    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log(query)

    const querySnapshot = await query.limit(1000).get()

    // console.log('************************************')
    // console.log(querySnapshot)

    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists) {
            const tale = config.full ? doc.data() : loadCutterForTale(doc.data())
            tales.push(tale) // We need only the info of the tale
        }
    })
    return tales
}

async function readAllStories (email) {
    let tales = []
    let query = db.collection(TALES_COLLECTION).where('isPublished', '==', true)
    if(email) query = query.where('info.authorEmail', '==', email)
    const querySnapshot = await query.limit(1000).get()
    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists) {
            const tale = loadCutterForTale(doc.data())
            tales.push(tale) // We need only the info of the tale
        } 
    })
    return {
        status: 200,
        tales
    }
}

async function setNewStory (tale) {
    const newTaleRef = db.collection(TALES_COLLECTION).doc()
    tale._fireID = newTaleRef.id
    return await newTaleRef.set(tale)
}

async function updateStory (fireID, tale) {
    return await db.collection(TALES_COLLECTION).doc(fireID).set(tale, { merge: true })
}

async function deleteStory (fireID) {
    return await db.collection(TALES_COLLECTION).doc(fireID).delete()
}

async function setNotification (notif) {
    const newRef = db.collection(NOTIFS_COLLECTION).doc()
    notif.id = newRef.id
    return await 
    newRef.set(notif)
}

async function getNotifById (id) {
    const doc = await db.collection(NOTIFS_COLLECTION).doc(id).get()
    if(doc.exists) return doc.data()
    return null
}

/**
 * 
 * @param {string} key 
 * @param {string or string[]} value 
 * @returns 
 */
async function getNotifications (key, value) {
    let notifs = []
    let query = db.collection(NOTIFS_COLLECTION)

    if (Array.isArray(value)) {
        const operator = NOTIF_QUERY_HELPER[key] || 'in'
        query = query.where(key, operator, value)
    }
    // search a single email in forEmails array
    else if (key === 'forEmails') {
        query = query.where(key, 'array-contains', value)
    }
    else {
        query = query.where(key, '==', value)
    }
    
    const querySnapshot = await query.get()
    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists) {
            notifs.push(doc.data()) 
        }
    })

    return notifs
}

async function getNotifsBy (keyValueObj) {
    let notifs = []
    let query = db.collection(NOTIFS_COLLECTION)
    for(let key in keyValueObj) {
        query = query.where(key, '==', keyValueObj[key])
    }
    const querySnapshot = await query.get()
    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists) {
            notifs.push(doc.data()) // We need only the info of the tale
        }
    })

    return notifs
}

async function deleteNotification (id) {
    return await db.collection(NOTIFS_COLLECTION).doc(id).delete()
}

// function getRandomString(len) {
//     const alph = 'abcdefghijklmnopqrstuvwxyz'
//     s = ''
//     for(let i=0; i<len; ++i) {
//         s += alph[ Math.floor( Math.random() * alph.length ) ]
//     }

//     return s
// }

/**
 * Deletes heavy loads to save bandwidth
 * @param {TReactale} tale 
 * @returns 
 */
function loadCutterForTale (tale) {
    const { storylets, choices, ...restOfTale } = tale
    return restOfTale
}