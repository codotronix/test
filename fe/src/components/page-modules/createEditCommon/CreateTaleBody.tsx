import React, { Dispatch, useState } from 'react'
import { connect } from 'react-redux'
import { Box } from '@material-ui/core';
import Storylet from '../../common/storylet/Storylet'
import FullScreenEdit from '../../common/modal/FullScreenEdit'
import { UI_REACTO_MODAL_OPEN } from '../../../redux/actionTypes'
import { TStorylet, TChoice, TStoryBoardItem, TReactale } from '../../../types'
import { E_FSE_MODE } from '../../../types/enums'

type Props = {
    openReactoModal: () => void
    storylets: { [stID: string]: TStorylet }
    storyboard: TStoryBoardItem[]
}

type TFullScreenEditParams = {
    isVisible: boolean
    mode: E_FSE_MODE
    component: TStorylet | TChoice
}

const CreateTaleBody = (props: Props) => {
    const [fseParam, setFSEParam] = useState({} as TFullScreenEditParams)    // Full Screen Edit 
    const { openReactoModal, storylets, storyboard } = props
    const closeFSE = () => setFSEParam({} as TFullScreenEditParams)
    // component is either a St or a Ch object
    // mode can be "EDIT" / "PREVIEW"
    const openFSE = (component: TStorylet | TChoice, mode=E_FSE_MODE.EDIT) => {
        // console.log(component)
        setFSEParam({
            component, mode, isVisible: true
        })
    }

    // useEffect(() => {
    //     console.log('inside useEffect')
    //     console.log('new storylets = ', storylets)
    // }, [storylets])

    /**
     * Change from 'EDIT' to 'PREVIEW' or vice-versa
     * We will allow this feture only for Storylets
     * And NOT for Choices
     * @param {String} mode | 'EDIT' or 'PREVIEW'
     * @param {String} componentID | StoryletID
     */
    // const handleModeChange = (mode, stID) => {
    //     console.log('inside handleModeChange')
    //     // Get the updated component from the store
    //     console.log('storylets = ', storylets)
    //     const component = {...storylets[stID]}
    //     setFSEParam({
    //         component, mode, isVisible: true
    //     })
    // }

    return (
        <Box py={3}>
            {
                storyboard && storyboard.map( (sbItem, sbI) => {
                    let st = storylets[sbItem.stID]
                    return (
                        <Storylet 
                            st={st} 
                            key={sbItem.stID} 
                            sbI={sbI} 
                            sbItem={sbItem} 
                            openFSE={openFSE}
                            openReactoModal={openReactoModal}
                        />
                    )
                })
            }
            <FullScreenEdit 
                isOpen={fseParam.isVisible}
                activeMode={fseParam.mode}
                handleClose={closeFSE}
                component={fseParam.component}
                openReactoModal={openReactoModal}
                // onModeChange={handleModeChange}
            />
        </Box>
    )
}

const mapStateToProps = (state: {wipTale: TReactale}) => ({
    storyboard: state.wipTale.storyboard,
    storylets: state.wipTale.storylets
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    openReactoModal: () => dispatch({type: UI_REACTO_MODAL_OPEN})
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaleBody as any)