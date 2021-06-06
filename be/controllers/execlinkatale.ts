/**
 * This passes thru authGuard, so email should be available in req.email
 */

import { TNotifLinkATaleRequest, E_NOTIF_TYPE, E_NOTIF_NAME } from '../types/TNotification'
import { TReactale, TStorylet, TChoice } from '../types/TReactale'
const { getNotifById, getStoriesBy, updateStory, deleteNotification } = require('../services/firestore.service')

// const crypter = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
// const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')

// import { getDB } from '../services/mongo'
// import MSG from '../constants/msg'
// import { ObjectID } from 'mongodb'


/**
 * The posted 'linkObj' should contain
 *  fromStoryUrl: string,
    fromStID: string,
    toUrl: string,
    choiceTxt: string
    authorEmailEnc: string // Encrypted Author Email
 *   
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

type TPostData = {
    id: string,
    execCode: "APPROVE" | "DENY" | "DELETE"
}

const execLinkATaleController = async (req: any  , res: any, next: Function) => {

    const { id, execCode } = req.body as TPostData
    const validExecCodes = ["APPROVE", "DENY", "DELETE"]

    if(!id || !execCode || !validExecCodes.includes(execCode)) {
        res.json(MSG.GENERIC_PARAMSMISSING)
        return
    }

    try {
        // const db = getDB()
        // const notifCollection = db.collection(CONFIG.notifCollection)

        // @ts-ignore
        // const objectID: any = new ObjectID.createFromHexString(id)
        
        // 1st get the notification from the db using the supplied ID
        // const notif = await notifCollection.findOne({ _id: objectID }) as TNotifLinkATaleRequest
        const notif = await getNotifById(id) as TNotifLinkATaleRequest
        
        if(!notif) {
            res.json(MSG.NOTIF_NOTIFNOTFOUND)
            return
        }

        // Now check if the auth user has permission to act on this Link-a-Tale request
        if(!notif.forEmails.includes(req.email)) {
            res.json(MSG.NOTIF_NOPERMISSION)
            return
        }

        if(execCode === "APPROVE") {
        
            // if it is an approve, 
            // Let's code

            // 1st get the reactale from DB
            // const talesCollection = db.collection(CONFIG.talesCollection)
            // let srcTale = await talesCollection.findOne({ "info.storyUrl": notif.fromStoryUrl }) as TReactale
            let srcTale = null
            let temp = await getStoriesBy({"info.storyUrl": notif.fromStoryUrl}, { full: true })
            if(temp && Array.isArray(temp) && temp.length > 0) srcTale = temp[0]

            if(!srcTale) throw 'Unable to find source tale for Link-A-Tale id = ' + id

            // Let's create a Storylet
            // with a ((r.fn.goto)) reacto in it
            let idCounter = srcTale.idCounter

            let newST: TStorylet = {
                id: "ST" + (++idCounter).toString().padStart(3, '0'),
                title: "link: " + notif.choiceTxt,
                text: `((r.fn.goto ,, ${notif.toUrl}))`,
                choices: []
            }

            let newChoice: TChoice = {
                id: "C" + (++idCounter).toString().padStart(3, '0'),
                text: notif.choiceTxt,
                next: newST.id
            }

            // Let's let's add this choice to the sourceST
            srcTale.storylets[notif.fromStID].choices.push(newChoice.id)

            // Let's update other fields also
            srcTale.storylets[newST.id] = newST
            srcTale.choices[newChoice.id] = newChoice
            srcTale.idCounter = idCounter

            // Finaly update the tale back to db
            // await talesCollection.updateOne(
            //     { "info.storyUrl": srcTale.info.storyUrl },
            //     { $set: srcTale }
            // )
            await updateStory(srcTale._fireID, srcTale)
        }

        // In any case
        // Finally Delete the Notification
        // await notifCollection.deleteOne({ _id: objectID })
        await deleteNotification(id)

        res.json( {
            ...MSG.GENERIC_SUCCESS,
            id
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = execLinkATaleController