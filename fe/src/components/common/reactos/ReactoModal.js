import React, { useState } from 'react'
import { connect } from 'react-redux'
import { makeStyles, Box, Paper, Tab, Tabs } from '@material-ui/core'
import SimpleModal from '../modal/SimpleModal'
import { UI_REACTO_MODAL_CLOSE } from '../../../redux/actionTypes'
import TabViewReactos from './TabViewReactos'
import TabTryReactos from './TabTryReactos'
import TabCreateReactos from './TabCreateReactos'


const useStyles = makeStyles(theme => ({
    modal: {
        maxWidth: 600,
        width: 'calc(100vw - 20px)',
        marginTop: 100
    }
}))

const ReactoModal = props => {
    const classes = useStyles()
    const { isOpen, handleClose } = props
    const [visibleTabIndex, setVisibleTab] = useState(0)
    const [rTxt, setRTxt] = useState('')

    const tryOut = rtxt => {
        setRTxt(rtxt)
        setVisibleTab(1)
    }

    return (
        <SimpleModal
            title="Reactos"
            {...props}
            isOpen={isOpen} 
            handleClose = {handleClose}
            className={classes.modal}
            // preventAutoSize={true}
        >
            <Box>
                <Box px={2} mb={2}>
                    Check out the <a href="https://reacto.reactale.com/" target="_blank" rel="noopener noreferrer">reacto website</a>
                </Box>
                <Paper square>
                    <Tabs
                        value={visibleTabIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(e,i) => setVisibleTab(i)}
                        centered
                        aria-label="tabs to for View, try, create reactos"
                    >
                        <Tab label="View" />
                        <Tab label="Try" />
                        <Tab label="Customize" />
                    </Tabs>
                </Paper>

                {/* View Reactos */}
                <Box className={visibleTabIndex !== 0 ? 'hide' : ''}>
                    <TabViewReactos tryOut={tryOut} />
                </Box>

                {/* Try Reactos */}
                <Box className={visibleTabIndex !== 1 ? 'hide' : ''}>
                    <TabTryReactos rTxt={rTxt} />
                </Box>

                {/* Create Reactos */}
                <Box className={visibleTabIndex !== 2 ? 'hide' : ''}>
                    <TabCreateReactos />
                </Box>
            </Box>
        </SimpleModal>
    )
}

const mapStateToProps = state => ({
    isOpen: state.ui.isReactoModalOpen
})

const mapDispatchTorops = dispatch => ({
    handleClose: () => dispatch({ type: UI_REACTO_MODAL_CLOSE }),
})

export default connect(mapStateToProps, mapDispatchTorops)(ReactoModal)