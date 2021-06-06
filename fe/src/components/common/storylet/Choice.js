import React from 'react'
import { makeStyles, TextField, Box } from '@material-ui/core'
import {connect} from 'react-redux'
import Checkbox from '@material-ui/core/Checkbox'
import {
    CHOICE_UPDATE_TEXT, 
    STORYBOARD_SELECT_CHOICE,
    STORYBOARD_INSERT_AT
} from '../../../redux/actionTypes'

const useStyles = makeStyles(theme => ({
    choiceBox: {
        position: "relative",
        margin: theme.spacing(1),
        flexGrow: 1
    },
    selectChoice: {
        position: "absolute",
        top: -theme.spacing(1),
        left: -theme.spacing(1)
    },
    choiceText: {
        width: "100%",
        '& > div': {
            paddingTop: 30
        }
    },
    idTag: {
        fontSize: 13,
        display: 'inline-block',
        backgroundColor: '#eee',
        padding: '1px 5px',
        borderRadius: 2,
        position: 'absolute',
        top: theme.spacing(.5),
        left: theme.spacing(3.5)
        // '& input': {
        //     fontSize: 14,
        //     backgroundColor: 'inherit',
        //     outline: 'none',
        //     border: 'none',
        //     width: 60
        // }
    },
    btnPanel: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 9,
        '& .ico': {
            boxSizing: 'content-box',
            padding: "5px 7px",
            color: theme.palette.primary.main,
            cursor: 'pointer',
            borderRadius: '50%',
            verticalAlign: "middle",
            fontSize: 16,
            display: 'inline-block'
        },
        '& .ico:active': {
            backgroundColor: '#eee'
        }
    }
}))

const updateChoiceText = (dispatch, cID, value) => {
    dispatch({
        type: CHOICE_UPDATE_TEXT,
        payload: {cID, value}
    })
}

const selectChoice = (dispatch, cID, isSelected, sbI, nextStID) => {
    cID = isSelected ? cID : '' // blank if Deselcetd

    // Select The Choice
    dispatch({
        type: STORYBOARD_SELECT_CHOICE,
        payload: {sbI, cID}
    })

    // Update the storyboard
    // Rollback upto this sbI (storyboard Index)
    // And Insert nextStID
    // Optionally pass isRemoveOnly for Deselection
    dispatch({
        type: STORYBOARD_INSERT_AT,
        payload: { sbI, nextStID, isRemoveOnly: !isSelected }
    })
}

const Choice = props => {
    const classes = useStyles()
    const { c, stID, sbI } = props
    if(!c) {
        console.log(' returning from Choice, as Choice is undefined... ')
        return <></>
    }
    return (
        <Box className={classes.choiceBox}>
            <div className={classes.idTag}>
                <span>ID: {c.id}</span>
            </div>
            <div className={classes.btnPanel}>
                {/* <FontAwesomeIcon icon={faTrashAlt} className="ico" /> */}
            </div>
            <TextField
                // label="Choice text"
                placeholder="Enter choice text here"
                multiline
                rows="3"
                variant="outlined"
                className={classes.choiceText}
                value={c.text}
                onChange={e => props.typingChoiceText(c.id, e.target.value)}
            />
            <Checkbox
                checked={props.isSelected}
                onChange={(e) => props.handleSelection(stID, c.id, e.target.checked, sbI, c.next)}
                value="primary"
                className={classes.selectChoice}
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
        </Box>
    )
}
const mapDispatchToProps = dispatch => ({
    typingChoiceText: (cID, value) => updateChoiceText(dispatch, cID, value),
    handleSelection: (stID, cID, isSelected, sbI, nextStID) => selectChoice(dispatch, cID, isSelected, sbI, nextStID)
})
export default connect(null, mapDispatchToProps)(Choice)