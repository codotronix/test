// console.log("process.env.REACT_APP_ENV = ", process.env.REACT_APP_ENV)
// console.log("process.env.REACT_APP_ENV.length = ", process.env.REACT_APP_ENV.length)

export const env = process.env.REACT_APP_ENV.trim()

const root = {
    "prod": "reactale.com",
    "dev": "reactale.site",
    "local": "localhost:9090"            // node-express backend
}
const webAppRoot = {
    "prod": "webapp.reactale.com",
    "dev": "webapp.reactale.site",
    "local": "webapp.localhost:9090"            // node-express backend
}

//ASSETS_ROOT=http://localhost:5000
const assetsRoot = {
    "prod": "webapp.reactale.com",
    "dev": "webapp.reactale.site",
    "local": "localhost:5000"            // a separate static "serve"
}

const ext = {
    "prod": "",
    "dev": "",
    "local": "",
    "c": ".json"            // needed incase of JSON stubbing
}

export const config = {
    origin: 'reactale.github.io',
    appType: 'HYBRIDNODE',       // 'APP' or 'HYBRIDNODE' or 'WEB'

    defaultImg: '/r/assets/img/bg/small/storytelling-4203628_640.jpg'
}

export const getRoot = () => root[env]
export const getWebAppRoot = () => webAppRoot[env]
export const getAssetsRoot = () => assetsRoot[env]


// console.log('ext[env] = ', ext[env])
// console.log('typeof(ext[env]) = ', typeof(ext[env]) )

export const GET_APP_VER = `//${root[env]}/rtale/api/getappver${ext[env]}`
export const GET_LOGGEDIN_USER = `//${root[env]}/rtale/api/v2/getloggedinuser${ext[env]}`
export const GET_STORY = `//${root[env]}/rtale/api/v2/getstory${ext[env]}`
export const GET_MYSTORY = `//${root[env]}/rtale/api/v2/getmystory${ext[env]}`
export const DELETE_MYTALE = `//${root[env]}/rtale/api/v2/deletemytale${ext[env]}`
export const GET_MYSTORIES = `//${root[env]}/rtale/api/v2/getmystories${ext[env]}`
export const GET_MYNOTIFS = `//${root[env]}/rtale/api/v2/getmynotifs${ext[env]}`
export const CREATE_STORYURL = `//${root[env]}/rtale/api/v2/uploadstorybanner${ext[env]}`
export const CREATE_TALE = `//${root[env]}/rtale/api/v2/createstory${ext[env]}`
export const CREATE_STORYIMG = `//${root[env]}/rtale/api/v2/createstory${ext[env]}`
export const LOGIN = `//${root[env]}/rtale/api/v2/signin${ext[env]}`
export const SIGNUP = `//${root[env]}/rtale/api/v2/signup${ext[env]}`
export const VERIFY_EMAIL = `//${root[env]}/rtale/api/v2/verifyemail${ext[env]}`
export const LOGOUT = `//${root[env]}/rtale/api/v2/signout${ext[env]}`
export const ALLTALES = `//${root[env]}/rtale/api/v2/getallstories${ext[env]}`
export const PUB_UNPUB = `//${root[env]}/rtale/api/v2/publish${ext[env]}`
export const RESEND_OTP = `//${root[env]}/rtale/api/v2/resendotp${ext[env]}`
export const UPDATE_NEWPSWD = `//${root[env]}/rtale/api/v2/updatenewpswd${ext[env]}`
export const UPDATE_USERNAME = `//${root[env]}/rtale/api/v2/updateusername${ext[env]}`
export const UPDATE_MYPROFILE = `//${root[env]}/rtale/api/v2/updatemyprofile${ext[env]}`
export const UPDATE_MYPREFERENCES = `//${root[env]}/rtale/api/v2/updatemypreferences${ext[env]}`
export const UPLOAD_BANNER = `//${root[env]}/rtale/api/v2/uploadstorybanner${ext[env]}`
export const EXEC_LINK_A_TALE = `//${root[env]}/rtale/api/v2/execlinkatale${ext[env]}`