import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Box, TextField, Button, Grid, Checkbox } from '@material-ui/core'
import { Accordion } from '../misc'
import { connect } from 'react-redux'
import { TALE_UPDATE_REACTO_VARS } from '../../../redux/actionTypes'
import FormControlLabel from '@material-ui/core/FormControlLabel'
const notify = window['notify']

const useStyles = makeStyles(theme => ({
    liOfRVars: {
        borderBottom: `1px dotted ${theme.palette.primary.main}`,
        padding: '5px 10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingRight: 60,
        fontFamily: '"Courier New", Courier, monospace',
    }
}))

const TabCreateReactos = props => {
    const classes = useStyles()
    const { rVars, updateReactoVars } = props
    const initRVar = { name: '', val: '', userCustomizable: false, helptext: '' }
    const [newRVar, setNewRVar] = useState({ ...initRVar })
    // const [rVars, setRVars] = useState({})  // kv pair of all reacto-vars


    const handleChangeNewRVar = e => {
        let k = e.target.name
        let v = e.target.value

        if (k === 'name' && !(/^[A-Za-z0-9]{0,}$/g.test(v))) {
            return
        }
        setNewRVar({
            ...newRVar,
            [k]: v
        })
    }

    const setCustomizable = e => {
        setNewRVar({
            ...newRVar,
            userCustomizable: e.target.checked
        })
    }

    const AddRVar = () => {
        if (!newRVar.name || !newRVar.val) {
            notify('Please fill both variable-name and variable-value fields')
            return
        }
        // setRVars({
        //     ...rVars,
        //     [newRVar.name]: newRVar.val
        // })
        updateReactoVars({
            ...rVars,
            [newRVar.name]: newRVar
        })

        setNewRVar({ ...initRVar })
        notify(`Reacto variable ${newRVar.name} added successfully ...`)
    }
    return (
        <Box>
            <p>
                Let's create some user customizable (or may be not!) reactos ...
            </p>

            <Box>
                <Accordion title="Create Reactos">
                    <div>Add a Reacto Variable</div>
                    <TextField
                        label="Name of the Variable"
                        variant="outlined"
                        name="name"
                        fullWidth
                        required
                        size="small"
                        helperText="Use only alphabets and numbers, no space"
                        className="mt-25"
                        value={newRVar.name}
                        onChange={handleChangeNewRVar}
                    />

                    <TextField
                        label="Value of the Variable"
                        multiline
                        name="val"
                        rows="6"
                        variant="outlined"
                        helperText="Incase of customizable reacto this will be used as default/fallback value"
                        required
                        fullWidth
                        className="mt-25"
                        value={newRVar.val}
                        onChange={handleChangeNewRVar}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={newRVar.userCustomizable} 
                                onChange={setCustomizable} 
                                name="userCustomizable" 
                            />
                        }
                        label="Reader customizable"
                    />

                    <TextField
                        label="Hint for reader"
                        multiline
                        name="helptext"
                        rows="2"
                        variant="outlined"
                        required
                        fullWidth
                        helperText="Give some hint to the reader, e.g. Enter a name for the main character"
                        className={clsx('mt-25', !newRVar.userCustomizable && 'hidden')}
                        value={newRVar.helptext}
                        onChange={handleChangeNewRVar}
                    />

                    <Grid container spacing={1}>
                        <Grid item xs>
                            <Button
                                variant="outlined"
                                color="primary"
                                className="mt-15"
                                fullWidth
                                size="small"
                                onClick={() => setNewRVar({ ...initRVar })}
                            >
                                Reset
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button
                                variant="outlined"
                                color="primary"
                                className="mt-15"
                                fullWidth
                                size="small"
                                onClick={AddRVar}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Accordion>
            </Box>

            {/* SHOW THE DECLARED VARS */}
            <Box mt={1}>
                <Accordion title="View Reactos Variables">
                    <div>Current reacto variables</div>
                    <ul className="mt-15">
                        {
                            rVars && Object.keys(rVars).map(r =>
                                <li key={r} className={classes.liOfRVars}>
                                    ((r.var.{r}))
                                </li>
                            )
                        }
                    </ul>
                </Accordion>
            </Box>

        </Box>
    )
}
const mapStateToProps = state => ({
    rVars: state.wipTale.reactos ? state.wipTale.reactos.vars : {}
})
const mapDispatchToProps = dispatch => ({
    updateReactoVars: rvars => dispatch({ type: TALE_UPDATE_REACTO_VARS, payload: rvars })
})
export default connect(mapStateToProps, mapDispatchToProps)(TabCreateReactos)