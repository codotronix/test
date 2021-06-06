// LocalStorage Key
const OFFLINE_SAVE_KEY = "allReactales"

// to get all offline reactales as { id1: tale1, id2: tale2 ... }
export const getOfflineSavedTales = () => JSON.parse(window.localStorage.getItem(OFFLINE_SAVE_KEY)) || {}

// get only 1 tale
export const getOneOfflineSavedTales = taleId => getOfflineSavedTales()[taleId]

// to delete all offline saved tales
export const clearOfflineSavedTales = () => window.localStorage.setItem(OFFLINE_SAVE_KEY, "{}")

/**
 * to save a reactale offline (localStorage)
 * returns updated allReactales object
 * @param {*} tale | Reactale
 */
export const saveOneOfflineSavedTales = tale => {
    const allReactales = getOfflineSavedTales()
    allReactales[tale.id] = tale
    window.localStorage.setItem(OFFLINE_SAVE_KEY, JSON.stringify(allReactales))
    return allReactales
}

/**
 * Save the entire Reactale Object passed
 * *** DON'T USE FROM OUTSIDE
 * @param {*} allReactales 
 */
export const _saveAllOfflineSavedTales = allReactales => window.localStorage.setItem(OFFLINE_SAVE_KEY, JSON.stringify(allReactales))

/**
 * Delete one rectale from localstorage
 * Return the updated Object { id1: tale1, id2: tale2 ... }
 * @param {String} taleID | Offline Reactale Id
 */
export const deleteOneOfflineSavedTales = taleID => {
    let allReactales = getOfflineSavedTales()
    delete allReactales[taleID]
    _saveAllOfflineSavedTales(allReactales)
    return allReactales
}