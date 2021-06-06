import React, { useState, useEffect } from 'react'
// import clsx from 'clsx'
import { makeStyles, Box, Button, FormControl, FormLabel, 
  FormControlLabel, Radio, RadioGroup  } from '@material-ui/core'
import SimpleModal from './SimpleModal'
import { clearOfflineSavedTales } from '../../../services/offlinesavedtales.service'
const notify = window['notify']

const useStyles = makeStyles(theme => ({
  titleBar: {
    margin: 0,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: `${theme.spacing(.5)}px ${theme.spacing(1)}px`,
    fontSize: theme.typography.pxToRem(20),
    minWidth: 300
  },
  modalBody: {
    padding: `${theme.spacing(2)}px`
  },
  closeIco: {
    position: "absolute",
    top: 3,
    right: 2,
    boxSizing: 'content-box',
    padding: '5px 7px',
    color: '#fff',
    cursor: 'pointer'
  }
}))

const LogOutModal = props => {
  const classes = useStyles()
  const { isOpen, handleClose, logOut } = props
  const [doDeleteOfflineTales, setDoDeleteOfflineTales] = useState('-') // Y, N

  /**
   * Whenever closed and re-opened, 
   * user should CONFIRM their offline save preference again
   */
  useEffect(() => {
    setDoDeleteOfflineTales('-')
  }, [isOpen])

  const handleOfflineTalesRadio = e => {
    setDoDeleteOfflineTales(e.target.value)
  }

  const handleLogout = e => {
    // Mandatory Check
    if(doDeleteOfflineTales !== 'Y' && doDeleteOfflineTales !== 'N') {
      notify('Select whether to keep or delete offline tales')
    }
    else {
      if (doDeleteOfflineTales === 'Y') {
        clearOfflineSavedTales()
        notify("Offline tales deleted successfully")
      }
      logOut()
      handleClose()
    }
  }

  return (
    <SimpleModal
      isOpen={isOpen}
      handleClose={handleClose}
      title="Please Confirm"
    >
      <p>
        Are you sure you want to logout ?
      </p>
      <p>
        <b>Warning:</b> Since Offline Saved Tales are saved in common memory location, they can be seen/deleted by anyone using Reactale in this device (Safer options are saving online or export/import).
      </p>
      <Box my={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">So, do you want to delete offline tales ?</FormLabel>
          <RadioGroup aria-label="gender" name="gender1" value={doDeleteOfflineTales} onChange={handleOfflineTalesRadio}>
            <FormControlLabel value="Y" control={<Radio />} label="Yes, delete offline tales" />
            <FormControlLabel value="N" control={<Radio />} label="No, don't delete offline tales" />
            <FormControlLabel value="-" control={<Radio />} label="Choose either of above 2 options" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mt={2} className="text-right">
        <Button 
            variant="outlined"
            color="primary"
            onClick={handleClose}
        >
          Cancel
        </Button>
        <Button 
            variant="contained"
            color="primary"
            onClick={handleLogout}
            className="ml-5"
        >
          Log out
        </Button>
      </Box>
    </SimpleModal>
  );
}

export default LogOutModal
