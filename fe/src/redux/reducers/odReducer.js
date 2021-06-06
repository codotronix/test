/**
 * odReducer => Online Data Reducer is nothing but a cache for saving data read from api
 */
import {
    ONLINE_DATA_SAVE_MY_TALES,
    ONLINE_DATA_CLEAR_TALES
}
from '../actionTypes'
const initState = {
    myTales: []
}

const odReducer = (state = initState, action) => {
    switch (action.type) {

        case ONLINE_DATA_SAVE_MY_TALES: {
            return {
                ...state,
                myTales: action.payload
            }
        }

        case ONLINE_DATA_CLEAR_TALES: {
            return { myTales: [] }
        }

        default:
            return state

    }
}

export default odReducer