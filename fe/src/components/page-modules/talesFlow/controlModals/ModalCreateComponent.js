/**
 * When user clicks on the create (+) button on the left panel
 * of TalesFlow, this modal will appear enabling user to create 
 * either a Storylet(rectangle) or a Choice(connector)
 */
import React, { useState, useEffect } from 'react'
import { makeStyles, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import SimpleModal from '../../../common/modal/SimpleModal'
const notify = window.notify

const useStyles = makeStyles(theme => ({
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

const initData = {
    compType: '',    // S or C for Storylet or Connector
    fromSTID: '',
    toSTID: ''
}

export const ModalCreateComponent = props => {
    const classes = useStyles()
    const { handleClose, storylets, isOpen, openEditChoiceModal, createNewChoice } = props
    const [data, setData] = useState(initData)  // data for creating New Component

    useEffect(() => {
        // Reset the data after every open/close
        setData(initData)
    },
        [isOpen])

    const handleChange = e => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }


    /**
     * When the full form is filled, user will click 
     * on the create button to create the New Component
     * @param {Event} e 
     */
    const handleCreate = e => {
        // Check all fields are filled
        if(!data.compType || !data.fromSTID || 
            ((data.compType === 'CH') && !data.toSTID)
        ) {
            notify("Please fill all the fields ...")
            return
        }

        // If user wants to create a Choice
        if(data.compType === 'CH') {
            if(data.fromSTID === data.toSTID) {
                notify("FROM storylet and TO storylet cannot be same ...")
                return
            }

            // If everything is fine
            // close this modal and open the
            // create-edit-chocie-modal
            handleClose()
            openEditChoiceModal(data.fromSTID, data.toSTID)
            return
        }

        // If user wants to create a new Storylet
        else if (data.compType === 'ST') {
            // Interesting thing is -
            // WE NEVER CREATE A STORYLET ON ITS OWN
            // we create a connector from an existing storylet
            // and it automatically creates a NEW storylet at its other end
            createNewChoice(data.fromSTID)
            handleClose()
        }
    }

    return (
        <SimpleModal
            {...props}
            title="Create a Component"
        >
            <Box mb={3} mt={1}>
                {/* Select Storylet or Choice */}
                <FormControl variant="outlined" className="flex">
                    <InputLabel id="select-comp-type">Select type</InputLabel>
                    <Select
                        labelId="select-comp-type"
                        value={data.compType}
                        onChange={handleChange}
                        label="Component Type"
                        name="compType"
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="ST">Storylet</MenuItem>
                        <MenuItem value="CH">Choice</MenuItem>
                    </Select>
                </FormControl>

                {/* FROM STORYLET */}
                <FormControl variant="outlined" className="flex mt-15">
                    <InputLabel id="select-from-storylet">From storylet</InputLabel>
                    <Select
                        labelId="select-from-storylet"
                        value={data.fromSTID}
                        onChange={handleChange}
                        label="From storylet"
                        name="fromSTID"
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            Object.values(storylets).map(st =>
                                <MenuItem key={st.id} value={st.id}>
                                    {`${st.id} - ${st.title}`}
                                </MenuItem>)
                        }
                    </Select>
                </FormControl>

                {/* TO STORYLET, ONLY AVAILABLE DURING CHOICE CREATION */}
                {
                    (data.compType === 'CH') &&
                    <FormControl variant="outlined" className="flex mt-15">
                        <InputLabel id="select-to-storylet">To storylet</InputLabel>
                        <Select
                            labelId="select-to-storylet"
                            value={data.toSTID}
                            onChange={handleChange}
                            label="To storylet"
                            name="toSTID"
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                Object.values(storylets).map(st =>
                                    <MenuItem key={st.id} value={st.id}>
                                        {`${st.id} - ${st.title}`}
                                    </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                }
            </Box>

            <Box className={classes.btnPanel}>
                <Button variant="outlined" color="primary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button variant="contained" color="primary"
                    onClick={handleCreate}
                >
                    Create
                </Button>
            </Box>

        </SimpleModal>
    )
}

export default ModalCreateComponent