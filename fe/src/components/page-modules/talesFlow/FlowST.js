import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { 
    FLOW_ST_WIDTH, 
    FLOW_ST_HEIGHT,
    FLOW_KNOW_RAD,
    FLOW_KNOT_IN_X,
    FLOW_KNOT_IN_Y,
    FLOW_KNOT_OUT_X,
    FLOW_KNOT_OUT_Y
} from '../../../utils/constants'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    cg: {
        transform: "translate(100px, 100px)"
    },
    knot: {
        fill: red[500],
        strokeWidth: 1,
        stroke: red[500]
    },
    selectedKnot: {
        // fill: '#000',
        strokeWidth: 3,
        stroke: '#000'
    },
    selectedEl: {
        stroke: '#00f'
    },
    rect: {
        fill: "#fff",
        strokeWidth: 1,
        stroke: theme.palette.primary.main
    },
    selectedST: {
        '& rect': {
            fill: red[500],
            stroke: red[500]
        },
        '& text': {
            fill: '#fff'
        }
    },
    title: {
        fontSize: 14
    },
    stid: {
        fontSize: 14,
        fill: "#000"
    }
}))

const FlowST = props => {
    const classes = useStyles()
    const { stid, title, transformStyle, start, selectedObj, handleSelection, handleMouseDown, handleMouseUp, handleMouseMove } = props
    const markSelected = (e, type) => {
        e.stopPropagation()
        handleSelection(stid, type)
    }
    return (
        <g 
            id={stid} 
            className={classes.cg} 
            style={transformStyle}
            onMouseDown={e => handleMouseDown(e, stid)}
            onMouseUp={e => handleMouseUp(e)}
            onMouseMove={e => handleMouseMove(e)}
        >

            {(stid === start) && <text x="55" y="-3" fill="blue">START</text>}
            
            {(stid !== start) 
                && 
                <circle 
                    className={clsx(classes.knot, ((selectedObj.id===stid && 'IN'===selectedObj.type) && classes.selectedKnot))} 
                    cx={FLOW_KNOT_IN_X} 
                    cy={FLOW_KNOT_IN_Y} 
                    r={FLOW_KNOW_RAD}
                    onClick={e => markSelected(e, 'IN')}
                >
                </circle>}
            
            <circle 
                className={clsx(classes.knot, ((selectedObj.id===stid && 'OUT'===selectedObj.type) && classes.selectedKnot))} 
                cx={FLOW_KNOT_OUT_X} 
                cy={FLOW_KNOT_OUT_Y} 
                r={FLOW_KNOW_RAD}
                onClick={e => markSelected(e, 'OUT')}
            >
            </circle>
            
            <g className={clsx((selectedObj.id===stid && 'ST'===selectedObj.type) && classes.selectedST)} onClick={e => markSelected(e, 'ST')}>
                <rect 
                    className={classes.rect}
                    width={FLOW_ST_WIDTH} 
                    height={FLOW_ST_HEIGHT}>
                </rect>

                <text x="5" y="15" className={classes.title}>{title.substr(0, 20) || 'Click Edit to add text'}</text>
                <text x="5" y="30" className={classes.title}>{title.substr(20, 20)}</text>
                {/* <text x="5" y="32" class="title el">{st.title.substr(44, 22)}</text> */}

                <text x="5" y="45" className={classes.stid}>{stid}</text>
            </g>
        </g>
    )
}

export default FlowST