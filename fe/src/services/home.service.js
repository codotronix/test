import { ALLTALES } from '../utils/urls'
import { ajaxGet } from '../utils/ajax'
const notify = window.notify;

let talesForHome = []

export const getTalesForHome = async () => {
    if (talesForHome.length > 0) return talesForHome

    try {
        const res = await ajaxGet(ALLTALES)
        const { status, tales, msg, bannerImgRoot } = res.data
        if(status === 200) {
            talesForHome = tales.map(tale => {
                if(tale.info.imgUrl) {
                    tale.info.imgUrl = bannerImgRoot + '/' + tale.info.imgUrl
                }
                return tale
            })
        }
        else {
            notify(msg)
        }
    }
    catch (err) { 
        // console.log(err) 
    }
    finally {
        return talesForHome
    }
    
}