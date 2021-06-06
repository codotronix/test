const { readAllStories } = require('../services/dbService')
const carouselItems = require('../constants/homecarousel')
const { defaultImg } = require('../constants/globals')

const galleryController = async (req, res, next) => {
    const r = await readAllStories()
    
    if(!r.status || r.status !== 200) {
        res.send('<h1>Oops, could not fetch the stories ...</h1>')
        return
    }

    // const { tales } = r

    // console.log(r.tales)

    // Let's group tales by genre
    let groups = r.tales.reduce((acc, t) => {
        t.info.imgUrl = t.info.imgUrl ? `/ups/banners/${t.info.imgUrl}` : defaultImg
        acc[t.info.genre] = acc[t.info.genre] || []
        acc[t.info.genre].push(t)
        return acc
    }, {})

    // res.json(groups)


    res.render('templates/gallery', { groups, carouselItems })
}

module.exports = galleryController