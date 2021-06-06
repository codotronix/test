/**
 * This is hold and manage the state of the current WIP Tale
 * id: StoryID
 * start: Start Storylet ID
 */
import { 
    TALE_CREATE, 
    TALE_SET_AS_WIP,
    TALE_UPDATE_INFO,
    TALE_STATE_CLEANUP,
    TALE_UPDATE_REACTO_VARS,
    // STORYLET_CREATE,
    STORYLET_DELETE,
    STORYLET_UPDATE_FIELD,
    STORYLET_UPDATE_ALL_TEXT,
    STORYBOARD_INIT,
    STORYBOARD_ADD_SINGLE,
    STORYBOARD_INSERT_AT,
    STORYBOARD_SELECT_CHOICE,
    CHOICE_CREATE,
    CHOICE_DELETE,
    CHOICE_UPDATE_TEXT,
    ADD_CID_TO_STID,
    TALE_PUBLISH,
    TALE_UNPUBLISH
} from '../actionTypes'

const START_ST_ID = 'ST000' // BY MY STRICTEST CONVENTION 

const getInitTaleState = () => ({
    id: null,
    isPublished: false,
    start: null,
    info: {
        name: '',
        description: '',
        genre: 'Other',
        lang: 'English',
        tags: '',
        authorEmail: '',
        originalAuthor: '',
        storyUrl: '',           // The PKey
        desiredUrl: '',         // For local modification only, until storyUrl is got from Server on 1st Online Save
        imgUrl: ''
    },
    idCounter: 0,
    storylets: {},
    choices: {},
    reactos: { vars: {} },   //to contain all customizable vars objects, each var object = {name:string, val:string, userCustomizable:boolean}
    storyboard: []  // sbI = { stID, selectedCID }  StoryBoardItems[],
})

const createStorylet = st => {
    st = st || {}
    return {
        id: st.id,
        title: st.title || '',
        text: st.text || '',
        choices: st.choices || [] // This will hold only Choice IDs
    }
}

const createChoice = c => {
    c = c || {}
    return {
        id: c.id,
        text: c.text || '',
        next: c.next || null
    }
}

const wipTaleReducer = (state=getInitTaleState(), action) => {
    switch (action.type) {

        /**
         * Create a new Tale, START Storylet ID will always be "st0"
         */
        case TALE_CREATE: {
            const storyID = 'R' + (new Date()).getTime() + Math.random().toString().replace('.','') // required for local-file-naming-collision-avoid etc
            const newST = createStorylet({id: START_ST_ID})
            let wipTale = {
                ...state,
                id: storyID,
                start: START_ST_ID,
                storylets: { 
                    [START_ST_ID]: newST
                },
                storyboard: [{stID: START_ST_ID}]
            }
            return wipTale
        }

        /**
         * To work on an existing Tale, we need to set it as WIP Tale
         */
        case TALE_SET_AS_WIP: {
            return {
                ...action.payload,
                storyboard: [{stID: START_ST_ID}]
            }
        }

        /**
         * Only initialize the storyboard
         */
        case STORYBOARD_INIT: {
            return {
                ...state,
                storyboard: [{stID: START_ST_ID}]
            }
        }

        /**
         * To update (add / edit / delete) reactos
         */
        case TALE_UPDATE_REACTO_VARS: {
            return {
                ...state,
                reactos: {
                    ...state.reactos,
                    vars: action.payload
                }
            }
        }

        /**
         * Update the "info" object of Tale, while typing in text fields 
         */
        case TALE_UPDATE_INFO: {
            return {
                ...state,
                info: action.payload
            }
        }

        /**
         * isPublished is a dynamic key, for now, so not present during init (i.e. 0 or false or Unpublished)
         * We are updating this state only for UI purpose
         */
        case TALE_PUBLISH: {
            return {
                ...state,
                isPublished: true
            }
        }

        /**
         * isPublished is a dynamic key, for now, so not present during init (i.e. 0 or false or Unpublished)
         * We are updating this state only for UI purpose
         */
        case TALE_UNPUBLISH: {
            return {
                ...state,
                isPublished: false
            }
        }

        /**
         * Before leaving the Tale creation / edit page, it's good
         * to reset the state
         */
        case TALE_STATE_CLEANUP: {
            return getInitTaleState()
        }

        /**
         * If already exists a storylet with STID, do nothing
         * Else create one
         * 
         * !IMPORTANT EDIT! -- !DELETING!
         * Deleting, because it is NEVER actually directly used on its own.
         * We always create a Choice/Connector from an existing storylet
         * And the NEW ONE is AUTOMATICALLY Created
         */
        // case STORYLET_CREATE: {
        //     const stID = action.payload.stID
        //     if (state.storylets[stID]) {
        //         return state
        //     }
        //     else {
        //         const newST = createStorylet({id: stID})
        //         return {
        //             ...state,
        //             idCounter: state.idCounter + 1,
        //             storylets: {
        //                 ...state.storylets, 
        //                 [stID]: newST
        //             }
        //         }
        //     }
        // }

        /**
         * Delete the storylet of given stID as payload
         * Delete all its choices
         * Loop thru all storylets and delete all choices pointing to this one
         * 
         * So basically, when we delete a storylet, we also delete all 
         * incoming and outgoing connectors (choice)
         * i.e. deleting 1 storylet and lots of choices
         */
        case STORYLET_DELETE: {
            let stID = action.payload
            let st = state.storylets[stID]
            let storylets = {...state.storylets}
            let choices = {...state.choices}
            // Delete all outgoing choices
            for(let cID of st.choices) {
                delete choices[cID]
            }

            // Now loop thru all the storylets, except this one
            // And delete choices which point to this storylet
            for(let id in storylets) {
                if (id === stID) continue
                storylets[id].choices = storylets[id].choices.filter(cID => {
                    let ch = choices[cID]
                    if(ch.next === stID) {
                        delete choices[cID]
                        return false
                    }
                    return true
                })
            }

            // Finally delete this ST
            delete storylets[stID]

            let newState = {
                ...state,
                storylets,
                choices
            }
            // console.log(newState)
            return newState
        }

        /**
         * Update the given storylet field of given STID as typed
         */
        case STORYLET_UPDATE_FIELD: {
            const {stID, fieldName, value} = action.payload
            const newST = {...state.storylets[stID]}
            newST[fieldName] = value
            return {
                ...state,
                storylets: {
                    ...state.storylets,
                    [stID]: newST
                }
            }
        }

        case STORYLET_UPDATE_ALL_TEXT: {
            const { stID, title, text } = action.payload
            const newST = {
                ...state.storylets[stID],
                title, text
            }
            return {
                ...state,
                storylets: {
                    ...state.storylets,
                    [stID]: newST
                }
            }
        }

        /**
         * ADD a single Storyboard Item to Storyboard array
         * Each Storyboard Item will be an object with STID, selectedCID (optional) etc
         */
        case STORYBOARD_ADD_SINGLE: {
            return {
                ...state,
                storyboard: [...state.storyboard, {stID: action.payload.stID}]
            }
        }

        /**
         * Add s SBI to a particular spot of SB
         * If isRemoveOnly=true, that means user has deselected a Choice checkbox 
         * but nothing is selected
         */
        case STORYBOARD_INSERT_AT: {
            const {sbI, nextStID, isRemoveOnly} = action.payload
            let newSB = [...state.storyboard]
            newSB = newSB.slice(0, sbI+1)
            if (!isRemoveOnly) {
                newSB.push({stID: nextStID})
            }            
            return {
                ...state,
                storyboard: newSB
            }
        }
        
        /**
         * Select a particular Choice of a Storylet, means for that particular
         * SBI we need to mark the CID as selected
         */
        case STORYBOARD_SELECT_CHOICE: {
            const {sbI, cID} = action.payload
            let newSB = [...state.storyboard]
            newSB[sbI] = {
                ...newSB[sbI],
                selectedCID: cID
            }
            return {
                ...state,
                storyboard: newSB
            }
        }

        /**
         * Create a new choice with the given data,
         * Parameters in action.payload contains
         * fromStID { mandatory }
         * toStID { optional }
         * text { optional }
         * 
         * !IMPORTANT! When we create a choice/connector from a storylet,
         * if toStorylet is not provided, it automatically creates a NEW ONE
         */
        case CHOICE_CREATE: {
            let {fromStID, toStID, text} = action.payload
            let fromST = {...state.storylets[fromStID]}
            let idCounter = state.idCounter

            // if toStID was not provided, create it
            toStID = toStID || ('S' + (++idCounter).toString().padStart(3, '0'))

            // if toST does not exist create it
            let toST = state.storylets[toStID] ? {...state.storylets[toStID]} : createStorylet({id: toStID})

            // Now create the Choice
            let cID = 'C' + (++idCounter).toString().padStart(3, '0')
            text = text || ('Choice - ' + cID)
            const newChoice = createChoice({id: cID, next: toStID, text})
            fromST.choices = [...fromST.choices, cID]

            return {
                ...state,
                idCounter: idCounter,
                choices: {
                    ...state.choices,
                    [cID]: newChoice
                },
                storylets: {
                    ...state.storylets,
                    [toStID]: toST,
                    [fromStID]: fromST
                }
            }
        }

        /**
         * Update the given choice text as typed
         */
        case CHOICE_UPDATE_TEXT: {
            const {cID, value} = action.payload
            const newChoice = {...state.choices[cID]}
            newChoice.text = value
            return {
                ...state,
                choices: {
                    ...state.choices,
                    [cID]: newChoice
                }
            }
        }

        /**
         * CHOICE_DELETE => delete a choice of given ID
         */
        case CHOICE_DELETE: {
            const cID = action.payload
            let choices = {...state.choices}
            // Go thru all the storylets
            // And delete this cID from whoever has this choice
            // Note: each choice is unique, one to one connector
            // i.e. one choice belongs to 1 storylet only
            // and it points to only 1 storylet with its next
            let st;
            for(let id in state.storylets) {
                if(state.storylets[id].choices.indexOf(cID) > -1) {
                    st = {...state.storylets[id]}
                    break
                }
            }
            // remove this cID from its parent st
            st.choices = [...st.choices]
            st.choices.splice(st.choices.indexOf(cID), 1)

            // now delete this choice
            delete choices[cID]

            return {
                ...state,
                storylets: {
                    ...state.storylets,
                    [st.id]: st
                },
                choices
            }

        }
        
        /**
         * Add the given choice to the given Storylet's choices array
         */
        case ADD_CID_TO_STID: {
            const {stID, cID} = action.payload
            const newST = {...state.storylets[stID]}
            newST.choices = [...newST.choices, cID]
            return {
                ...state,
                storylets: {
                    ...state.storylets,
                    [stID]: newST
                }
            }
        }

        default: {
            return state
        }
    }
}

export default wipTaleReducer