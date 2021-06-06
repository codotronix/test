import React, { useEffect } from 'react'
import { makeStyles, AppBar, Toolbar, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
// import logoImg from '../../../assets/img/logo/Reactale-logo-50h-white-bg.png'
import styles from './style.module.css'
import { connect } from 'react-redux'
import { UI_SIDEBAR_OPEN, USER_UPDATE } from '../../../redux/actionTypes'
import { GET_LOGGEDIN_USER } from '../../../utils/urls'
// import axios from 'axios'
import { ajaxGet } from '../../../utils/ajax'
const notify = window['notify']

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    toolbar: {
        padding: '0 10px'
    },
    greet: {
        width: 63,
        fontSize: 13,
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginLeft: 7
    },
    profileLink: {
        color: '#fff',
        textDecoration: 'none'
    }
}))

const Header = props => {
    const classes = useStyles()
    const { openSidebar, user, updateUser } = props

    useEffect(() => {
        window.showLoader()
        if (!user.email) {
            ajaxGet(GET_LOGGEDIN_USER)
            .then(res => {
                const { status, msg, user } = res.data
                if(status === 200) {
                    updateUser(user)
                }
                else {
                    // notify(msg)  // Nothing to do, it's ok if user is not logged in 
                }
            })
            .catch(err => { 
                //console.log(err)
            })
            .finally(() => window.hideLoader())
        }
    }, [])

    // console.log(styles)
    return (
        <div className="flex-grow-1">
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" onClick={openSidebar} className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <div className={styles.logoContainer}>
                        <img src="/r/assets/img/logo/Reactale-logo-50h-white-bg.png" alt="Reactale Logo" className={styles.logoImg} />
                    </div>
                    {/* <Button color="inherit" onClick={openLoginModal}>Login</Button> */}
                    <div className={classes.greet}>
                        {!user.firstname && <span title="Welcome Guest">Welcome Guest!</span>}
                        {user.firstname && 
                            <a href="/r/my-profile" className={classes.profileLink}>
                                <span title={'Welcome ' + user.firstname}>Welcome {user.firstname}!</span>
                            </a>}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    openSidebar: () => dispatch({ type: UI_SIDEBAR_OPEN }),
    updateUser: user => dispatch({ type: USER_UPDATE, payload: {user} })
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
