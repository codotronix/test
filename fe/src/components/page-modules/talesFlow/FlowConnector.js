import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    connector: {
        strokeWidth: 4,
        stroke: red[200]
    },
    cid: {
        fontSize: 16,
        fontWeight: 'bold',
        fill: red[500]
    },
    selectedConnector: {
        '& line': {
            stroke: red[900]
        },
        '& text': {
            fill: '#000'
        }
    }
}))

const FlowConnector = props => {
    const classes = useStyles()
    const { c, selectedObj, handleSelection } = props
    const markSelected = e => {
        e.stopPropagation()
        handleSelection(c.cid, 'CH')
    }
    return (
        <g 
            className={clsx((c.cid === selectedObj.id && 'CH' === selectedObj.type) && classes.selectedConnector)}
            onClick={markSelected}
        >
            
            <line 
            id={c.id}
            x1={c.x1} y1={c.y1} 
            x2={c.x2} y2={c.y2}
            className={classes.connector}>
            </line>

            <text className={classes.cid} 
            x={(c.x1 + c.x2) / 2} 
            y={(c.y1 + c.y2) / 2}>
                {c.cid}
            </text>
        </g>
    )
}

export default FlowConnector