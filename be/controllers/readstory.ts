// const { getDB } = require('../services/mongo')
// const CONFIG = require('../../config')
const { getStoriesBy, getUserByEmail } = require('../services/firestore.service')
const { getBannerImgRoot } = require('../constants/globals')

// const { encrypt } = require('../utils/crypter')

// import { getDB } from '../services/mongo'
import { encrypt } from '../utils/crypter'
import { TReactale } from '../types/TReactale'
import { TUser } from '../types/TUser'

const readStoryController = async (req: any, res: any, next: Function) => {
    try {
        const storyUrl: string = req.params.storyUrl

        if(!storyUrl) throw 'Sorry, we could not find this tale ... :('

        // const db = getDB()
        // const tale = await db.collection(CONFIG.talesCollection).findOne({"info.storyUrl": storyUrl}) as TReactale

        let tale = null
        let temp = await getStoriesBy({'info.storyUrl': storyUrl}, { full: true }) as TReactale[]
        if(temp && Array.isArray(temp) && temp.length > 0) tale = temp[0]

        if(!tale) throw 'Sorry, we could not find this tale ... :('

        // console.log(tale.isPublished)
        // TODO: COMMENT IN AFTER /publish API IS DONE
        if(!tale.isPublished) {
            throw 'Sorry, this tale is in unpublished state. If you know the author, please request him / her to publish it and then you can see it :)'
        }

        // Get the userId
        // So that clicking on the author's name can redirect to profile
        // let author = await db.collection(CONFIG.usersCollection).findOne({ email: tale.info.authorEmail }) as TUser
        let author = await getUserByEmail(tale.info.authorEmail) as TUser
        author.username = author.username ? ('@'+ author.username) : encodeURIComponent(encrypt(author.email))

        tale.info.imgUrl = tale.info.imgUrl ? `${getBannerImgRoot()}/${tale.info.imgUrl}` : '/assets/img/bg/small/storytelling-4203628_640.jpg'

        // For WhatsApp Square 300 Image
        const EXT = '.webp'
        const EXT300 = '.300x.webp'
        tale.info.imgUrlSquare = tale.info.imgUrl.substr(0, tale.info.imgUrl.length - EXT.length) + EXT300

        // Hide the authorEmail for privacy
        tale.info.authorEmailEnc = encrypt(tale.info.authorEmail)
        tale.info.authorEmail = ''

        // res.send(`<h1>${storyUrl}</h1>`)
        res.render('templates/tale', { tale, author })
    }
    catch(err) {
        if (typeof(err) === 'string') res.send(`
            <div>
                <h1>${err}</h1>
                <a href="https://reactale.com/gallery">Go Home</a>
            </div>
        `)
        else res.send('Sorry, we coud not find this tale')
    }
}

module.exports = readStoryController