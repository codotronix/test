import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TextField, Box, Grid, Button }  from '@material-ui/core'
import ComplexCard from '../../common/cards/ComplexCard'
import { ONLINE_DATA_SAVE_MY_TALES } from  '../../../redux/actionTypes'
import { GET_MYSTORIES, DELETE_MYTALE, getRoot } from '../../../utils/urls'
import { ajaxGet, ajaxPost } from '../../../utils/ajax'
import RefreshIcon from '@material-ui/icons/Refresh';
const { notify, showLoader, hideLoader } = window


const MyOnlineTales = props => {
    // const classes = useStyles()
    // const [localTales, setLocalTales] = useState([])
    const { history, authorEmail, myOnlineTales, cacheMyTales } = props
    const [filterTxt, setFilterTxt] = useState('')
    
    useEffect(() => {
        if(myOnlineTales.length > 0) return
        // if user logs in, check if he has any tales saved online
        if (authorEmail) {
            refreshOnlineTales()
        }
    }, 
    [authorEmail])

    const refreshOnlineTales = () => {
        showLoader()
        ajaxGet(GET_MYSTORIES)
        .then(res => {
            console.log(res.data);
            let { status, tales, msg, bannerImgRoot } = res.data
            if(status === 200) {
                tales = tales.map(tale => {
                    if(tale.info.imgUrl) {
                        tale.info.imgUrl = bannerImgRoot + '/' + tale.info.imgUrl
                    }
                    return tale
                })
                cacheMyTales(tales)
            }
            else {
                notify(msg)
            }
        })
        .finally(() => hideLoader())
    }

    const goTo = url => history.push(url)
    const goToTale = storyUrl => {
        window.location.href = '//' + getRoot() + '/read/' + storyUrl
    }
    const goToEditTale = id => goTo(`/edit-tale/${id}`)

    /**
     * When user wants to delet one of his online tale
     * @param {*} storyUrl 
     */
    const deleteTale = storyUrl => {
        if(!window.confirm("Are you sure you want to delete this tale? Once deleted, it may not be recovered back. (Better export and keep a copy before deleting ...)")) return
        showLoader()
        ajaxPost(DELETE_MYTALE, { storyUrl })
        .then(res => {
            const { status, msg } = res.data
            notify(msg)

            // if delete successfull
            // or not found (i.e. previously deleted)
            if(status === 200 || status === 1500) refreshOnlineTales()
        })
        .finally(() => hideLoader())
    }

    return (
        <Box py={3}>
            { !authorEmail &&
                <h2>Please login to see your online tales ...</h2>
            }
            { authorEmail && myOnlineTales.length <= 0 && 
                <h2>Sorry you do not have any tales saved online ...</h2>
            }
            {
                authorEmail && myOnlineTales.length > 0 && 
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <form noValidate autoComplete="off" className="filter-form">
                            <TextField 
                                placeholder="Type in to filter"
                                fullWidth
                                value={filterTxt}
                                onChange={e => setFilterTxt(e.target.value)}
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} className="text-right">
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={refreshOnlineTales}
                        >
                            Refresh
                        </Button>
                    </Grid>
                    {
                        myOnlineTales
                        .filter(t => 
                            Object.values(t.info).join(' ')
                            .toLocaleLowerCase()
                            .includes(filterTxt.toLocaleLowerCase())
                        )
                        .map (t => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={t.info.storyUrl}>
                                <ComplexCard 
                                    id={t.info.storyUrl}
                                    info={t.info}
                                    expandable={false} 
                                    handleReadTale={() => goToTale(t.info.storyUrl)}
                                    handleEdit={() => goToEditTale(t.info.storyUrl)}
                                    handleDelete={() => deleteTale(t.info.storyUrl)} 
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            }
        </Box>
    )
}

const mapStateToProps = state => ({
    myOnlineTales: state.od.myTales
})
const mapDispatchToProps = dispatch => ({
    cacheMyTales: tales => dispatch({type: ONLINE_DATA_SAVE_MY_TALES, payload: tales})
})
export default connect(mapStateToProps, mapDispatchToProps)(MyOnlineTales)