import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Left from '@material-ui/icons/KeyboardArrowLeft'
import Right from '@material-ui/icons/KeyboardArrowRight'
import Up from '@material-ui/icons/KeyboardArrowUp'
import Down from '@material-ui/icons/KeyboardArrowDown'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    container: {
        position: "absolute"
    },
    btn: {
        position: "absolute",
        fontSize: 30,
        backgroundColor: red[100],
        borderRadius: 6,
        '&:active': {
            backgroundColor: red[300]
        }
    },
    left: {
        left: 0,
        top: 0
    },
    right: {
        left: 60,
        top: 0
    },
    up: {
        left: 30,
        top: -30
    },
    down: {
        left: 30,
        top: 30
    }
}))

const JoyStick = props => {
    const classes = useStyles()
    const { moveLeft, moveRight, moveUp, moveDown } = props
    return (
        <div className={classes.container}>
            <Left className={clsx(classes.btn, classes.left)} onClick={moveLeft} />
            <Right className={clsx(classes.btn, classes.right)} onClick={moveRight} />
            <Up className={clsx(classes.btn, classes.up)} onClick={moveUp} />
            <Down className={clsx(classes.btn, classes.down)} onClick={moveDown} />
        </div>
    )
}

export default JoyStick