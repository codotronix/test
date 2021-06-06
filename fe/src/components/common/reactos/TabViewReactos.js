import React, { useState, useEffect, createRef } from 'react'
import clsx from 'clsx'
import { makeStyles, Box, Button } from '@material-ui/core'
import allReactos from './reactosDef'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
const notify = window['notify']

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative'
    },
    cats: {
        border: `1px solid ${theme.palette.primary.main}`,
        display: 'inline-block',
        fontSize: 15,
        margin: 3,
        padding: '5px 10px',
        borderRadius: 2,
        lineHeight: '15px',
        cursor: 'default',
        // color: '#fff',
        // background: '#fff',
        '&.selected': {
            background: theme.palette.primary.main,
            color: '#fff'
        }
    },
    indieReacto: {
        boxShadow: '0px 1px 3px 1px #a9a9a9',
        padding: 15,
        margin: '20px 0',
        '& .desc': {
            color: 'rgba(0, 0, 0, .6)'
        },
        '& .reacto': {
            fontSize: 16,
            fontWeight: 700,
            fontFamily: '"Courier New", Courier, monospace',
            display: 'flex',
            alignItems: 'center',
            '& .token': {
                // color: theme.palette.primary.main,
                color: 'rgba(0, 0, 0, .8)',
                marginRight: 5
            }
        }
    },
    invisible: {
        position: 'absolute',
        left: -1000
    }
}))

const TabViewReactos = props => {
    const classes = useStyles()
    const { tryOut } = props
    const [catList, setCatList] = useState([])
    const [rtoCatWise, setRtoCatWise] = useState({})
    const [activeCat, setActiveCat] = useState('All')

    const inputRef = createRef() 
    
    useEffect(() => {
        let catList = ['All']
        let reactoCategoryWise = { 'All': [] }

        for (let r of allReactos) {
            let cat = r.token.substr(4)
            cat = cat.substring(0, cat.indexOf('.'))
            if (catList.indexOf(cat) < 0) catList.push(cat)

            //add reacto to categoryWise storage
            reactoCategoryWise[cat] = reactoCategoryWise[cat] || []
            reactoCategoryWise[cat].push(r)

            //all will have a ref to all of those reactos
            reactoCategoryWise['All'].push(r)
        }

        setCatList(catList)
        setRtoCatWise(reactoCategoryWise)
    }, [])

    const copyReacto = rto => {
        console.log(rto)
        console.log(inputRef)
        inputRef.current.value = rto
        inputRef.current.select()
        inputRef.current.setSelectionRange(0, 99999)
        document.execCommand("copy")

        notify('Reacto copied to clipboard')

    }

    return (
        <Box px={1} className={classes.root}>
            <input type="text" ref={inputRef} className={classes.invisible} />

            <Box mt={2}>
            {
                catList.length > 0 && catList.map(c =>
                    <span key={c}
                        onClick={() => setActiveCat(c)}
                        className={clsx(classes.cats, (activeCat === c) && 'selected')}
                    >
                        {c}
                    </span>
                )
            }
            </Box>

            <p>Showing "{`${activeCat}`}" Reactos</p>

            <Box>
                {
                    rtoCatWise[activeCat] && rtoCatWise[activeCat].map(r =>
                        <div className={classes.indieReacto} key={r.token}>
                            <div className="reacto">
                                <span className="token">{r.token}</span>
                            </div>
                            <hr />
                            <div className="desc">{r.desc}</div>
                            <div className="text-right mt-15">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={()=>copyReacto(r.token)}
                                    startIcon={<FileCopyIcon />}
                                >
                                    Copy 
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    className="ml-5"
                                    onClick={() => tryOut(r.test.replace(/ +/g, ' '))}
                                    endIcon={<DoubleArrowIcon />}
                                >
                                    Try 
                                </Button>
                            </div>
                            
                        </div>
                    )
                }
            </Box>
        </Box>
    )
}

export default TabViewReactos