import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'
import AddBoxIcon from '@material-ui/icons/AddBox'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { red } from '@material-ui/core/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faMagic, faMousePointer, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(theme => ({
    panel: {
        width: 40,
        backgroundImage: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        position: 'absolute',
        left: 0,
        top: 50,
        height: "calc(100vh - 60px)",
        overflow: "auto"
    },
    btnPane: {
        color: '#fff',
        padding: `${theme.spacing(2)}px 0`,
        '& li': {
            height: 44,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        '& li+li': {
            borderTop: '1px solid #fff'
        },
        '& li:active': {
            backgroundColor: red.A400
        },
        '& li svg': {
            fontSize: 27
        }
    },
    fa: {
        fontSize: '22px !important'
    },
    autoMagic: {
        transform: 'rotate(-90deg)'
    },
    toggleJStick: {
        // transform: 'rotate(45deg)',
        // fontSize: '26px !important' 
    }
}))

const ControlPanel = props => {
    const classes = useStyles()
    const { history, deleteComponent, paintFlowboard, toggleJStick, openFSE, 
        openCreateComponent } = props
    // const backToEdit = () => history.push('/edit-tale/current')
    const goTo = url => history.push(url)

    return (
        <Box className={classes.panel}>
            <ul className={classes.btnPane}>
                <li title="Back to Editor" onClick={() => goTo('/edit-tale/current')}><ArrowBackIcon /></li>
                <li title="Add component" onClick={openCreateComponent}><AddBoxIcon /></li>
                {/* <li title="Select component"><FontAwesomeIcon icon={faMousePointer} className={classes.fa} /></li> */}
                <li title="Edit component" onClick={openFSE}><FontAwesomeIcon icon={faPencilAlt} className={classes.fa} /></li>
                <li title="View component" onClick={e => openFSE(e, "PREVIEW")}><FontAwesomeIcon icon={faEye} className={classes.fa} /></li>
                {/* <li title="Save all"><SaveIcon /></li> */}
                <li title="Toggle joystick" onClick={toggleJStick}><OpenWithIcon className={classes.toggleJStick} /></li>
               
                <li title="Auto format" onClick={paintFlowboard}><FontAwesomeIcon icon={faMagic} className={clsx(classes.fa, classes.autoMagic)} /></li>
                <li title="Increase draw area"><ZoomOutMapIcon /></li>
                <li title="Delete selected" onClick={deleteComponent}><DeleteIcon /></li>
            </ul>
        </Box>
    )
}

export default ControlPanel