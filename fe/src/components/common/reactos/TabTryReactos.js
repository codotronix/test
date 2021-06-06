import React, { useState, useEffect } from 'react'
import { makeStyles, Box, TextField, Button, Grid } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    textField: {
        fontFamily: '"Courier New", Courier, monospace',
    },
    interpretedTxt: {
        whiteSpace: 'pre-wrap'
    }
}))

const TabTryReactos = props => {
    const classes = useStyles()
    const { rTxt } = props
    const [reactiveTxt, setReactiveTxt] = useState('')
    const [interpretedTxt, setInterpretedTxt] = useState('')

    useEffect(() => {
        setReactiveTxt(rTxt)
    }, [rTxt])

    const interpretReacto = () => {
        setInterpretedTxt(window.rto.process(reactiveTxt))
    }

    return (
        <Box>
            <p>Paste any text containing reactos and click "Interpret"</p>

            <Box>
                <TextField
                    label="Reactive Text"
                    multiline
                    rows="6"
                    variant="outlined"
                    fullWidth
                    className={classes.textField}
                    value={reactiveTxt}
                    onChange={e => setReactiveTxt(e.target.value)}
                />

                <Grid container spacing={1}>
                    <Grid item xs>
                        <Button 
                            variant="contained" 
                            color="primary"
                            className="mt-15"
                            fullWidth
                            size="small"
                            onClick={() => {setReactiveTxt(''); setInterpretedTxt('')} }
                        >
                            Clear
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button 
                            variant="contained" 
                            color="primary"
                            className="mt-15"
                            fullWidth
                            size="small"
                            onClick={interpretReacto}
                        >
                            Convert
                        </Button>
                    </Grid>
                </Grid>

                <Box py={3}>
                    { interpretedTxt && 
                    <div><b><u>Interpreted Text</u></b></div>}
                    <div className={classes.interpretedTxt}>{interpretedTxt || 'Converted text will appear here ...'}</div>
                </Box>
            </Box>
        </Box>
    )
}

export default TabTryReactos