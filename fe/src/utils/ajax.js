import axios from 'axios'
import { getLoggedInToken } from '../services/session.service'
import { CONST_SESSION_USER } from './constants'
const Cookies = window.Cookies || {}

let tok = window.localStorage.getItem('rtltok')

export const ajaxPost = (url, jsonData) => {
    return axios.post(url, jsonData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getLoggedInToken()
        }
    })
}

export const ajaxGet = (url, params) => {
    return axios.get(url, {
        params,
        headers: {
            'Authorization': 'Bearer ' + getLoggedInToken()
        }
    })
}

/**
 * 
 * @param {String} url | the url without path params
 * @param {String} paramsArr | array of path-params in exact sequence in which they should appear in path
 */
export const ajaxGetWPathParams = (url, paramsArr) => {
    paramsArr.forEach(p => url += '/' + p);
    return ajaxGet(url)
}