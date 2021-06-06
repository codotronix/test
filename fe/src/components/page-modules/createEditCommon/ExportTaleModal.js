import React from 'react'
import { Typography, TextField, Box, Button } from '@material-ui/core';
import SimpleModal from '../../common/modal/SimpleModal'
const notify = window['notify']

const ExportTaleModal = props => {
    const { isOpen, handleClose, expTaleContent } = props
    const textFieldRef = React.createRef()
    
    const clickToCopy = textRef => {
        console.log(textRef)
        const t = textRef.current.getElementsByTagName('input').item(0)
        /* Select the text field */
        t.select()
        t.setSelectionRange(0, 999999999) /*For mobile devices*/
    
        /* Copy the text inside the text field */
        document.execCommand("copy")
    
        /* Alert the copied text */
        setTimeout(()=>{
            notify("Text copied to clipboard ...")
        }, 0)
    }

    return (
        <SimpleModal 
            isOpen={isOpen} 
            handleClose = {handleClose}
            title="Export Reactale"
        >
        <Typography variant="body1" gutterBottom>
            Copy this text and paste it in a text file in case file download is not working (e.g. in mobile browsers)
        </Typography>

        <Box my={3}>
            <TextField 
                label="Outlined" 
                variant="outlined" 
                value={expTaleContent}
                fullWidth
                ref={textFieldRef}
            />
        </Box>
        <Button variant="outlined" color="primary" onClick={() => clickToCopy(textFieldRef)}>
            Copy Reactale Text
        </Button>
        </SimpleModal>
    )
}

export default ExportTaleModal