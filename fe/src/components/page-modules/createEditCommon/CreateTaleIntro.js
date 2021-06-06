import React, { useState, useEffect } from 'react'
// import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import { ajaxPost } from '../../../utils/ajax'
import { InputAdornment, Box, Grid, TextField, Select, Button,
    FormControl, InputLabel, MenuItem, makeStyles } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { connect } from 'react-redux'
import { TALE_UPDATE_INFO } from '../../../redux/actionTypes'
import { actionUpdateImgUrl } from '../../../redux/actionCreators/createTaleActions'
import { LANGUAGES, GENRES } from '../../../utils/constants'
import { config, UPLOAD_BANNER } from '../../../utils/urls'

const notify = window['notify']

const useStyles = makeStyles(theme => ({
    imgUploadSec: {
        display: 'flex',
        '& .img-preview': {
            height: 90,
            width: 150,
            border: '1px solid #bbb',
            borderRadius: 4,
            flexGrow: 1,
            marginRight: 9,
            textAlign: 'center',
            overflow: 'hidden',
            padding: 0.5,
            '& img': {
                maxWidth: '100%',
                maxHeight: '100%'
            }
        },
        '& .btns': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly'
        }
    }
}))

const updateTaleInfo = (dispatch, key, val, oldInfo) => {

    // desiredUrl must contain only alpha num and hyphen
    if (key === 'desiredUrl' && !(/^[A-Za-z0-9-]{0,}$/g.test(val)) ) {
        return
    }
    dispatch({
        type: TALE_UPDATE_INFO,
        payload: {
            ...oldInfo,
            [key]: val
        }
    })
}

const CreateTaleIntro = props => {
    const classes = useStyles()
    const { info, typingVal, userEmail, updateImgUrl } = props
    const [imgFile, setImgFile] = useState(null)
    const [previewImgUrl, setPreviewImgUrl] = useState(config.defaultImg)

    useEffect(() => {
        setPreviewImgUrl(info.imgUrl ? `/ups/banners/${info.imgUrl}`: config.defaultImg)
    }, [info])

    const loadImg = e => {
        // return // FOR NOW, COMMENT OUT LATER
        const fileList = e.target.files;
        console.log(fileList)

        // Though we are hiding the upload section until 1st save
        if(!info.storyUrl) {
            notify('The tale must be saved online atleast once before uploading banner image')
            return
        }
    
        if(fileList.length > 0) {
            setImgFile(fileList[0])
            setPreviewImgUrl(URL.createObjectURL(fileList[0]))
        }
    }

    const uploadImg = oldInfo => {
        // notify('Upload Image coming soon ...')
        if(!imgFile) return notify ('Select an image first ...')

        window.showLoader()
        let formData = new FormData()
        formData.append('storybanner', imgFile)
        formData.append('storyUrl', info.storyUrl)
        formData.append('email', userEmail)

        ajaxPost(UPLOAD_BANNER, formData)
        .then(res => {
            notify(res.data.msg)
            // if successful, update the local story imgUrl also
            const { newFileName } = res.data
            if(newFileName) {
                // we can intelligently re-use the same function as others
                // to update the redux state
                typingVal('imgUrl', newFileName, oldInfo)
            }
        })
        .catch(err => notify('Some error occurred ...'))
        .finally(() => window.hideLoader())
    }

    return (
        <Box py={3}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={info.name}
                        label="Name of the Tale"
                        required
                        onChange={e => typingVal('name', e.target.value, info)}
                        InputProps={info.name.length <= 0 && {
                            endAdornment: <InputAdornment position="end"><ErrorOutlineIcon /></InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel required>
                            Genre
                        </InputLabel>
                        <Select
                            value={info.genre}
                            fullWidth
                            onChange={e => typingVal('genre', e.target.value, info)}
                        >
                            {
                                GENRES.map(g => (
                                    <MenuItem value={g} key={g}>
                                        {g}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={info.tags}
                        required
                        label="Tags"
                        onChange={e => typingVal('tags', e.target.value, info)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel required>
                            Language
                        </InputLabel>
                        <Select
                            value={info.lang}
                            required
                            label="Language"
                            fullWidth
                            onChange={e => typingVal('lang', e.target.value, info)}
                        >
                            {
                                LANGUAGES.map(l => (
                                    <MenuItem value={l} key={l}>
                                        {l}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Author Display Name"
                        placeholder="Original creator's name"
                        value={info.authorDisplayName}
                        helperText="Write the name to display as author ..."
                        onChange={e => typingVal('authorDisplayName', e.target.value, info)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        disabled
                        value={userEmail || 'Please login'}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {!info.storyUrl &&
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Custom URL"
                        value={info.desiredUrl}
                        helperText="Only alphabets, numbers, hyphens (-) allowed. Can not be changed later"
                        onChange={e => typingVal('desiredUrl', e.target.value, info)}
                    />}
                    {info.storyUrl &&
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Custom URL"
                            disabled
                            value={'/' + info.storyUrl}
                        />
                    }
                </Grid>
                <Grid item xs={12} sm={6} md={3} className={clsx(classes.imgUploadSec, !info.storyUrl && 'hide')}>
                    <div className="img-preview">
                        { previewImgUrl && <img src={previewImgUrl} /> }
                    </div>
                    <div className="btns">
                        <Button 
                            variant="outlined" 
                            color="primary"
                            onClick={() => document.getElementById('taleimgupload').click()}
                        >
                            Select
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => uploadImg(info)}
                        >
                            Upload
                        </Button>
                        
                        <input id="taleimgupload" type="file" name="storyimage" accept="image/*" onChange={loadImg} className="hide" />
                    </div>
                    
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        rows="4"
                        fullWidth
                        label="Brief description"
                        required
                        variant="outlined"
                        value={info.description}
                        onChange={e => typingVal('description', e.target.value, info)}
                        InputProps={info.description.length <= 100 && {
                            endAdornment: <InputAdornment position="end"><ErrorOutlineIcon /></InputAdornment>,
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

const mapStateToProps = state => ({
    info: state.wipTale.info,
    userEmail: state.user.email
})
const mapDispatchToProps = dispatch => ({
    typingVal: (key, val, oldInfo) => updateTaleInfo(dispatch, key, val, oldInfo),
    updateImgUrl: imgUrl => dispatch(actionUpdateImgUrl(imgUrl))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaleIntro)