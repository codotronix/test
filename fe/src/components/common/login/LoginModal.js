import React, { useState, useEffect } from 'react'
import SimpleModal from '../../common/modal/SimpleModal'
import {
    TextField, Paper, Tabs, Tab, Box, makeStyles, Button,
    Accordion, AccordionSummary, AccordionDetails, Typography
} from '@material-ui/core'
import { connect } from 'react-redux'
import { UI_LOGIN_MODAL_CLOSE, UI_LOGIN_SET_ACT_TAB } from '../../../redux/actionTypes'
import { actionLogin, actionSignup } from '../../../redux/actionCreators/userActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { verfyEmail, resendOTP, updateNewPswd } from './login.service'
import { OTP_TYPES } from '../../../utils/enums'
import { isEmailValid, isPasswordValid } from '../../../utils/util'

const notify = window['notify']

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    // loginModal: {
    //     maxWidth: 600,
    //     padding: 0
    // },
    heading: {
        fontSize: theme.typography.pxToRem(16),
        fontWeight: theme.typography.fontWeightRegular,
        color: theme.palette.primary.main
    }
}))

const LoginModal = props => {
    const classes = useStyles()
    const { isOpen, handleClose, visibleTabIndex, title, changeTab, user, doLogin, doSignup } = props
    const handleTabSwitch = (e, tabIndex) => changeTab(tabIndex)
    const [localUser, setLocalUser] = useState(user || {})
    const [emailVerifyMSG, setEmailVerifyMSG] = useState('')

    useEffect(() => {
        // console.log("Inside useEffect, user changed")
        if (user) {
            setLocalUser(user)
        }
    }, [user])

    const isEmailPswdValid = (email, pswd) => {
        if(!email || !isEmailValid(email)) {
            notify('Please enter a valid email address')
            return false
        }

        if(!pswd || !isPasswordValid(pswd)) {
            return notify('Please enter a valid password of length between 8 to 20 and must have atleast 1 uppercase letter, 1 lowercase, 1 number and 1 special character.')
        }

        return true
    }

    const handleLogin = e => {
        e.preventDefault()
        const { email, pswd } = localUser

        if(isEmailPswdValid(email, pswd)) {
            doLogin({ email, pswd })
        }
    }

    const handleSignup = e => {
        e.preventDefault()
        const { email, pswd, firstname, lastname } = localUser
        if (!email || !pswd || !firstname || !lastname) {
            notify('Enter Firstname, Lastname Email, Password to login...')
            return
        }

        if(isEmailPswdValid(email, pswd)) {
            doSignup({ email, pswd, firstname, lastname })
        }
    }

    const handleVerifyEmail = () => {
        if(!localUser.email || !localUser.emailverifyotp) return notify('Both email and otp are mandatory ...')
            
        else if(isNaN(localUser.emailverifyotp)) return notify('OTP must be numeric')

        else if(!isEmailValid(localUser.email)) return notify('Enter a valid email address')

        window.showLoader()
        verfyEmail(localUser.email, localUser.emailverifyotp)
        .then(r => notify(r.msg))
        .catch(err => notify('Some error occured. Please try again later ...'))
        .finally(r => {
            // Hide Loader
            window.hideLoader()
        })
    }

    const updateLocalUser = e => {
        setLocalUser({
            ...localUser,
            [e.target.name]: e.target.value
        })
    }

    const sendSignupEmailOTP = e => {
        if(!localUser.email || !isEmailValid(localUser.email)) return notify('Please enter your email address and try again.')
        // SHOW LOADER
        window.showLoader()
        resendOTP(localUser.email, OTP_TYPES.SIGNUP_EMAIL_VERIFICATION)
        .then(r => notify(r.msg))
        .catch(err => notify('Some error occured ...'))
        .finally(() => window.hideLoader())
    }

    const sendForgotPswdOTP = e => {
        if(!localUser.email || !isEmailValid(localUser.email)) return notify('Please enter your email address and try again.')
        // SHOW LOADER
        window.showLoader()
        resendOTP(localUser.email, OTP_TYPES.FORGOT_PASSWORD)
        .then(r => notify(r.msg))
        .catch(err => notify('Some error occured ...'))
        .finally(() => window.hideLoader())
    }

    const saveNewPswd = e => {
        if(!localUser.email || !localUser.pswdchangeotp || !localUser.newpswd || !localUser.newpswd1) {
            return notify('Email, OTP, Password and Re-password - all 4 fields are Mandatory to change password.')
        }

        if(!isEmailPswdValid(localUser.email, localUser.newpswd)) return

        if(isNaN(localUser.pswdchangeotp)) {
            return notify('OTP must be numeric.')
        }

        if(localUser.newpswd !== localUser.newpswd1) {
            return notify('Password and Re-password is not matching. Please type again.')
        }

        window.showLoader()
        updateNewPswd(localUser.email, localUser.pswdchangeotp, localUser.newpswd)
        .then(r => notify(r.msg))
        .catch(err => notify('Some error occured ...'))
        .finally(() => window.hideLoader())
    }

    return (
        <SimpleModal
            isOpen={isOpen}
            handleClose={handleClose}
            title={title || "Hi There!"}
            // className={classes.loginModal}
        >
            <Paper square>
                <Tabs
                    value={visibleTabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabSwitch}
                    centered
                    aria-label="tabs to create the story"
                >
                    <Tab label="Sign in" />
                    <Tab label="Sign up" />
                    <Tab label="Manage" />
                </Tabs>
            </Paper>

            {/* Sign In Section */}
            <Box className={visibleTabIndex !== 0 ? 'hide' : ''}>
                <form onSubmit={handleLogin}>
                    <TextField label="Email" name="email" value={localUser.email} onChange={updateLocalUser} variant="outlined" size="small" fullWidth className="mt-15" />
                    <TextField label="Password" name="pswd" value={localUser.pswd} onChange={updateLocalUser} type="password" variant="outlined" size="small" fullWidth className="mt-15" />
                    <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        className="mt-15"
                        fullWidth
                        onClick={handleLogin}
                    >
                        Sign in
                    </Button>
                </form>
            </Box>

            {/* Sign Up Section */}
            <Box className={visibleTabIndex !== 1 ? 'hide' : ''}>
                <form onSubmit={handleSignup}>
                    <TextField label="First name" name="firstname" value={localUser.firstname} onChange={updateLocalUser} variant="outlined" size="small" fullWidth className="mt-15" />
                    <TextField label="Last name" name="lastname" value={localUser.lastname} onChange={updateLocalUser} variant="outlined" size="small" fullWidth className="mt-15" />
                    <TextField label="Email" name="email" value={localUser.email} onChange={updateLocalUser} variant="outlined" size="small" fullWidth className="mt-15" />
                    <TextField label="Password" name="pswd" value={localUser.pswd} onChange={updateLocalUser} type="password" variant="outlined" size="small" fullWidth className="mt-15" />
                    <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        className="mt-15"
                        fullWidth
                        onClick={handleSignup}
                    >
                        Sign up
                    </Button>
                </form>
            </Box>

            {/* Manage Section */}
            <Box className={visibleTabIndex !== 2 ? 'hide' : ''}>

                <Accordion className="mui-accordion-override-1 mt-15">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>
                            Email Verification
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className="width-100" pt={1}>
                            <TextField label="Email to Verify" name="email" value={localUser.email} onChange={updateLocalUser} variant="outlined" size="small" fullWidth />
                            <div className="mt-15 flex" >
                                <TextField label="OTP" name="emailverifyotp" value={localUser.emailverifyotp} onChange={updateLocalUser} variant="outlined" size="small" />
                                <Button
                                    variant="contained"
                                    className="ml-5"
                                    color="primary"
                                    onClick={handleVerifyEmail}
                                >
                                    Verify
                                </Button>
                            </div>
                            <div className="mt-15">
                                Did not receive OTP? <span onClick={sendSignupEmailOTP}><u>Click here</u></span> to resend.
                            </div>
                            { emailVerifyMSG && <div>{emailVerifyMSG}</div> }
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion className="mui-accordion-override-1">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>
                            Password Recovery
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className="width-100">
                            <TextField label="Signup Email" name="email" value={localUser.email} onChange={updateLocalUser} variant="outlined" size="small" fullWidth className="mt-15" />
                            <Button
                                variant="outlined"
                                className="mt-15"
                                color="primary"
                                fullWidth
                                onClick={sendForgotPswdOTP}
                            >
                                Send OTP
                            </Button>

                            <Box className="width-100">
                                <TextField label="Enter OTP" name="pswdchangeotp" value={localUser.pswdchangeotp} onChange={updateLocalUser} variant="outlined" size="small" fullWidth className="mt-15" />
                                <TextField label="Type New Password" name="newpswd" value={localUser.newpswd} onChange={updateLocalUser} type="password" variant="outlined" size="small" fullWidth  className="mt-15" />
                                <TextField label="Retype New Password" name="newpswd1" value={localUser.newpswd1} onChange={updateLocalUser} type="password" variant="outlined" size="small" fullWidth  className="mt-15" />
                                <Button
                                    variant="contained"
                                    className="mt-15"
                                    color="primary"
                                    fullWidth
                                    onClick={saveNewPswd}
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>

        </SimpleModal>
    )
}

const mapStateToProps = state => ({
    isOpen: state.ui.isLoginModalOpen,
    visibleTabIndex: state.ui.loginActiveTab,
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    handleClose: () => dispatch({ type: UI_LOGIN_MODAL_CLOSE }),
    changeTab: tabIndex => dispatch({ type: UI_LOGIN_SET_ACT_TAB, payload: { tabIndex } }),
    doLogin: u => dispatch(actionLogin(u)),
    doSignup: u => dispatch(actionSignup(u))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)