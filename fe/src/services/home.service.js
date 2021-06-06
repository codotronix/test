import { ALLTALES } from '../utils/urls'
import { ajaxGet } from '../utils/ajax'
const notify = window.notify;

let talesForHome = []

export const getTalesForHome = async () => {
    if (talesForHome.length > 0) return talesForHome

    try {
        const res = await ajaxGet(ALLTALES)
        const { status, tales, msg } = res.data
        if(status === 200) {
            talesForHome = tales
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