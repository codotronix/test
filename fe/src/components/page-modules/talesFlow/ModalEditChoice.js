/**
 * When user clicks on a "From Node" and then a "To Node",
 * Then this modal opens, and lets user create (or edit if exists already)
 * a connector(choice) between fromNode to toNode
 */
import React, { useState, useEffect } from 'react'
import { makeStyles, TextField, Box, Grid, Button } from '@material-ui/core'
import SimpleModal from '../../common/modal/SimpleModal'

const useStyles = makeStyles(theme => ({
    modelST: {
        height: 70,
        border: `2px solid ${theme.palette.primary.main}`,
        padding: theme.spacing(1),
        textAlign: "center",
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 4
    },
    modelCon: {
        height: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        '& .con': {
            height: 1,
            borderTop: `2px dashed ${theme.palette.primary.main}`
        }
    },
    btnPanel: {
        display: 'flex',
        marginTop: theme.spacing(2),
        '& button': {
            flex: 1
        },
        '& button+button': {
            marginLeft: theme.spacing(2)
        }
    }
}))

export const ModalEditChoice = props => {
    const classes = useStyles()
    const { fromStID, toStID, type, text, handleSave, handleClose } = props
    // console.log(props)
    const [txt, setTxt] = useState('')
    useEffect(() => setTxt(text), [text])
    const title = type + " Choice"
    return (
        <SimpleModal
            {...props}
            title={title}
        >
            <Box mb={3} mt={1}>
                <Grid container>
                    <Grid item xs>
                        <div className={classes.modelST}>Storylet {fromStID}</div>
                    </Grid>
                    <Grid item xs className={classes.modelCon}>
                        <span>to</span>
                        <div className="con"></div>
                    </Grid>
                    <Grid item xs>
                        <div className={classes.modelST}>Storylet {toStID}</div>
                    </Grid>
                </Grid>
            </Box>
            {/* <Box mt={1} mb={2}>
                {t} (connector) from storylet {fromStID} to storylet {toStID}
            </Box> */}
            <TextField label="Choice Text" 
                value={txt} onChange={e => setTxt(e.target.value)}
                variant="outlined" fullWidth 
            />

            <Box className={classes.btnPanel}>
                <Button variant="outlined" color="primary" 
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button variant="contained" color="primary" 
                    onClick={() => handleSave(fromStID, toStID, txt, type)}
                >
                    Done
                </Button>
            </Box>

        </SimpleModal>
    )
}

export default ModalEditChoice