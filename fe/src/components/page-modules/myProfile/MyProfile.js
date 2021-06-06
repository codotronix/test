import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { InputAdornment, Box, Grid, TextField, Select, Button, Typography,
            FormControl, InputLabel, MenuItem, makeStyles, Tooltip, IconButton
        } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { COUNTRIES, LANGUAGES, CONST_TITLE } from '../../../utils/constants'
import { connect } from 'react-redux'
import { USER_UPDATE } from '../../../redux/actionTypes'
import { ajaxPost } from '../../../utils/ajax'
import { UPDATE_USERNAME, UPDATE_MYPROFILE } from '../../../utils/urls'
const { hideLoader, notify } = window

const rtlIDTxt = `ReactaleID is your publicly visible ID (as displaying email publicly is not recommendable). It should be 6 to 20 characters long, can contain letters a to z, numbers 0 to 9, hyphen(-) and underscore(_). Since people will know you by this ID, it is advisable to change it only once and then stick to it forever.`

// const initUser = {
//     firstname: '',
//     lastname: '',
//     lang1: '',
//     lang2: '',
//     country: '',
//     gender: ''
// }

const useStyles = makeStyles(theme => ({
    sectionHead: {
        fontSize: 22,
        marginTop: 40,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        position: 'relative',
        '& .title': {
            position: 'absolute',
            left: 0,
            top: -16,
            background: '#fff',
            paddingRight: 9
        },
        '& .ico': {
            position: 'absolute',
            right: 0,
            top: -22,
            background: '#fff',
            color: theme.palette.primary.main,
            padding: 9,
            cursor: 'pointer'
        }
    },
    usernameTextboxWrap: {
        position: 'relative',
        '& .ico-clear': {
            position: 'absolute',
            top: 6,
            right: 6,
            padding: 4,
            opacity: .6,
            cursor: 'default'
        }
    }
}))

const MyProfile = props => {
    const { user, updateUser } = props
    const [tempUser, setTempUser] = useState({})  // in page, unsaved verion of user
    const [isUncollapsed, setIsUnCollapsed] = useState({})
    const classes = useStyles()

    useEffect(() => {
        document.title = 'My Profile | ' + CONST_TITLE
        hideLoader()
    }, [])

    useEffect(() => {
        setTempUser({ ...user })
    },
    [user])

    const handleChange = e => {
        let { name, value } = e.target

        // about me can be only 500 Chars long
        if(name === 'aboutme' && value.length > 500) {
            value = value.substr(0, 500)
        }
        // DOB must be numbers, hyphen and total 10 chars
        // DD-MM-YYYY
        // retain old value
        else if (name === "dob" && !/^[0-9-]{0,10}$/.test(value)) {
            value = tempUser[name] || ''
        }

        setTempUser({
            ...tempUser,
            [name]: value
        })
    }

    const toggleCollapse = id => {
        setIsUnCollapsed({
            ...isUncollapsed,
            [id]: !isUncollapsed[id]
        })
    }

    const saveprofile = () => {
        // STEP 1: Call API to save User Online
        console.log('tempUser = ', tempUser)

        // STEP 2: Then update the redux store
        ajaxPost(UPDATE_MYPROFILE, { user: tempUser, email: tempUser.email })
        .then(res => {
            const { status, updatedUserData, msg } = res.data
            notify(msg)
            if(status === 200) {
                // Update the redux store also...
                updateUser({
                    ...user,
                    ...updatedUserData
                })
            }
        })
        .catch(err => notify(err))
    }

    const saveUsername = () => {
        const { email, username } = tempUser
        ajaxPost(UPDATE_USERNAME, { email, username })
            .then(res => {
                const { status, info, msg } = res.data
                notify(msg)

                if (status === 200 && info) {
                    // Update this page's state
                    setTempUser({
                        ...tempUser,
                        username: info.newUsername
                    })

                    // Update the redux store also...
                    updateUser({
                        ...user,
                        username: info.newUsername
                    })
                }
            })
            .catch(err => notify(err))
    }

    const clearUsername = () => {
        setTempUser({
            ...tempUser,
            username: user.username
        })
    }

    return (
        <Box py={2}>
            <Typography variant="h4" component="h1">
                User Profile
            </Typography>

            {
                !tempUser.email &&
                <Box>Please login to see this page</Box>
            }

            {
                tempUser.email &&
                <>
                    {/* SECTION 0 */}
                    <div className={classes.sectionHead} onClick={() => toggleCollapse('acc0')}>
                        <span className="title">Account</span>
                        <span className="ico">
                            {!isUncollapsed['acc0'] && <i class="fas fa-chevron-up"></i>}
                            {isUncollapsed['acc0'] && <i class="fas fa-chevron-down"></i>}
                        </span>
                    </div>
                    { isUncollapsed['acc0'] &&
                        <Grid container spacing={2} className="mt-25">
                            <Grid item xs={12}>
                                Reactale ID
                                <Tooltip disableFocusListener title={rtlIDTxt}>
                                    <IconButton aria-label="info">
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={8} className={classes.usernameTextboxWrap}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={tempUser.username}
                                    label="ReactaleID"
                                    name="username"
                                    onChange={handleChange}
                                    helperText={`@${tempUser.username}`}
                                    InputProps={
                                        tempUser.username
                                        && !/^[a-z0-9-]{6,20}$/.test(tempUser.username)
                                        && {
                                            endAdornment: <InputAdornment position="end"><ErrorOutlineIcon /></InputAdornment>,
                                        }
                                    }
                                />
                                <CloseIcon className={clsx("ico-clear", user.username === tempUser.username && 'hidden')} onClick={clearUsername} />
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={saveUsername}
                                    fullWidth
                                    disabled={!/^[a-zA-Z0-9-_]{6,20}$/.test(tempUser.username)}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    }

                    {/* SECTION 1 */}
                    <div className={classes.sectionHead} onClick={() => toggleCollapse('acc1')}>
                        <span className="title">Basics</span>
                        <span className="ico">
                            {!isUncollapsed['acc1'] && <i class="fas fa-chevron-up"></i>}
                            {isUncollapsed['acc1'] && <i class="fas fa-chevron-down"></i>}
                        </span>
                    </div>
                    { isUncollapsed['acc1'] &&
                        <Grid container spacing={2} className="mt-25">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={tempUser.firstname}
                                    label="First name"
                                    required
                                    name="firstname"
                                    onChange={handleChange}
                                    InputProps={tempUser.firstname && tempUser.firstname.length <= 0 && {
                                        endAdornment: <InputAdornment position="end"><ErrorOutlineIcon /></InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={tempUser.lastname}
                                    label="Last name"
                                    required
                                    name="lastname"
                                    onChange={handleChange}
                                    InputProps={tempUser.lastname && tempUser.lastname.length <= 0 && {
                                        endAdornment: <InputAdornment position="end"><ErrorOutlineIcon /></InputAdornment>,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel required>
                                        Gender
                            </InputLabel>
                                    <Select
                                        value={tempUser.gender}
                                        fullWidth
                                        onChange={handleChange}
                                        name="gender"
                                    >
                                        <MenuItem value='M'>Male</MenuItem>
                                        <MenuItem value='F'>Female</MenuItem>
                                        <MenuItem value='O'>Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel required>
                                        Country
                            </InputLabel>
                                    <Select
                                        value={tempUser.country}
                                        fullWidth
                                        onChange={handleChange}
                                        name="country"
                                    >
                                        {
                                            COUNTRIES.map(c => (
                                                <MenuItem value={c} key={c}>
                                                    {c}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>
                                        Language 1
                            </InputLabel>
                                    <Select
                                        value={tempUser.lang1}
                                        fullWidth
                                        onChange={handleChange}
                                        name="lang1"
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
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>
                                        Language 2
                                    </InputLabel>
                                    <Select
                                        value={tempUser.lang2}
                                        fullWidth
                                        onChange={handleChange}
                                        name="lang2"
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
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>
                                        Language 3
                                    </InputLabel>
                                    <Select
                                        value={tempUser.lang3}
                                        fullWidth
                                        onChange={handleChange}
                                        name="lang3"
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
                                    value={tempUser.dob}
                                    label="Date of Birth"
                                    name="dob"
                                    onChange={handleChange}
                                    helperText="Only you can see it"
                                    placeholder="DD-MM-YYYY"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={tempUser.aboutme}
                                    label="About me"
                                    name="aboutme"
                                    onChange={handleChange}
                                    multiline
                                    helperText={(tempUser.aboutme?.length || 0) + ' / 500'}
                                />
                            </Grid>
                        </Grid>
                    }

                    {/* SECTION 2 */}
                    <div className={classes.sectionHead} onClick={() => toggleCollapse('acc2')}>
                        <span className="title">Social</span>
                        <span className="ico">
                            {!isUncollapsed['acc2'] && <i class="fas fa-chevron-up"></i>}
                            {isUncollapsed['acc2'] && <i class="fas fa-chevron-down"></i>}
                        </span>
                    </div>
                    { isUncollapsed['acc2'] &&
                        <Grid container spacing={2} className="mt-25">
                            <Grid item xs={12} sm={6} className={classes.usernameTextboxWrap}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={tempUser.facebookID}
                                    label="Facebook ID"
                                    name="facebookID"
                                    onChange={handleChange}
                                    helperText={`https://facebook.com/${tempUser.facebookID || ''}`}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} className={classes.usernameTextboxWrap}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={tempUser.twitterID}
                                    label="Twitter ID"
                                    name="twitterID"
                                    onChange={handleChange}
                                    helperText={`https://twitter.com/${tempUser.twitterID || ''}`}
                                />
                            </Grid>
                        </Grid>
                    }

                    <Box mt={4} className="text-right">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={saveprofile}
                        >
                            Save Profile
                        </Button>
                    </Box>
                </>
            }

        </Box>
    )
}

const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch({ type: USER_UPDATE, payload: { user } })
})

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)