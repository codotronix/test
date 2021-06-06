import React, { useState, useEffect } from 'react'
import { TextField, Box, Grid}  from '@material-ui/core'
import ComplexCard from '../../common/cards/ComplexCard'
import { LOCAL_TALE_IDENTIFIER } from '../../../utils/constants'
import { getOfflineSavedTales, deleteOneOfflineSavedTales } from '../../../services/offlinesavedtales.service'
const notify = window['notify']

const MyLocalTales = props => {
    // const classes = useStyles()
    const [localTales, setLocalTales] = useState([])
    const [filterTxt, setFilterTxt] = useState('')
    const {history} = props
    
    const localLocalTales = () => {
        const allReactales = getOfflineSavedTales()
        setLocalTales(Object.values(allReactales))
    }

    useEffect(() => {
        localLocalTales()
    }, [])

    const goTo = url => history.push(url)
    const goToTale = id => goTo(`/preview/${LOCAL_TALE_IDENTIFIER}${id}`, '/preview/[id]')
    const goToEditTale = id => goTo(`/edit-tale/${LOCAL_TALE_IDENTIFIER}${id}`, '/edit-tale/[id]')

    const deleteTale = id => {
        if(!window.confirm('Are you sure you want to delete this local tale. It can not be recovered later (unless you have exported it and import it later)')) return
        
        let allReactales = deleteOneOfflineSavedTales(id)
        setLocalTales(Object.values(allReactales))
        notify('Local tale deleted successfully')
    }

    return (
        <Box py={3}>
            <Grid container spacing={2}>
                {
                    localTales.length <= 0 &&
                    <h2>Oops! Looks like you have not saved any tales in your local device</h2>
                }
                {
                    localTales.length > 0 &&
                    <>  
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
                        {
                            localTales
                            .filter(t => 
                                Object.values(t.info).join(' ')
                                .toLocaleLowerCase()
                                .includes(filterTxt.toLocaleLowerCase())
                            )
                            .map (t => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
                                    <ComplexCard 
                                        // id={t.id}
                                        info={t.info} 
                                        expandable={false} 
                                        handleReadTale={() => goToTale(t.id)}
                                        handleEdit={() => goToEditTale(t.id)}
                                        handleDelete={() => deleteTale(t.id)}  />
                                </Grid>
                            ))
                        }
                    </>
                }
            </Grid>
        </Box>
    )
}

export default MyLocalTales