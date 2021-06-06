module.exports = {
    GENERIC_SUCCESS: { 
        status: 200, 
        msg: 'Operation successful' 
    },
    GENERIC_NOTSIGNEDIN: {
        status: 902, 
        msg: 'You must sign in to continue this operation'
    },
    GENERIC_EMAILMISMATCH: {
        status: 903, 
        msg: 'User or author email does not match with signed in email'
    },
    GENERIC_FAILURE: { 
        status: 904, 
        msg: 'Operation failed. Please try again later' 
    },
    GENERIC_PARAMSMISSING: { 
        status: 905, 
        msg: 'Operation failed. One or more required field(s) are missing / incorrect' 
    },


    SIGNUP_PARAMSMISSING: { 
        status: 1150, 
        msg: 'Uanble to sign up. One or more required fields missing' 
    },
    SIGNUP_DUPLICATEEMAIL: { 
        status: 1151, 
        msg: 'Email address already exists. If you have forgot your password, please use the "Forgot password" link under Sign in tab' 
    },
    SIGNUP_FAILED: { 
        status: 1153, 
        msg: 'Sign up failed' 
    },


    SIGNIN_PARAMSMISSING: { 
        status: 1200, 
        msg: 'Uanble to sign in. One or more required fields missing' 
    },
    SIGNIN_EMAILNOTEXIST: { 
        status: 1201, 
        msg: 'This email does not exist in our system. Please sign up first' 
    },
    SIGNIN_IDPSWDMISMATCH: { 
        status: 1202, 
        msg: 'The email | password combination does not match. Please try again' 
    },

    STORY_NOTFOUND: {
        status: 1500,
        msg: 'This tale does not exist'
    },
    STORY_NOTPUBLISHED: {
        status: 1501,
        msg: 'Sorry, this tale is not published. Please ask the author to publish it to read.'
    },

    GUARDERROR_PARAMMISSING: {
        status: 1800,
        msg: 'One or more required parameter missing - AuthorGuard'
    },
    GUARDERROR_CALLINGSEQUENCE: {
        status: 1801,
        msg: 'Secret Error 1801'
    },

    OTP_MISMATCH: {
        status: 1901,
        msg: 'The OTP doesn\'t match.'
    },
    OTP_EMAIL_ALREADY_VERIFIED: {
        status: 1902,
        msg: 'This email has already been verified. Therefore, new OTP is not required.'
    },
    OTP_WAIT_TIME: {
        status: 1903,
        msg: 'Please wait as it might take upto 4 hours for a mail to reach.'
    },
    OTP_SEND_ERROR: {
        status: 1904,
        msg: 'There was an error. Please try again later.'
    },

    PSWD_SAMEASPREV: {
        status: 2001,
        msg: 'New password can not be the same as old password.'
    },

    USERNAME_SAMEASNOW: {
        status: 2050,
        msg: "You already have this username. Congrats !!!"
    },
    USERNAME_NOTAVAILABE: {
        status: 2051,
        msg: "Sorry, this username is taken. Please try a different one."
    },
    
    MYPROFILE_USERDOESNOTEXIST: {
        status: 2101,
        msg: "Sorry, this user does not exist in our database."
    },

    NOTIF_LINKATALELIMIT: {
        status: 2151,
        msg: "Sorry, you already have too many open requests."
    },
    NOTIF_LINKTOSELFNOTALLOWED: {
        status: 2152,
        msg: "You need not send a request to yourself. Just edit and link."
    },
    NOTIF_LINKATALEDUPLICATE: {
        status: 2153,
        msg: "This request already exists."
    },
    NOTIF_NOTIFNOTFOUND: {
        status: 2154,
        msg: "Notification was not found. Maybe it is already deleted?"
    },
    NOTIF_NOPERMISSION: {
        status: 2155,
        msg: "Sorry you do not have permission to act on this notification."
    }
}