const express = require('express')
const router = express.Router()
const formidableMiddleware = require('express-formidable')

const ROUTES = require('./constants/routes')
const authGuard = require('./middlewares/authGuard')
const authorGuard = require('./middlewares/authorGuard')
const imposterGuard = require('./middlewares/imposterGuard')

const getLoggedInUserController = require('./controllers/getloggedinuser')
const getStoryController = require('./controllers/getstory')
const getMyStoryController = require('./controllers/getmystory')
const deleteMyTaleController = require('./controllers/deletemytale')
const getAllStories = require('./controllers/getallstories')
const getMyStoriesController = require('./controllers/getmystories')
const signupController = require('./controllers/signup')
const signinController = require('./controllers/signin')
const createTaleController = require('./controllers/createtale')
const publishTaleController = require('./controllers/publishtale')
const verifyEmailController = require('./controllers/verifyemail')
const resendOTPController = require('./controllers/resendotp')
const updatePswdController = require('./controllers/updatenewpswd')
const uploadBannerController = require('./controllers/uploadbanner')
const updateUsername = require('./controllers/updateusername')
const updateMyProfile = require('./controllers/updatemyprofile')
const updateMyReadHistory = require('./controllers/updatemyreadhistory')
const updateMyPrefences = require('./controllers/updatemypreferences')
const requestLinkATaleController = require('./controllers/requestlinkatale')
const execLinkATaleController = require('./controllers/execlinkatale')
const getMyNotifsController = require('./controllers/getmynotifs')

const homeController = require('./controllers/home')
const galleryController = require('./controllers/gallery')
const readStoryController = require('./controllers/readstory')
const viewProfileController = require('./controllers/viewprofile')
const searchPageController = require('./controllers/searchpage')

router.get(ROUTES.GET_LOGGEDIN_USER, authGuard, getLoggedInUserController)
router.get(ROUTES.GET_STORY, getStoryController)
router.get(ROUTES.GET_MYSTORY, authGuard, authorGuard, getMyStoryController)

router.get(ROUTES.GET_MYSTORIES, authGuard, getMyStoriesController)
router.get(ROUTES.ALLTALES, getAllStories)

router.post(ROUTES.SIGNUP, signupController)
router.post(ROUTES.VERIFY_EMAIL, verifyEmailController)
router.post(ROUTES.LOGIN, signinController)
router.post(ROUTES.UPDATE_NEWPSWD, updatePswdController)
router.post(ROUTES.UPDATE_USERNAME, authGuard, updateUsername)
router.post(ROUTES.UPDATE_MYPROFILE, authGuard, updateMyProfile)
router.post(ROUTES.DELETE_MYTALE, authGuard, authorGuard, deleteMyTaleController)
router.post(ROUTES.UPDATE_MYREADHISTORY, authGuard, updateMyReadHistory)
router.post(ROUTES.UPDATE_MYPREFERENCES, authGuard, updateMyPrefences)
router.post(ROUTES.RESEND_OTP, resendOTPController)
router.post(ROUTES.CREATE_TALE, authGuard, createTaleController)
router.post(ROUTES.PUB_UNPUB, authGuard, authorGuard, publishTaleController)
router.post(ROUTES.UPLOAD_BANNER, formidableMiddleware(), authGuard, authorGuard, uploadBannerController)
router.post(ROUTES.LINK_A_TALE, authGuard, requestLinkATaleController)
router.post(ROUTES.EXEC_LINK_A_TALE, authGuard, execLinkATaleController)
router.post(ROUTES.GET_MYNOTIFS, authGuard, imposterGuard, getMyNotifsController)


// SERVER SERVED PAGES
router.get(ROUTES.READ_STORY, readStoryController)
router.get(ROUTES.VIEW_PROFILE, viewProfileController)
router.get(ROUTES.GALLERY, galleryController)
router.get(ROUTES.SEARCH, searchPageController)


// ****************************************************
//             !!! ATTENTION !!!
// THIS MUST BE LAST    *****
// THIS MUST BE LAST    ********
// THIS MUST BE LAST    ************
// THIS MUST BE LAST    **********************
// ****************************************************
// REPEATING ON PURPOSE
// THIS CONTAINS THE "/" Route
// HENCE MUST BE THE LAST ONE HERE
// OTHERWISE NO OTHER ROUTE WILL WORK
// ****************************************************
router.get(ROUTES.HOME, homeController)
////////////////////////////////////////////////////////


module.exports = router