import { TUserPrefs } from '../types'
import { ajaxPost } from '../utils/ajax'
import { UPDATE_MYPREFERENCES } from '../utils/urls'

export const updateUserPrefs = async (email: string, partialPrefs: TUserPrefs) => 
    ajaxPost(UPDATE_MYPREFERENCES, { email, partialPrefs } )
