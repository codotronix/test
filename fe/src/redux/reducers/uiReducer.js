import {
    UI_SIDEBAR_OPEN, 
    UI_SIDEBAR_CLOSE,
    UI_LOGIN_MODAL_OPEN,
    UI_LOGIN_MODAL_CLOSE,
    UI_LOGIN_SET_ACT_TAB,
    UI_REACTO_MODAL_OPEN,
    UI_REACTO_MODAL_CLOSE
} from '../actionTypes'

const initState = {
    isSidebarOpen: false,
    isLoginModalOpen: false,
    loginActiveTab: 0,
    isReactoModalOpen: false,
    notifications: {}
}

const uiReducer = (state=initState, action) => {
    switch (action.type) {

        case UI_SIDEBAR_OPEN:
            return { ...state, isSidebarOpen: true }
        
        case UI_SIDEBAR_CLOSE:
            return { ...state, isSidebarOpen: false }
        
        case UI_LOGIN_MODAL_OPEN:
            return { ...state, isLoginModalOpen: true }

        case UI_LOGIN_MODAL_CLOSE:
            return { ...state, isLoginModalOpen: false }

        case UI_REACTO_MODAL_OPEN:
            return { ...state, isReactoModalOpen: true }

        case UI_REACTO_MODAL_CLOSE:
            return { ...state, isReactoModalOpen: false }
        
        case UI_LOGIN_SET_ACT_TAB:
            const {tabIndex} = action.payload
            if (!isNaN(tabIndex) && tabIndex < 3 && tabIndex > -1) {
                return { ...state, loginActiveTab: tabIndex }
            }
            return state
        
        default:
            return state
    }
}

export default uiReducer