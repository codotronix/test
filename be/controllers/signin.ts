// const crypter = require('../utils/crypter')
// // const User = require('../models/user')
// const MSG = require('../constants/msg')
// const { getDB } = require('../services/mongo')

import { TUser } from '../types/TUser' 

const CONFIG = require('../../config')

import { hash, createToken } from '../utils/crypter'
import MSG from '../constants/msg'
import { getDB } from '../services/mongo'

const signinController = async (req: any, res: any, next: Function) => {
    let data: {email: string, pswd: string} = {...req.body}

    if(!data.email || !data.pswd) {
        res.json(MSG.SIGNIN_PARAMSMISSING)
        return
    }

    try {
        const db = getDB()
        // let user = await User.findOne({ email: data.email })
        let user = await db.collection(CONFIG.usersCollection).findOne({ email: data.email }) as TUser
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
        user.notifs = await db.collection(CONFIG.notifCollection).find({ forEmails: data.email }).toArray()

        // remove all emails
        user.notifs = user.notifs.map(notif => {
            notif.forEmails = []
            if('requestorEmail' in notif) notif.requestorEmail = ''
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