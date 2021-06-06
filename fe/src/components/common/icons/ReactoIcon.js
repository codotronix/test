import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        fontFamily: "Georgia, serif",
        fontSize: 20,
        fontWeight: 'bold',
        // transform: 'scaleX(0.72)',
        display: 'inline-block',
        transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    }
}))

const ReactoIcon = props => {
    const classes = useStyles()
    const { className } = props
    return (
        <span {...props} className={clsx(className, classes.root)}>((r))</span>
    )
}

export default ReactoIcon