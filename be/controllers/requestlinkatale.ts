/**
 * This passes thru authGuard, so email should be available in req.email
 */

import { TNotifLinkATaleRequest, E_NOTIF_TYPE, E_NOTIF_NAME } from '../types/TNotification'
import { TUser } from '../types/TUser'
import { TPostParamLinkATale } from '../types/TAPIParams'

// const crypter = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
// const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { getUserByEmail, getNotifsBy, setNotification } = require('../services/firestore.service')

import { getDB } from '../services/mongo'
// import MSG from '../constants/msg'
import { decrypt } from '../utils/crypter'

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



const requestLinkATaleController = async (req: any  , res: any, next: Function) => {

    const { fromUrl, fromStoryName, fromStoryUrl, fromStID, toUrl, choiceTxt, authorEmailEnc } = req.body as TPostParamLinkATale

    if(!fromUrl || !fromStoryName || !fromStoryUrl || !fromStID || !toUrl || !choiceTxt || !authorEmailEnc) {
        res.json(MSG.SIGNIN_PARAMSMISSING)
        return
    }

    

    try {
        // const db = getDB()
        // First let's get the requestor's info
        // let user: TUser | null = await db.collection(CONFIG.usersCollection)
        //                             .findOne({ email: req.email })
        let user: TUser | null = await getUserByEmail(req.email)

        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST)
            return
        }

        const authorEmail = decrypt(authorEmailEnc)

        if (authorEmail === req.email) {
            res.json(MSG.NOTIF_LINKTOSELFNOTALLOWED)
            return
        }

        let newLinkReqObj: TNotifLinkATaleRequest = {
            fromUrl, fromStoryName, fromStoryUrl, fromStID, toUrl, choiceTxt, 
            requestorEmail: req.email,
            requestorID: user.username, 
            requestorName: user.firstname + ' ' + user.lastname,
            name: E_NOTIF_NAME.LINK_A_TALE_REQUEST,
            type: E_NOTIF_TYPE.ACTION,
            forEmails: [req.email, authorEmail],
            doC: Date.now()
        }

        // THERE CAN BE AT MAX 5 LinkReq from a user
        // SO, Check how many this user has already made
        const MAX_REQ_PER_USER = 5
        // let existingLinkReqs = await db.collection(CONFIG.notifCollection)
        //                             .find({ requestorEmail: req.email, 
        //                                     name: E_NOTIF_NAME.LINK_A_TALE_REQUEST 
        //                                 })
        //                             .toArray() as TNotifLinkATaleRequest[]
        let existingLinkReqs = await getNotifsBy({ 
                                                    requestorEmail: req.email, 
                                                    name: E_NOTIF_NAME.LINK_A_TALE_REQUEST 
                                                }) as TNotifLinkATaleRequest[]
    
        // IF LIMIT REACHED
        if(existingLinkReqs && existingLinkReqs.length > MAX_REQ_PER_USER) {
            return res.json(MSG.NOTIF_LINKATALELIMIT)
        }

        // IF DUPLICATE REQUEST
        if(existingLinkReqs && existingLinkReqs.length > 0) {
            if(existingLinkReqs.some(linkObj => 
                linkObj.fromStoryUrl === fromStoryUrl && 
                linkObj.fromStID === fromStID &&
                linkObj.choiceTxt === choiceTxt
            )) {
                return res.json(MSG.NOTIF_LINKATALEDUPLICATE)
            }
        }

        // await db.collection(CONFIG.notifCollection).insertOne(newLinkReqObj)
        await setNotification(newLinkReqObj)
        
        res.json({
            status: 200,
            msg: 'Request sent successfully ...'
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = requestLinkATaleController