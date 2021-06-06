import { combineReducers } from 'redux'
import userReducer from './userReducer'
import uiReducer from './uiReducer'
import wipTaleReducer from './wipTaleReducer'
import odReducer from './odReducer'

const rootReducer = combineReducers({
    ui: uiReducer,
    user: userReducer,
    wipTale: wipTaleReducer,
    od: odReducer
})

export default rootReducer