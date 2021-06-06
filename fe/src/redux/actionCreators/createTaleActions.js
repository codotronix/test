import axios from 'axios'
import { ajaxPost } from '../../utils/ajax'
import {
    CREATE_TALE
} from '../../utils/urls'
import {
    TALE_CREATE,
    TALE_SET_AS_WIP,
    TALE_STATE_CLEANUP,
    STORYLET_UPDATE_ALL_TEXT,
    CHOICE_CREATE,
    CHOICE_UPDATE_TEXT
} from '../actionTypes'
const notify = window['notify']

export const actionCreateNewTale = () => {
    return (dispatch, getState) => {
        dispatch({type: TALE_CREATE})
    }
}

export const actionUpdateImgUrl = imgUrl => {
    window.showLoader()
    return (dispatch, getState) => {
        const { storyboard, ...tale } = getState().wipTale
        tale.info.imgUrl = imgUrl
        console.log("tale.info.imgUrl = ", tale.info.imgUrl)
        console.log("imgUrl = ", imgUrl)

        ajaxPost(CREATE_TALE, tale)
        .then(res => {
            console.log(res.data)
            let {status, tale, msg } = res.data
            if(status === 200) {
                notify("Image uploaded successfully")
                tale = JSON.parse(tale)
                dispatch({
                    type: TALE_SET_AS_WIP,
                    payload: tale
                })
            }
            else {
                notify(msg)
            }
        })
        .catch(err => notify('Some error occured. Please try again later ...'))
        .finally(() => window.hideLoader())
        dispatch({type: TALE_CREATE})
    }
}

export const actionSaveTaleAndReset = () => {
    return (dispatch, getState) => {
        //TODO: Dispatch a save command
        //Then, reset the wipTale state
        dispatch({type: TALE_STATE_CLEANUP})
    }
}

export const actionUpdateSTAllText = (stID, title, text) => {
    return dispatch => dispatch({
        type: STORYLET_UPDATE_ALL_TEXT,
        payload: { stID, title, text }
    })
}

export const actionCreateChoice = (fromStID, toStID, text) => {
    if(!fromStID) {
        throw (new Error("fromStID is mandatory while creating a new choice"))
    }
    return (dispatch, getState) => {
        dispatch({
            type: CHOICE_CREATE,
            payload: {fromStID, toStID, text}
        })
    }
}

export const actionUpdateCText = (cID, value) => {
    return (dispatch, getState) => {
        dispatch({
            type: CHOICE_UPDATE_TEXT,
            payload: {cID, value}
        })
    }
}

export const actionSetTaleAsWIP = tale => {
    return dispatch => {
        tale.idCounter = tale.idCounter || 100
        // console.log(tale)
        // SET THE WIP TALE
        dispatch({
            type: TALE_SET_AS_WIP,
            payload: tale
        })
    }
}
