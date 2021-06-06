
module.exports.getRandomString = (len=6) => {1
    const abc = 'abcdeABCDEfghijFGHIJklmnoKLMNOpqrstPQRSTuvwxyUVWXYzZ123456789'
    let r = ''
    for(let i=0; i<len; i++) {
        r += abc[Math.floor(Math.random() * abc.length)]
    }

    return r
}

/**
 * It refines an object by getting rid of all invalid keys
 * @param {*} obj | The Crude/Impure Object to be Refined
 * @param {*} validKeys | Keys to be kept
 */
module.exports.refineObject = (obj, validKeys) => {
    let refinedObj = {}
    for(let k of validKeys) {
        if(typeof(obj[k]) !== "undefined") {
            refinedObj[k] = obj[k]
        }
    }
    return refinedObj
}