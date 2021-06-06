import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Grid, Button } from '@material-ui/core'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { config } from '../../../utils/urls'
import UpArrow from '@material-ui/icons/KeyboardArrowUp'
import DownArrow from '@material-ui/icons/KeyboardArrowDown'

const useStyles = makeStyles(theme => ({
    bannerImg: {
        maxWidth: '100%',
        maxHeight: 300,
        margin: '0 auto',
        display: 'block',
        background: '#000',
        borderRadius: 4
    },
    titleLine: {
        fontSize: 25,
        margin: '0 0 10px 0'
    },
    genre: {
        borderTop: '1px solid #d5000040',
        paddingTop: 10,
        marginTop: 5
    },
    tags: {
        listStyle: 'none',
        padding: '5px 0 0',
        margin: 0,
        '& > li': {
            padding: '3px 8px',
            margin: '2px 3px',
            background: 'rgba(213, 0, 0, 0.6)',
            color: '#fff',
            fontSize: 12,
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center'
        },
        '& > li > svg': {
            fontSize: 15,
            marginRight: 3
        }
    },
    descSec: {
        position: 'relative',
        margin: '30px 0',
        borderTop: '1px solid #d5000040',
        borderBottom: '10px solid #ffcdd2',
        '& .ico': {
            position: 'absolute',
            top: 25,
            right: 0
        },
        '& .desc': {
            display: 'none'
        },
        '&.open .desc': {
            display: 'block'
        }
    }
}))


const Banner = props => {
    const classes = useStyles()
    const [isDescOpen, setDescOpen] = useState(false)
    const { info, isCutomizable, onCustomize } = props
    
    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <img src={info.imgUrl ? `/ups/banners/${info.imgUrl}` : config.defaultImg} className={classes.bannerImg} alt="Tale Banner Image" />
                </Grid>
                <Grid item xs={12} md={5}>
                    <h1 className={classes.titleLine}>
                        <span>{info.name}</span>
                    </h1>
                    <div>
                        <div>{info.authorDisplayName || 'Reactale Author'}</div>
                        <div className={classes.genre}>Genre: {info.genre}</div>

                        <ul className={classes.tags}>
                            {
                                (Array.isArray(info.tags) ? info.tags : info.tags.split(',')).map(tag =>
                                    <li key={tag}>
                                        <LocalOfferIcon />
                                        {tag}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <div>
                        { isCutomizable &&
                        <Button
                            variant="outlined"
                            color="primary"
                            className="mt-15"
                            fullWidth
                            size="small"
                            onClick={onCustomize}
                        >
                            Customize and Gift
                        </Button>
                        }
                    </div>
                </Grid>
            </Grid>
            <div className={clsx(classes.descSec, isDescOpen && 'open')}>
                <h2 onClick={() => setDescOpen(!isDescOpen)}>Description</h2>
                <span className="ico">
                    {isDescOpen && <UpArrow className='up' />}
                    {!isDescOpen && <DownArrow className='down' />}
                </span>
                <p className="desc">{info.description}</p>
            </div>
        </div>
    )
}

export default Banner