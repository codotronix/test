import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import InputIcon from '@material-ui/icons/Input'
import VisibilityIcon from '@material-ui/icons/Visibility'
import SaveIcon from '@material-ui/icons/Save'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        top: 79,
        right: 0,
        zIndex: 9,
        '& ul': {
            display: 'flex',
            flexDirection: 'column',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            overflow: 'hidden',
            transition: 'all 300ms linear',
            maxHeight: 24,
            opacity: .7,
            '&.visible': {
                maxHeight: 180,
                opacity: .9,
            },
            '& li': {
                color: '#fff',
                background: theme.palette.primary.main,
                borderBottom: '1px solid #fff',
                height: 36,
                width: 36,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        
    }
}))

/**
 * This appear as a collapsible floating belt of tools 
 * at the right of the Create/Edit Page
 * @param {*} props 
 */
const Toolbelt = props => {
    const classes = useStyles()
    const [isVisible, setVisibility] = useState(false)

    const { openImportModal, previewTale, doSaveDefault, goToTalesFlow } = props

    /**
     * Collapse the toolbet after each click
     */
    const handleClick = fn => {
        setVisibility(false)
        fn()
    }

    return (
        <div className={classes.root}>
            <ul className={clsx(isVisible && 'visible')}>
                <li title="Toggle Toolbelt" onClick={() => setVisibility(!isVisible)}>
                    <MoreHorizIcon />
                </li>
                <li title="Import" onClick={() => handleClick(openImportModal)}>
                    <InputIcon />
                </li>
                <li title="Preview" onClick={() => handleClick(previewTale)}>
                    <VisibilityIcon />
                </li>
                <li title="Save (default)" onClick={() => handleClick(doSaveDefault)}>
                    <SaveIcon />
                </li>
                <li title="TalesFlow" onClick={() => handleClick(goToTalesFlow)}>
                    <span className="talesflowicon"><AccountTreeIcon /></span>
                </li>
            </ul>
        </div>
    )
}

// const mapStateToProps = state => ({
//     user: state.user
// })
// const mapDispatchToProps = dispatch => ({
//     openSidebar: () => dispatch({ type: UI_SIDEBAR_OPEN }),
//     updateUser: user => dispatch({ type: USER_UPDATE, payload: {user} })
// })

// export default connect(mapStateToProps, mapDispatchToProps)(Header)
export default Toolbelt
