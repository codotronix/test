import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        padding: '5px 5px 5px 18px'
    },
    ico: {
        position: 'absolute',
        left: -2,
        top: 7,
        color: theme.palette.primary.main,
        fontSize: 16
    }
}))

const Li = props => {
    const classes = useStyles()
    const { text, children } = props
    return (
        <li className={classes.root}>
            <DoubleArrowIcon className={classes.ico}/>
            {text || children}
        </li>
    )
}

export default Li