import { LOGIN, SIGNUP } from '../../utils/urls'
import { USER_UPDATE, USER_PREFS_UPDATE, UI_LOGIN_MODAL_CLOSE } from '../actionTypes'
import _ from 'lodash'
// import axios from 'axios'
import { ajaxPost } from '../../utils/ajax'
// import { saveVar } from '../../utils/varStore'
import { setToSession } from '../../services/session.service'
import { updateUserPrefs } from '../../services/user.service'
import { CONST_SESSION_USER } from '../../utils/constants'
import { TUser, TUserPrefs, TWindow } from '../../types'
import { Dispatch } from 'react'
const { notify, showLoader, hideLoader } = window as TWindow

export const actionLogin = (user: TUser) => {
    const { email, pswd } = user
    showLoader()
    return (dispatch: Dispatch<any>) => {
        ajaxPost(LOGIN, { email, pswd })
            .then(res => {
                const { status, user, tok, msg } = res.data
                if (status === 200) {
                    setToSession(CONST_SESSION_USER, { user, tok })

                    // update the user in redux store
                    dispatch({
                        type: USER_UPDATE,
                        payload: { user }
                    })

                    // Close the popup
                    dispatch({ type: UI_LOGIN_MODAL_CLOSE })

                    notify(msg)
                }
                else {
                    notify(msg)
                }
            })
            .catch(err => {
                console.log(err)
                notify('Sign in failed...')
            })
            .finally(() => hideLoader())
    }
}

export const actionSignup = (user: TUser) => {
    const { email, pswd, firstname, lastname } = user
    showLoader()
    return (dispatch: Dispatch<any>) => {
        ajaxPost(SIGNUP, { email, pswd, firstname, lastname })
            .then(res => {
                const { status, msg } = res.data
                notify(msg)
            })
            .catch(err => {
                console.log(err)
                notify('Sign up failed...')
            })
            .finally(() => hideLoader())
    }
}


export const actionUpdateUserPrefs = (partialPrefs: TUserPrefs) => {
    return (dispatch: Dispatch<any>, getState: Function) => {

        const email: string = getState().user.email

        // if loggedIn, then save in DB
        if(email) saveUserPref(email, partialPrefs)

        // update the redux store, otherwise FE won't reflect
        dispatch({
            type: USER_PREFS_UPDATE,
            payload: partialPrefs
        })
    }
}

/**
 * Save in DB, after debounce, incase someone keeps on checking/unchecking checkbox like a maniac :P
 */
const saveUserPref = _.debounce((email: string, prefs: TUserPrefs) => {
    updateUserPrefs(email, prefs)
}, 5000)