import React, { useState } from 'react'
import { Typography, TextField, Box, Button } from '@material-ui/core';
import SimpleModal from '../../common/modal/SimpleModal'
const LZString = window['LZString']

const ImportTaleModal = props => {
    const {isOpen, handleClose, setForEditing} = props
    const [importedTxt, setImportedTxt] = useState('')
    const importTale = () => {
        // const tale = JSON.parse(decodeURIComponent(atob(importedTxt)))
        const tale = JSON.parse(LZString.decompressFromEncodedURIComponent(importedTxt))
        setForEditing(tale)
        setImportedTxt('')
    }

    const handleFileSelect = e => {
        let file = e.target.files[0]
        console.log(file)

        let reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return e => setImportedTxt(e.target.result)
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
    }

    return (
        <SimpleModal 
            isOpen={isOpen} 
            handleClose = {handleClose}
            title="Import Reactale"
        >
            <Typography variant="body1" gutterBottom>
                Import a previously exported Reactale file <b>OR</b> optionally you can paste the text from it if "file import" is not working in your browser
            </Typography>

            <Box mt={2}>
                <form encType="multipart/form-data">
                    <input 
                        type="file" 
                        accept="text/txt" 
                        name="files[]" 
                        size="30" 
                        onChange={e => handleFileSelect(e)}
                    />
                </form>
            </Box>

            <Box align="center" my={1}>
                <Typography variant="h6" gutterBottom>
                    <b>OR</b>
                </Typography>
            </Box>

            <Box>
                <TextField
                    label="Paste Content Here"
                    multiline
                    rows="4"
                    fullWidth
                    variant="outlined"
                    value = {importedTxt}
                    onChange = { e => setImportedTxt(e.target.value)}
                />
            </Box>
            
            <Box mt={2} align="right">
                <Button 
                    size="small"
                    variant="contained" 
                    color="primary"
                    onClick={importTale}
                >
                    Import
                </Button>
            </Box>

            
            
        </SimpleModal>
    )
}

export default ImportTaleModal