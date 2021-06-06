import React from 'react'
import { TextField, Box, Fab, makeStyles } from '@material-ui/core'
import Choice from './Choice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import AddIcon from '@material-ui/icons/AddBox'
import ReactoIcon from '../../common/icons/ReactoIcon'
import { connect } from 'react-redux'
import { STORYLET_UPDATE_FIELD } from '../../../redux/actionTypes'
import { actionCreateChoice } from '../../../redux/actionCreators/createTaleActions'
import { orange } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    textField: {
        display: "flex",
        marginTop: theme.spacing(2)
    },
    box: {
        border: `5px double ${orange[500]}`,
        borderRadius: 4,
        position: "relative"
    },
    title: {
        border: `5px double ${orange[500]}`,
        position: "absolute",
        background: '#fff',
        padding: '0 5px',
        borderRadius: 4,
        top: -20,
        left: 8,
        fontSize: 14,
        userSelect: 'none',
        cursor: 'default'
    },
    joiner: {
        position: "absolute",
        height: theme.spacing(5),
        borderLeft: `5px double ${orange[500]}`,
        width: 1,
        left: "50%",
        top: -45
    },
    choiceContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    addChoiceBtn: {
        alignSelf: "center",
        height: 90,
        borderRadius: 6,
        margin: `0 ${theme.spacing(1)}px`,
        textAlign: "center",
        fontSize: 16,
        lineHeight: " 20px",
        '& span': {
            display: "block"
        },
        '& svg': {
            fontSize: 36
        }
    },
    idTag: {
        fontSize: 14,
        display: 'inline-block',
        backgroundColor: '#eee',
        padding: '2px 5px',
        borderRadius: 2,
        '& .ico': {

        }
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
        '& .ico': {
            boxSizing: 'content-box',
            padding: "15px 8px",
            color: theme.palette.primary.main,
            borderRadius: '50%',
            verticalAlign: "middle",
            fontSize: 18,
            display: 'inline-block',
            cursor: 'default',
            '&:hover': {
                transform: 'scale(1.2)'
            },
            '&:active': {
                transform: 'scale(.9)'
            }
        },
    }
}))

const Storylet = props => {
    const classes = useStyles()
    const { st, sbI, sbItem, createAChoice, choices, openFSE, openReactoModal } = props
    return (
        <div>
            {/* STORYLET BOX -- STARTS HERE */}
            <Box className={classes.box} px={1} pb={2} pt={2}>
                {(sbI !== 0) && <span className={classes.joiner}></span>}
                <span className={classes.title}>Storylet</span>
                <div className={classes.idTag}>
                    <span>ID: {st.id}</span>
                    {/* <input type="text" value={st.id} disabled /> */}
                </div>
                <div className={classes.btnPanel}>
                    {/* <FontAwesomeIcon icon={faTrashAlt} className="ico" /> */}
                    <ReactoIcon className="ico" onClick={openReactoModal} />
                    <FontAwesomeIcon 
                        icon={faEye} 
                        className="ico" 
                        title="Preview Storylet"
                        onClick={() => openFSE(st, 'PREVIEW')}
                    />
                    <FontAwesomeIcon
                        icon={faPencilAlt}
                        className="ico"
                        title="Full Screen Edit"
                        onClick={() => openFSE(st, 'EDIT')}
                    />
                </div>
                <form noValidate autoComplete="off">
                    <TextField
                        label="Storylet title"
                        variant="outlined"
                        className={classes.textField}
                        value={st.title}
                        onChange={e => props.typingStValue(st.id, "title", e.target.value)}
                    />
                    <TextField
                        label="Storylet body"
                        multiline
                        rows="6"
                        variant="outlined"
                        className={classes.textField}
                        value={st.text}
                        onChange={e => props.typingStValue(st.id, "text", e.target.value)}
                    />
                </form>
            </Box>
            {/* STORYLET BOX -- ENDS HERE */}

            {/* CHOICES BOX -- STARTS HERE */}
            <Box className={classes.box} pt={2} pb={2} my={5}>
                <span className={classes.joiner}></span>
                <span className={classes.title}>Choices</span>
                <div className={classes.choiceContainer}>
                    {
                        st.choices && st.choices.map(cID => (
                            <Choice
                                c={choices[cID]}
                                stID={st.id}
                                sbI={sbI}
                                isSelected={sbItem.selectedCID === cID}
                                key={cID}
                            />
                        ))
                    }
                    <Fab className={classes.addChoiceBtn} variant="extended" color="primary" onClick={() => createAChoice(props.st.id)}>
                        <AddIcon />
                        <span className="txt">Add Choice</span>
                    </Fab>
                </div>

            </Box>
            {/* CHOICES BOX -- ENDS HERE */}

        </div>
    )
}

const UpdateStField = (stID, fieldName, value, dispatch) => {
    dispatch({
        type: STORYLET_UPDATE_FIELD,
        payload: {
            stID, fieldName, value
        }
    })
}
const mapStateToProps = state => ({
    choices: state.wipTale.choices
})
const mapDispatchToProps = dispatch => ({
    typingStValue: (stID, fieldName, value) => UpdateStField(stID, fieldName, value, dispatch),
    createAChoice: stID => dispatch(actionCreateChoice(stID))
})
export default connect(mapStateToProps, mapDispatchToProps)(Storylet)