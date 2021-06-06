import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles, AppBar, Toolbar, IconButton, Select, MenuItem, TextField } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
// import logoImg from '../../../assets/img/logo/Reactale-logo-50h-white-bg.png'
import styles from './style.module.css'
import { connect } from 'react-redux'
import { UI_SIDEBAR_OPEN, USER_UPDATE } from '../../../redux/actionTypes'
import { GET_LOGGEDIN_USER, getRoot, getAssetsRoot } from '../../../utils/urls'
// import axios from 'axios'
import { ajaxGet } from '../../../utils/ajax'
import { useHistory } from 'react-router'
const notify = window['notify']

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    toolbar: {
        padding: '0'
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
    },
    rightBtnsHolder: {
        display: 'flex',
        '& .ico': {
            fontSize: 18,
        }
    },
    unisearchRoot: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        background: 'var(--primary-color)',
        height: 55,
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        padding: '5px 0 5px 10px',
        transition: 'all 300ms ease-in',
        transform: 'translateY(-60px)',
        '&.visible': {
            transform: 'translateY(0)',
        },
        '& .MuiInput-underline:before': {
            borderBottom: '1px solid rgb(255 255 255 / 90%)',
        },
        '& .search-field': {
            minWidth: 100,
            color: '#fff',
            '& svg': {
                color: '#fff'
            }
        },
        '& .search-box': {
            margin: '0 10px',
            flex: 1,
            '& input[type="text"]': {
                color: '#fff',
            }
        }
    }
}))

const searchFields = {
    name: 'Name',
    genre: 'Genre',
    lang: 'Language',
    tags: 'Tags',
    authorDisplayName: 'Author'
}

const Header = props => {
    const classes = useStyles()
    const { openSidebar, user, updateUser } = props
    const history = useHistory()
    const [isGreetingsVisible, setIsGreetingsVisible] = useState(false)
    const [uniSearch, setUniSearch] = useState({
        isVisible: false,
        searchFieldName: 'tags',
        searchFieldValue: ''
    })

    const handleChangeUniSearch = e => {
        const { name, value } = e.target
        setUniSearch({
            ...uniSearch,
            [name]: value
        })
    }

    const showUniSearch = bool => {
        setUniSearch({
            ...uniSearch,
            isVisible: bool
        })
    }

    useEffect(() => {
        window.showLoader()
        if (!user.email) {
            ajaxGet(GET_LOGGEDIN_USER)
                .then(res => {
                    const { status, msg, user } = res.data
                    if (status === 200) {
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


    const goto = url => history.push(url)

    const performSearch = () => {
        // no searchValue? return
        if (!uniSearch.searchFieldValue.trim()) return

        let newUrl =  `//${getRoot()}/search?${uniSearch.searchFieldName}=${uniSearch.searchFieldValue}`
        window.location.href = newUrl
    }

    // console.log(styles)
    return (
        <>
            <div className="flex-grow-1 headerbar">
                <AppBar position="fixed">
                    <Toolbar className={classes.toolbar}>
                        <IconButton onClick={openSidebar} className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <div className={styles.logoContainer}>
                            <img src={`//${getAssetsRoot()}/assets-img/logos/Reactale-logo-50h-white-bg.png`} alt="Reactale Logo" className={styles.logoImg} />
                        </div>

                        <div className={clsx(classes.rightBtnsHolder, styles.rightBtnsHolder)}>
                            <IconButton color="inherit" onClick={() => showUniSearch(true)}>
                                <i className="fas fa-search ico"></i>
                            </IconButton>
                            <IconButton color="inherit" onClick={() => goto('/notifications')}>
                                <i className="fas fa-bell ico"></i>
                            </IconButton>
                            <IconButton color="inherit" onClick={() => setIsGreetingsVisible(!isGreetingsVisible)}>
                                <i className="fas fa-user ico"></i>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className={clsx("profile-link", isGreetingsVisible && 'visible')}>
                    <a href="/r/my-profile" className="greet">
                        Welcome, {user.firstname || 'Guest'}!
                    </a>
                </div>
            </div>
            <div className={clsx(classes.unisearchRoot, uniSearch.isVisible && 'visible')}>
                <Select
                    name="searchFieldName"
                    value={uniSearch.searchFieldName}
                    onChange={handleChangeUniSearch}
                    className="search-field"
                >
                    {
                        Object.keys(searchFields).map(k => <MenuItem value={k} key={k}>{searchFields[k]}</MenuItem>)
                    }
                </Select>
                <TextField
                    placeholder="Type here ..."
                    className="search-box"
                    name="searchFieldValue"
                    value={uniSearch.searchFieldValue}
                    onChange={handleChangeUniSearch}
                />
                <IconButton color="inherit" onClick={performSearch}>
                    <i className="fas fa-search ico"></i>
                </IconButton>
                <IconButton color="inherit" onClick={() => showUniSearch(false)}>
                    <i className="fas fa-times ico"></i>
                </IconButton>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    openSidebar: () => dispatch({ type: UI_SIDEBAR_OPEN }),
    updateUser: user => dispatch({ type: USER_UPDATE, payload: { user } })
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
