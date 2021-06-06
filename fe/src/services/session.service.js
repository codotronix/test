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