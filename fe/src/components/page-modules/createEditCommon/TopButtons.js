import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import InputIcon from '@material-ui/icons/Input'
import VisibilityIcon from '@material-ui/icons/Visibility'
import SaveIcon from '@material-ui/icons/Save'

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: 25,
        '& ul': {
            display: 'flex',
            justifyContent: 'center',
            '& li': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 70,
                '& svg': {
                    width: 40,
                    height: 40,
                    color: theme.palette.primary.main,
                    boxShadow: '0 0 5px 2px #ababab',
                    borderRadius: 4,
                    marginBottom: 9,
                    padding: 8
                },
                '& .label': {
                    fontSize: 14
                }
            },
            '& li:hover': {
                transform: 'scale(1.1)'
            }
        }
    }
}))

/**
 * This appear as a collapsible floating belt of tools 
 * at the right of the Create/Edit Page
 * @param {*} props 
 */
const TopButtons = props => {
    const classes = useStyles()

    const { openImportModal, previewTale, doSaveDefault, goToTalesFlow } = props

    return (
        <div className={classes.root}>
            <ul>
                <li title="Import" onClick={openImportModal}>
                    <InputIcon />
                    <span className="label">Import</span>
                </li>
                <li title="Preview" onClick={previewTale}>
                    <VisibilityIcon />
                    <span className="label">Preview</span>
                </li>
                <li title="Save (default)" onClick={doSaveDefault}>
                    <SaveIcon />
                    <span className="label">Save</span>
                </li>
                <li title="TalesFlow" onClick={goToTalesFlow}>
                    <span className="talesflowicon"><AccountTreeIcon /></span>
                    <span className="label">TalesFlow</span>
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
export default TopButtons
