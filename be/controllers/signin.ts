// const crypter = require('../utils/crypter')
// // const User = require('../models/user')
const MSG = require('../constants/msg')
// const { getDB } = require('../services/mongo')
const { getUserByEmail, getNotifications } = require('../services/firestore.service')

import { TUser } from '../types/TUser' 
import { TNotif } from '../types/TNotification'

const CONFIG = require('../../config')

import { hash, createToken } from '../utils/crypter'
// import { getDB } from '../services/mongo'

const signinController = async (req: any, res: any, next: Function) => {
    let data: {email: string, pswd: string} = {...req.body}

    if(!data.email || !data.pswd) {
        res.json(MSG.SIGNIN_PARAMSMISSING)
        return
    }

    try {
        // const db = getDB()
        // let user = await User.findOne({ email: data.email })
        // let user = await db.collection(CONFIG.usersCollection).findOne({ email: data.email }) as TUser
        let user = await getUserByEmail(data.email) as TUser
        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST)
            return
        }

        if(hash(data.pswd) !== user.pswd) {
            res.json(MSG.SIGNIN_IDPSWDMISMATCH)
            return
        }

        // Get all the notifications related to this user
        //
        // user.notifs = await db.collection(CONFIG.notifCollection).find({ forEmails: data.email }).toArray()
        user.notifs = await getNotifications('forEmails', data.email) as TNotif[]

        // secure/handle all sensitive fields, e.g. emails
        user.notifs = user.notifs.map(notif => {
            notif.forEmails = []
            // If requestor is NOT this user himself, then only delete it.
            // It will help in FE to show/hide action buttons conditionally
            if('requestorEmail' in notif && notif.requestorEmail !== data.email) { notif.requestorEmail = '' }
            return notif
        })

        // remove sensitive fields
        user.pswd = user._id = ''
        
        res.json({
            status: 200,
            msg: 'Sign in successful ...',
            user,
            tok: createToken({ email: user.email })
        })
    }
    catch (err) {
        console.log(err)
        res.json(MSG.GENERIC_FAILURE)
    }
}

module.exports = signinController