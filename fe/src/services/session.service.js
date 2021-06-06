import { CONST_SESSION_USER } from '../utils/constants'
import { getRoot } from '../utils/urls'
const Cookies = window.Cookies

// Constants
const RTL_USER_TOKEN_COOKIE = "rtl_user_tok"
const RTLSESSION = 'RTLSESSION'

// The local variable to store the full of session object
let rtlsession = JSON.parse(window.sessionStorage.getItem(RTLSESSION) || '{}')

// Internal Function to SaveAll
const __save = () => window.sessionStorage.setItem(RTLSESSION, JSON.stringify(rtlsession))

export const getFromSession = key => rtlsession[key]

export const setToSession = (key, val) => { 
    rtlsession[key] = val
    __save()
}

export const delFromSession = key => {
    delete rtlsession[key]
    __save()
}

export const clearSession = () => {
    rtlsession = {}
    __save()
}

/**
 * When user logs in save the required data in both Cookies and Session Storage
 * 
 * Cookie
 * 1. In Cookie we will store only the user token,
 * 2. And, Cookie will be saved for both root domain and webapp domain
 * 3. This will be main source of truth for the logged in user
 * 
 * Session
 * 1. Whatever login related info we need to use subsequently will be stored here
 * 2. At any time, if there is a mismatch of token stored cookie and session, then 
 *      we need to call getLoggedInUser API again, and from backend need o check if really this cookie
 *      belongs to this IP
 */
export const saveLoggedInData = (user, tok) => {
    // Delete any prev cookie of same name
    // Save the info in cookie, for the NodeApp to access
    // For both root domain and webapp domain
    delLoggedInCookies()
    // Cookies.set(RTL_USER_TOKEN_COOKIE, tok)
    Cookies.set(RTL_USER_TOKEN_COOKIE, tok, { domain: '.' + getRoot() })    // leading dot => .reactale.com, avaiable for all subdomains

    // Now set it to the session
    setToSession(CONST_SESSION_USER, { user, tok })
}

export const delLoggedInCookies = () => {
    // Delete any prev cookie of same name
    // For both root domain and webapp domain
    // Cookies.remove(RTL_USER_TOKEN_COOKIE)
    Cookies.remove(RTL_USER_TOKEN_COOKIE, { domain: '.' + getRoot() })    // leading dot => .reactale.com, available in all sundomains
}


/**
 * Check if token in Cookie and Session are the same,
 * If yes, send it
 * Else, reset all saved data
 */
export const getLoggedInToken = () => {
    let tokenFromCookie = Cookies.get(RTL_USER_TOKEN_COOKIE)
    let tokenFromSession = (getFromSession(CONST_SESSION_USER) || {})['tok']

    // THE FOLLOWING STEPS WILL ALWAYS FAIL IN LOCAL, 
    // AS WE SPIN UP 3 DIFFERENT DOMAINS IN LOCALHOST
    // DOMAINS ARE ALWAYS DIFFERENT

    // If cookie exists and no discrepancy, we are good
    if (tokenFromCookie && tokenFromCookie === tokenFromSession) return tokenFromSession

    // Something's not right
    else {
        delLoggedInCookies()
        delFromSession(CONST_SESSION_USER)
    }
}

export const delAllLoggedInData = () => {
    delLoggedInCookies()
    clearSession()
}