// const crypto = require("crypto-js")
// const jwt = require('jsonwebtoken')
const CONFIG = require('../../config')
import crypto from 'crypto-js'
import jwt from 'jsonwebtoken'

export const encrypt = (txt:string) => crypto.AES.encrypt(txt, CONFIG.encSecret).toString()
export const decrypt = (txt:string) => crypto.AES.decrypt(txt, CONFIG.encSecret).toString(crypto.enc.Utf8)
export const hash = (txt:string) => crypto.SHA256(txt, CONFIG.encSecret).toString()
export const jwtSign = (jsonData: any) => jwt.sign(jsonData, CONFIG.jwtSecret, { expiresIn: '12h'})
export const createToken = (jsonData: any) => {
    let enc = encrypt(JSON.stringify(jsonData))
    return jwtSign({ enc })
}
export const decodeToken = (tok: string) => {
    try {
        let jwtDecoded: any = jwt.verify(tok, CONFIG.jwtSecret)
        if(jwtDecoded) {
            return JSON.parse(decrypt(jwtDecoded.enc))
        }
        else {
            return false
        }
    }
    catch(e) {
        return false
    }
    

}

// module.exports = {
//     encrypt, decrypt, hash, createToken, decodeToken
// }
