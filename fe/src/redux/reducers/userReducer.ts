import { TUser, TUserPrefs } from '../../types'
import { E_SAVE_TYPES } from '../../types/enums'
import {
    USER_UPDATE,
    USER_PREFS_UPDATE,
    USER_RESET
} from '../actionTypes'

const initState: TUser = {
    firstname: '',
    lastname: '',
    username: '',
    pswd: '',
    aboutme: '',
    email: '',
    imgUrl: '',
    gender: '',
    dob: '',
    lang1: '',
    lang2: '',
    lang3: '',
    country: '',
    facebookID: '',
    twitterID: '',
    history: [],
    prefs: { 
        defaultSave: E_SAVE_TYPES.EXPORT
    }
}

const userReducer = (state=initState, action: any) => {
    switch (action.type) {

        case USER_UPDATE:
            const { user } = action.payload
            return { ...state, ...user }

        case USER_PREFS_UPDATE:
            const partialPrefs = action.payload as TUserPrefs
            return {
                ...state,
                prefs: {
                    ...state.prefs,
                    ...partialPrefs
                }
            }

        case USER_RESET: 
            return {...initState}

        default:
            return state
    }
}

export default userReducer