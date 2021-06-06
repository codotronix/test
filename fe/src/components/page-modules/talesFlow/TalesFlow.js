import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { makeStyles, Box } from '@material-ui/core'
import _ from 'lodash'
import { connect } from 'react-redux'
import ControlPanel from './controlPanel/ControlPanel'
import JoyStick from './controlPanel/JoyStick'
import FlowST from './FlowST'
import FlowConnector from './FlowConnector'
import ModalEditChoice from './ModalEditChoice'
import ModalCreateComponent from './controlModals/ModalCreateComponent'
import FullScreenEdit from '../../common/modal/FullScreenEdit'
import { createFlowboard, getTransformStyle, createFlowConnectors } from './flowMaker'
import {
    actionCreateNewTale,
    actionCreateChoice,
    actionUpdateCText
} from '../../../redux/actionCreators/createTaleActions'
import {
    FLOW_WIRE_SHIFT_X,
    FLOW_WIRE_SHIFT_FROM_Y,
    FLOW_WIRE_SHIFT_TO_Y,
    FLOW_SPEED,
    CONST_TITLE
} from '../../../utils/constants'
import { STORYBOARD_INIT, STORYLET_DELETE, CHOICE_DELETE } from '../../../redux/actionTypes'
const { notify, hideLoader } = window

const MODAL_IDS = {
    CREATE_COMPONENT: "CREATE_COMPONENT"
}

const useStyles = makeStyles(theme => ({
    outerContainer: {
        position: 'relative',
        marginLeft: 35,
        paddingTop: 7,
        height: "calc(100vh - 100px)"
    },
    svgContainer: {
        border: `7px double ${theme.palette.primary.main}`,
        height: "100%",
        overflow: "auto",
        borderRadius: theme.spacing(1)
    },
    mainSVG: {
        height: 2000,
        minWidth: "100%",
        width: 2000,
        "-webkit-user-select": "none",  /* Chrome all / Safari all */
        "-moz-user-select": "none",     /* Firefox all */
        "-ms-user-select": "none",      /* IE 10+ */
        userSelect: "none",
        borderRadius: 15,
        "& *": {
            "-webkit-user-select": "none",  /* Chrome all / Safari all */
            "-moz-user-select": "none",     /* Firefox all */
            "-ms-user-select": "none",      /* IE 10+ */
            userSelect: "none"
        }
    },
    joystick: {
        position: "absolute",
        bottom: 83,
        left: 30
    }
}))

const TalesFlow = props => {
    const classes = useStyles()
    const { storylets, choices, start, history, createNewTale, initStoryboard,
        deleteStorylet, deleteChoice, createNewChoice, updateChoiceText } = props
    const [fb, setFb] = useState({})    // fb is flowboard object
    const [fbC, setFbC] = useState({})  // fbC is flowboardConnectors object
    const [isJStickVis, setJStickVis] = useState(false)
    const [draggedStID, setDraggedStID] = useState('')
    const [prevMPos, setPrevMPos] = useState({ x: 0, y: 0 })
    const [selectedObj, setSelectedObj] = useState({id: '', type: ''})  // type will be "ST" or "CH" or "IN" or "OUT"
    const [editChoiceData, setEditChoiceData] = useState({})
    const [visibleModalID, setVisibleModalID] = useState('') // Only 1 modal visible at once
    const [fseParam, setFSEParam] = useState({})    // Full Screen Edit    
    const closeFSE = () => setFSEParam({})

    // Update the Page Title    
    useEffect(() => {
        document.title = 'TalesFlow | ' + CONST_TITLE
    }, [])

    // component is either a St or a Ch object
    const openFSE = (e, activeMode = "EDIT") => {
        //console.log(component)
        let component

        if (!selectedObj.id || selectedObj.type==='IN' || selectedObj.type==='OUT') {
            notify('Select a storylet or choice (connector) to ' + activeMode.toLowerCase())
            return
        }
        else if(selectedObj.id[0] === 'S') component = storylets[selectedObj.id]
        else if(selectedObj.id[0] === 'C') component = choices[selectedObj.id]

        setFSEParam({
            component, activeMode, isVisible: true
        })
    }
    /**
     * flowBoard: {
     *      stID1: {
     *                  id: stID1,
     *                  x: value,
     *                  y: value,
     *                  transformStyle: someCSSTransformStyle
     *             },
     *      stID2: {
     *                  id: stID2,
     *                  x: value,
     *                  y: value,
     *                  transformStyle: someCSSTransformStyle
     *              }
     * }
     */
    const paintFlowboard = useCallback(() => {
        let flowBoard = createFlowboard(storylets, choices)
        let flowConnectors = createFlowConnectors(storylets, choices, flowBoard)
        // console.log("Inside paintFlowboard ............................. flowBoard = ", flowBoard)
        setFb(flowBoard)
        setFbC(flowConnectors)
        hideLoader()
    }, [storylets, choices])

    useEffect(() => {
        //if a refresh is done on TalesFlow Page
        // Then start creation process from here
        if(!start) {
            createNewTale()
        }

        paintFlowboard ()

        // IMPORTANT: BUG FIX
        // While leaving the TalesFlow and going back to the Flat Editor
        // Clear out the Storyboard, because in TalesFlow user might delete a component
        // That is still referenced in Storyboard, and that will cause an error
        return () => initStoryboard()
        
    }, [createNewTale, start, paintFlowboard, initStoryboard])

    /**
     * It marks selected the entity where user clicks, i.e. rectangle, connector, bud...
     * 
     * Sp. Case.
     * When 2 nodes (the buds on rectangles where coonector connects) 
     * are clicked consecutively, this function is called.
     * @param {*} id 
     * @param {*} type 
     */
    const handleSelection = (id, type) => {
        // Special Case:
        // if prev selectedObj was 'out'
        // and this is 'IN'
        // Then create a choice (connection)
        if (selectedObj.type === 'OUT' && type=== 'IN') {
            openEditChoiceModal(selectedObj.id, id)
        }

        // Common Case:
        // Now update the state i.e. mark this entity as selected
        setSelectedObj({id, type})
    }

    /**
     * This function opens a modal where user can create / edit 
     * the choice (connector) joining from `fromStID` to `toStID`
     * @param {String} fromStID | from-storylet-ID
     * @param {String} toStID | to-storylet-ID
     */
    const openEditChoiceModal = (fromStID, toStID) => {
        let ftid = fromStID + '---' + toStID
        setEditChoiceData({
            isOpen: true,
            fromStID,
            toStID,
            type: fbC[ftid] ? 'Edit' : 'Create',
            text: fbC[ftid] ? choices[fbC[ftid].cid].text : ''
        })
    }

    const saveEditCreateChoice = (fromStID, toStID, text, type) => {
        // is it create new
        if (type === 'Create') {
            createNewChoice(fromStID, toStID, text)
        }
        else if (type === 'Edit') {
            let ftid = fromStID + '---' + toStID
            let cID = fbC[ftid].cid
            updateChoiceText(cID, text)
        }
        else {
            console.log('Could not understand the type in saveEditCreateChoice')
        }

        setEditChoiceData({})
    }

    /**
     * Whenever an ST is dragged/moved, we need to update the associated connectors
     * @param {*} fbi => the updated flowboard item
     */
    const updateConnectors = fbi => {
        let newFBC = {...fbC}
        let wireShiftFTX = FLOW_WIRE_SHIFT_X
        let wireShiftFY = FLOW_WIRE_SHIFT_FROM_Y
        let wireShiftTY = FLOW_WIRE_SHIFT_TO_Y
        // Go thru all the flowboard-Connectors
        // to see with whom this stID is connected
        for(let i in newFBC) {
            let c = newFBC[i]
            let ftidParts = c.id.split('---')   // id is basically ftid
            let fromStID = ftidParts[0]
            let toStID = ftidParts[1]

            // if from id is this ST
            if (fbi.id === fromStID) {
                c = {...c}
                c.x1 = fbi.x + wireShiftFTX
                c.y1 = fbi.y + wireShiftFY

                newFBC = {
                    ...newFBC,
                    [c.id]: c
                }
            }
            // elseif to id is this ST
            else if (fbi.id === toStID) {
                c = {...c}
                c.x2 = fbi.x + wireShiftFTX
                c.y2 = fbi.y + wireShiftTY

                newFBC = {
                    ...newFBC,
                    [c.id]: c
                }
            }
        }

        setFbC(newFBC)
    }
    
    const markDraggedStID = (ev, stID) => {
        ev.stopPropagation()
        // console.log('setDraggedStID')
        setDraggedStID(stID)
        setPrevMPos({ x: ev.pageX,  y: ev.pageY })
    }

    const unmarkDraggedStID = ev => {
        ev.stopPropagation()
        // console.log('unsetDraggedStID')
        setDraggedStID('')
        setPrevMPos({ x: 0,  y: 0 })
    }

    const moveST = (stID, xDisplace, yDisplace) => {
        if (!stID || !fb[stID]) return   // Important, don't remove
        let prevElX = fb[stID].x
        let prevElY = fb[stID].y
        let newFBI = {
            id: stID,
            x: prevElX + xDisplace,
            y: prevElY + yDisplace
        }
        newFBI.transformStyle = getTransformStyle(newFBI)
        let newFB = {
            ...fb,
            [stID]: newFBI
        }
        setFb(newFB)

        //ALSO NEED TO UPDATE THE CONNECTORS POSITION
        updateConnectors(newFBI)
    }

    const moveDraggetST = _.throttle(ev => {
        //ev.stopPropagation()
        // console.log("moving 1")
        if (draggedStID) {
            // console.log("moving 2")
            let mouseDiffX = ev.pageX - prevMPos.x
            let mouseDiffY = ev.pageY - prevMPos.y
            moveST(draggedStID, mouseDiffX, mouseDiffY)
            setPrevMPos({ x: ev.pageX,  y: ev.pageY })
        }
    }, 1000)

    const moveWithJStick = (xDisplace, yDisplace) => {
        if (selectedObj.type === 'ST') {
            moveST(selectedObj.id, xDisplace, yDisplace)
        }
    }

    const moveLeft = () => moveWithJStick(-FLOW_SPEED, 0)
    const moveRight = () => moveWithJStick(FLOW_SPEED, 0)
    const moveUp = () => moveWithJStick(0, -FLOW_SPEED)
    const moveDown = () => moveWithJStick(0, FLOW_SPEED)

    const deleteComponent = () => {
        if (!selectedObj.id || selectedObj.type==='IN' || selectedObj.type==='OUT') {
            notify('Select a storylet or choice (connector) first. Then click on delete.')
        }
        else if(selectedObj.id === start) {
            notify('Start storylet can not be deleted. Please edit it to your choice.')
        }
        else {
            let comName = ''
            if(selectedObj.id[0] === 'S') comName = 'STORYLET'
            else if(selectedObj.id[0] === 'C') comName = 'CHOICE'

            let r = window.confirm(`Are you sure you want to delete ${comName} ${selectedObj.id}. Once deleted, it may not be recovered back.`)

            if (r) {
                if(comName === 'STORYLET') deleteStorylet(selectedObj.id)
                else if (comName === 'CHOICE') deleteChoice(selectedObj.id)
            }
        }
    }

    // If props have changed, but useEffect has not updated flowboard yet
    // stop the rendering
    if (
            Object.keys(storylets).length !== Object.keys(fb).length
            ||
            Object.keys(choices).length !== Object.keys(fbC).length
        ) {
        return (
            <Box>
                {/* {console.log('Stopping early rendering...')} */}
                Updating ...
            </Box>
        )
    }

    // Else return
    return (
        <Box>
            <ControlPanel 
                history={history} 
                deleteComponent={deleteComponent} 
                paintFlowboard={paintFlowboard}
                toggleJStick={() => setJStickVis(!isJStickVis)}
                openFSE={openFSE}
                openCreateComponent={() => setVisibleModalID(MODAL_IDS.CREATE_COMPONENT)}
            />

            <div className={classes.outerContainer}>
                <div className={classes.svgContainer} onClick={() => setSelectedObj({})}>
                    <svg 
                        className={classes.mainSVG} 
                        onMouseUp={e => unmarkDraggedStID(e)}
                    >
                        {
                            Object.values(fbC).map(c => 
                                <FlowConnector 
                                    c={c} key={c.id} 
                                    selectedObj={selectedObj}
                                    handleSelection={handleSelection}
                                />
                            )
                        }
                        
                        {
                            //console.log("props.storylets", storylets)
                            Object.values(fb).map(fbi => {
                                let st = storylets[fbi.id]
                                return (<FlowST 
                                            stid={st.id} 
                                            title={st.title} 
                                            transformStyle={fbi.transformStyle}
                                            start={start} 
                                            key={st.id}
                                            selectedObj={selectedObj}
                                            handleSelection={handleSelection}
                                            handleMouseDown={markDraggedStID}
                                            handleMouseUp={unmarkDraggedStID}
                                            handleMouseMove={moveDraggetST}
                                        />)
                            })
                        }
                    </svg>
                </div>

                <div className={clsx(classes.joystick, !isJStickVis && 'hide')}>
                    <JoyStick 
                        moveLeft={moveLeft}
                        moveRight={moveRight}
                        moveUp={moveUp}
                        moveDown={moveDown}
                    />
                </div>
            </div>
        
            <ModalEditChoice 
                isOpen={editChoiceData.isOpen} 
                {...editChoiceData}
                handleClose={()=>setEditChoiceData({})}
                handleSave={saveEditCreateChoice}
            />

            <FullScreenEdit 
                isOpen={fseParam.isVisible}
                activeMode={fseParam.activeMode}
                handleClose={closeFSE}
                component={fseParam.component}
            />

            <ModalCreateComponent 
                isOpen={visibleModalID === MODAL_IDS.CREATE_COMPONENT}
                handleClose={() => setVisibleModalID('')}
                storylets={storylets}
                openEditChoiceModal={openEditChoiceModal}
                createNewChoice={createNewChoice}
            />
        </Box>
    )
}

const mapStateToProps = state => ({
    start: state.wipTale.start,
    storylets: state.wipTale.storylets,
    choices: state.wipTale.choices
})
const mapDispatchToProps = dispatch => ({
    createNewTale: () => dispatch(actionCreateNewTale()),
    initStoryboard: () => dispatch({ type: STORYBOARD_INIT }),
    deleteStorylet: stID => dispatch({ type: STORYLET_DELETE, payload: stID }),
    deleteChoice: cID => dispatch({type: CHOICE_DELETE, payload: cID}),
    createNewChoice: (fromStID, toStID, text) => dispatch(actionCreateChoice(fromStID, toStID, text)),
    updateChoiceText: (cID, value) => dispatch(actionUpdateCText(cID, value))
})
export default connect(mapStateToProps, mapDispatchToProps)(TalesFlow)