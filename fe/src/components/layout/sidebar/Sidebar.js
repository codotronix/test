import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles, Drawer, List, ListItem, ListItemIcon, ListItemText 
        } from '@material-ui/core'
import { connect } from 'react-redux'
import { UI_SIDEBAR_CLOSE, UI_LOGIN_MODAL_OPEN, USER_RESET, ONLINE_DATA_CLEAR_TALES } from '../../../redux/actionTypes'
// import { actionLogout } from '../../../redux/actionCreators/userActions'
import { actionSaveTaleAndReset } from '../../../redux/actionCreators/createTaleActions'
import { env } from '../../../utils/urls'
import { clearSession } from '../../../services/session.service'
import LogOutModal from '../../common/modal/LogOutModal'

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  listItem: {
    borderBottom: "1px solid " + theme.palette.primary.main,
    '& .ico': {
      fontSize: 20,
      color: theme.palette.primary.main,
      marginRight: 10
    }
  },
  icoInList: {
    minWidth: 30,
    
  },
  ico: {
    fontSize: 30
  },
  faIco: {
    fontSize: 27,
    color: theme.palette.primary.main
  }
}))

const navs = [
  {
    name: "Home",
    url: "/",
    iconClass: "fas fa-home ico"
  },
  {
    name: "Gallery",
    url: "/gallery",
    iconClass: "fas fa-book-reader ico"
  },
  {
    name: "Search",
    url: "/search",
    iconClass: "fas fa-search ico"
  },
  {
    name: "Create Tale",
    url: "/create-tale",
    iconClass: "fas fa-plus-square ico"
  },
  {
    name: "My Tales",
    url: "/my-tales",
    iconClass: "fas fa-briefcase ico"
  },
  {
    name: "My Profile",
    url: "/my-profile",
    iconClass: "fas fa-user ico"
  },
  {
    name: "Notifications",
    url: "/notifications",
    iconClass: "fas fa-bell ico"
  }
]

const Sidebard = props => {
  const classes = useStyles()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { openLoginModal, user, resetWIPTale, resetUser, 
    resetFetchedTales, purgePersistedData } = props

  const history = useHistory()

  const beforeYouGo = (e, url) => {
    const serverSideUrls = [
      "/",
      "/gallery",
      "/search"
    ]
    // Check If it is in Server Rendered Pages
    if (serverSideUrls.includes(url)) {
        e.preventDefault()
        e.stopPropagation()
        window.location.href = window.location.origin + url
    }
    else if (url === "/create-tale") {
      // this is the best place to cleanup the current WIP tale
      resetWIPTale()
    }
  }

  const showLogoutConfirmModal = e => {
    setIsLogoutModalOpen(true)
  }

  const logOut = e => {
    try{
      clearSession() // delete jwtToken
      resetUser()   // reset the user
      resetFetchedTales()  // delete previously fetched tales
      purgePersistedData()
      history.push('/')
      window.notify("You are successfully signed out.")
    }
    catch(err) {
      window.notify("Some error occured while trying to sign out.")
    }
  }

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={props.closeSidebar}
      onKeyDown={props.closeSidebar}
    >
      <List>
        {navs.map((nav, index) => (
          <Link key={nav.name} to={nav.url} className="anchor-default-none" onClick={e => beforeYouGo(e, nav.url)}>
            <ListItem button className={classes.listItem}>
                <i className={nav.iconClass}></i>
                <ListItemText primary={nav.name} />
            </ListItem>
          </Link>
        ))}
        {!user.email && <ListItem button className={classes.listItem} onClick={openLoginModal}>
         <i className="fas fa-sign-in-alt ico"></i>
          <ListItemText primary="Login" />
        </ListItem>}

        {user.email && <ListItem button className={classes.listItem} onClick={showLogoutConfirmModal}>
          <ListItemIcon className={classes.icoInList}>
            {/* <nav.icon color="primary" className={classes.ico} /> */}
            <i className="fas fa-sign-in-alt ico"></i>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>}

      </List>
    </div>
  )

  return (
    <div>
      <Drawer open={props.isSidebarOpen} onClose={props.closeSidebar}>
        {sideList('left')}
      </Drawer>
      <LogOutModal 
        isOpen={isLogoutModalOpen} 
        handleClose={() => setIsLogoutModalOpen(false)}
        logOut={logOut}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  isSidebarOpen: state.ui.isSidebarOpen,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  closeSidebar: () => dispatch({ type: UI_SIDEBAR_CLOSE }),
  openLoginModal: () => dispatch({type: UI_LOGIN_MODAL_OPEN}),
  resetWIPTale: () => dispatch(actionSaveTaleAndReset()),
  resetUser: () => dispatch({ type: USER_RESET }),
  resetFetchedTales: () => dispatch({ type: ONLINE_DATA_CLEAR_TALES })
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebard)
