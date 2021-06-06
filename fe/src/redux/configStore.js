import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/rootReducer'
// import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
    key: 'rtlroot',
    // storage
    storage: storageSession,
    // whitelist: ['wipTale'] // only navigation will be persisted
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, composeWithDevTools(
    applyMiddleware(thunk)
))

let persistor = persistStore(store)

export { store, persistor }