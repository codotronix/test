const { decrypt } = require('../utils/crypter')
// const User = require('../models/user')
const MSG = require('../constants/msg')
const { getDB } = require('../services/mongo')
const CONFIG = require('../../config')
const { searchTales } = require('../services/dbService')
const { defaultImg } = require('../constants/globals')

const searchPageController = async (req, res, next) => {
    let groups = {}
    let queryForUI = {}
    let talesCount = 0
    // console.log(req.query)
    try {
        // const { searchfield, searchvalue } = req.query
        // if(!searchfield || !searchvalue) throw 'Intentional throw ...'

        const r = await searchTales(req.query)

        // console.log("r = ", r)

        // Let's group tales by genre
        groups = r.tales.reduce((acc, t) => {
            t.info.imgUrl = t.info.imgUrl ? `/ups/banners/${t.info.imgUrl}` : defaultImg
            acc[t.info.genre] = acc[t.info.genre] || []
            acc[t.info.genre].push(t)
            return acc
        }, {})
        queryForUI = r.queryForUI
        talesCount = r.tales.length
    }
    catch (err) {
        console.log(err)
    }
    finally {
        res.render('templates/search', { groups, queryForUI, talesCount })
    }
}

module.exports = searchPageController