import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Box } from '@material-ui/core'
import Up from '@material-ui/icons/ExpandLess'
import Down from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
    title: {
        background: theme.palette.primary.main,
        color: '#fff',
        padding: '5px 10px',
        position: 'relative',
        '& .ocico': {
            position: 'absolute',
            right: 15,
            top: 4
        }
    },
    body: {
        border: `5px double ${theme.palette.primary.main}`,
        borderTop: "none",
        borderRadius: 4,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 15
    }
}))

const Accordion = props => {
    const classes = useStyles()
    const { isOpen, title, children, className } = props
    const [open, setOpen] = useState(!!isOpen)

    return (
        <Box className={className}>
            <div className={classes.title} onClick={() => setOpen(!open)}>
                <span className="ocico">
                    { open && <Up /> }
                    { !open && <Down /> }
                </span>
                {title}
            </div>
            <div className={clsx(classes.body, !open && 'hidden')}>
                {children}
            </div>
        </Box>
    )
}

export default Accordion