import React, { useState, useEffect, createRef } from 'react'
import clsx from 'clsx'
import { makeStyles, Container, TextField, Box } from '@material-ui/core'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencilAlt, faBold, faItalic, 
    faUnderline, faStrikethrough, faAlignCenter } 
    from '@fortawesome/free-solid-svg-icons'
    
import FullScreenModal from './FullScreenModal'
import ReactoIcon from '../icons/ReactoIcon'
import {
    actionUpdateSTAllText, actionUpdateCText
} from '../../../redux/actionCreators/createTaleActions'
import { sanitize } from '../../../utils/util'
const notify = window['notify']

const useStyles = makeStyles(theme => ({
    xScroller: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5px'
    },
    formatterBtns: {
        paddingTop: 5,
        marginBottom: 5,
        color: theme.palette.primary.main,
        overflowX: 'auto',
        overflowY: 'hidden',
        '& .ico': {
            padding: '13px 5px',
            height: 47,
            width: 47,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            cursor: 'default',
            '&:hover': {
                transform: 'scale(1.2)'
            }
        },
        '& .ico.reacto': {
            padding: '13px 0',
        }
    },
    textField: {
        marginTop: 20,
        '& .MuiInputBase-multiline': {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        },
        '& textarea': {
            // fontFamily: 'Georgia, serif',
        }
    },
    editForm: {
        minHeight: '90vh',
        paddingTop: 5,
    },
    previewBody: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        textAlign: 'justify',
        borderTop: '1px solid #ddd',
        paddingTop: 15
    }
}))

const FullScreenEdit = props => {
    const classes = useStyles()
    const MODES = ['EDIT', 'PREVIEW']
    const { component, activeMode, handleClose, saveStValue, saveChValue, openReactoModal } = props

    const t = component && component.id[0] === 'S' ? 'Storylet' : 'Choice'  // t for type
    const theForm = createRef()

    const [currentActiveMode, setCurrentActiveMode] = useState(MODES[1])
    const [currentComp, setCurrentComp] = useState(null)

    // Once it will be set from outside
    // later it can also be changed from inside,
    // say toggling between Edit and Preview
    useEffect(() => {
        setCurrentActiveMode(activeMode)
    },
        [activeMode])

    // Save the component in state
    // It will required while toogling
    useEffect(() => {
        setCurrentComp(component)
    },
        [component])


    const save = () => {
        const compText = theForm.current.elements.compText.value
        if (t === 'Storylet') {
            const compTitle = theForm.current.elements.compTitle.value
            saveStValue(component.id, compTitle, compText)

            // also update the currentComp, as it is not directly tied to redux
            // required for toggling mode
            // Otherwise, Preview will not take up the latest Edits
            setCurrentComp({
                ...currentComp,
                title: compTitle,
                text: compText
            })
        }
        else if (t === 'Choice') {
            saveChValue(component.id, compText)
        }
    }

    const saveAndClose = () => {
        save()
        handleClose()
        setCurrentComp(null)
    }

    const getPreviewHTML = txt => {
        const __html = sanitize(window.rto.process(txt))
        return { __html }
    }

    /**
     * Change from 'EDIT' to 'PREVIEW' or vice-versa
     * This feature is ONLY AVAILABLE FOR STORYLETS
     * @param {String} mode | 'EDIT' or 'PREVIEW'
     */
    const changeModeTo = mode => {
        // Validate, mode must 1 of the MODES constants
        if (!MODES.includes(mode)) return

        // must save first if going from edit to preview
        // this will dispatch a save to redux store
        if (mode === 'PREVIEW') save()

        // Change mode
        setCurrentActiveMode(mode)
    }

    const formatText = type => {
        const el = document.getElementById('comptextareaid')
        const startIndex = el.selectionStart,
            endIndex = el.selectionEnd

        if (startIndex === endIndex) {
            return notify('Select some text first ...')
        }

        const currentText = el.value

        // Init with a default of BOLD
        let startTag = '<b>',
            closeTag = '</b>'

        if (type === 'ITALIC') {
            startTag = '<i>'
            closeTag = '</i>'
        }
        else if (type === 'STRIKETHRU') {
            startTag = '<s>'
            closeTag = '</s>'
        }
        else if (type === 'UNDERLINE') {
            startTag = '<u>'
            closeTag = '</u>'
        }
        else if (type === 'CENTER') {
            startTag = '<c>'
            closeTag = '</c>'
        }

        theForm.current.elements.compText.value =
            currentText.substring(0, startIndex)
            + startTag
            + currentText.substring(startIndex, endIndex)
            + closeTag
            + currentText.substring(endIndex)

        // Restore selection, 
        // incase user wants to do further formatting
        el.focus()
        el.selectionStart = startIndex
        el.selectionEnd = endIndex + startTag.length + closeTag.length
    }

    return (
        <FullScreenModal
            title={currentActiveMode + ' ' + t}
            {...props}
            btnText={currentActiveMode === 'EDIT' ? 'Update' : ''}
            btnClick={saveAndClose}
        >
            <Container maxWidth="md">

                {/* THE EDIT SECTION */}
                <Box className={clsx(currentActiveMode !== 'EDIT' && 'hide')}>
                    {/* Format buttons */}

                    <div className={classes.formatterBtns}>
                        <div className={classes.xScroller}>
                            <FontAwesomeIcon
                                icon={faBold}
                                className={clsx("ico", t !== 'Storylet' && 'hide')}
                                title="Bold"
                                onClick={() => formatText('BOLD')}
                            />
                            <FontAwesomeIcon
                                icon={faItalic}
                                className={clsx("ico", t !== 'Storylet' && 'hide')}
                                title="Italic"
                                onClick={() => formatText('ITALIC')}
                            />
                            <FontAwesomeIcon
                                icon={faUnderline}
                                className={clsx("ico", t !== 'Storylet' && 'hide')}
                                title="Underline"
                                onClick={() => formatText('UNDERLINE')}
                            />
                            <FontAwesomeIcon
                                icon={faStrikethrough}
                                className={clsx("ico", t !== 'Storylet' && 'hide')}
                                title="Strike Through"
                                onClick={() => formatText('STRIKETHRU')}
                            />
                            <FontAwesomeIcon
                                icon={faAlignCenter}
                                className={clsx("ico", t !== 'Storylet' && 'hide')}
                                title="Center"
                                onClick={() => formatText('CENTER')}
                            />
                            <ReactoIcon className="ico reacto" onClick={openReactoModal} />
                            <FontAwesomeIcon
                                icon={faEye}
                                className={clsx("ico", t !== 'Storylet' && 'hide')}
                                title="Preview Storylet"
                                onClick={() => changeModeTo('PREVIEW')}
                            />
                        </div>
                    </div>
                    <form noValidate autoComplete="off"
                        ref={theForm} className={clsx(classes.editForm, "flex-full-height")}
                    >
                        {(t === 'Storylet') && <TextField
                            label="Storylet title"
                            variant="outlined"
                            defaultValue={currentComp && currentComp.title}
                            fullWidth
                            size="small"
                            name="compTitle"
                        />}
                        <TextField
                            label={t + " body"}
                            multiline
                            variant="outlined"
                            defaultValue={currentComp && currentComp.text}
                            fullWidth
                            className={clsx(classes.textField, "flex-full-height")}
                            name="compText"
                            id="comptextareaid"
                        />
                    </form>
                </Box>

                {/* THE PREVIEW SECTION */}
                <Box className={clsx(currentActiveMode !== 'PREVIEW' && 'hide')}>
                    {
                        (!currentComp || currentComp.text.trim().length <= 0) &&
                        <div>Preview will appear here ...</div>
                    }
                    {
                        currentComp && currentComp.text.trim().length > 0 &&
                        // <div className={classes.preview} dangerouslySetInnerHTML={ getPreviewHTML() } />
                        <>
                            {/* Format buttons */}
                            <div className={clsx(classes.formatterBtns, 'text-right', 'overflow-none')}>
                                <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className={clsx("ico", t !== 'Storylet' && 'hide')}
                                    title="Full Screen Edit"
                                    onClick={() => changeModeTo('EDIT')}
                                />
                            </div>
                            <div
                                dangerouslySetInnerHTML={getPreviewHTML(currentComp.text)}
                                className={classes.previewBody}>
                            </div>
                        </>
                    }
                </Box>

            </Container>
        </FullScreenModal>
    )
}

const mapDispatchToProps = dispatch => ({
    saveStValue: (stID, title, text) => dispatch(actionUpdateSTAllText(stID, title, text)),
    saveChValue: (cID, value) => dispatch(actionUpdateCText(cID, value))
})

export default connect(null, mapDispatchToProps)(FullScreenEdit)