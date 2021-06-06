import { E_SAVE_TYPES } from './enums'
import { TNotif } from './TNotification'

export type TUser = {
    _id?: string
    email: string;
    username: string;
    pswd: string;
    firstname: string;
    lastname: string;
    imgUrl: string;
    gender: string;
    aboutme: string;
    country: string;
    dob: string;
    facebookID?: string,
    twitterID?: string,
    lang1: string;
    lang2: string;
    lang3: string;
    SIGNUP_EMAIL_VERIFICATION?: string;
    history: TUserReadHistory[];
    prefs: TUserPrefs
    notifs?: TNotif[]
}

type TTalesRef = {
    storyName: string,
    storyUrl: string,
}

type TUserReadHistory = TTalesRef & {
    timestamp: number
}

export type TUserPrefs = {
    defaultSave?: E_SAVE_TYPES,
    favAuthor?: string
    favTales?: TTalesRef[]
    readFontSize?: number
}


