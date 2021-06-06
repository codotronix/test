module.exports = {
//
// APIs
//
    GET_APP_VER: "/rtale/api/getappver",
    GET_LOGGEDIN_USER: "/rtale/api/v2/getloggedinuser",
    GET_STORY: "/rtale/api/v2/getstory/:storyUrl",
    GET_MYSTORY: "/rtale/api/v2/getmystory/:storyUrl",
    DELETE_MYTALE: "/rtale/api/v2/deletemytale",
    GET_MYSTORIES: "/rtale/api/v2/getmystories",
    CREATE_STORYURL: "/rtale/api/v2/uploadstorybanner",
    CREATE_TALE: "/rtale/api/v2/createstory",
    CREATE_STORYIMG: "/rtale/api/v2/createstory",
    LOGIN: "/rtale/api/v2/signin",
    SIGNUP: "/rtale/api/v2/signup",
    VERIFY_EMAIL: "/rtale/api/v2/verifyemail",
    LOGOUT: "/rtale/api/v2/signout",
    ALLTALES: "/rtale/api/v2/getallstories",
    PUB_UNPUB: "/rtale/api/v2/publish",
    RESEND_OTP: "/rtale/api/v2/resendotp",
    UPDATE_NEWPSWD: "/rtale/api/v2/updatenewpswd",
    UPDATE_USERNAME: "/rtale/api/v2/updateusername",
    UPDATE_MYPROFILE: "/rtale/api/v2/updatemyprofile",
    UPDATE_MYREADHISTORY: "/rtale/api/v2/updatemyreadhistory",
    UPDATE_MYPREFERENCES: "/rtale/api/v2/updatemypreferences",
    UPLOAD_BANNER: "/rtale/api/v2/uploadstorybanner",
    LINK_A_TALE: "/rtale/api/v2/requestlinkatale",
    EXEC_LINK_A_TALE: "/rtale/api/v2/execlinkatale",
  
//
// STAND ALONE PAGES
//
    READ_STORY: "/read/:storyUrl",
    VIEW_PROFILE: "/user/:userId",
    GALLERY: "/gallery",
    SEARCH: "/search",
    HOME: "/"
}