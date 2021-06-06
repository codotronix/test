import React, { useState, useEffect } from 'react'
import { Paper, Tab, Tabs, Box, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import MyLocalTales from './MyLocalTales'
import MyOnlineTales from './MyOnlineTales'
import { CONST_TITLE } from '../../../utils/constants'

const MyTales = props => {
    const [visibleTabIndex, setVisibleTab] = useState(0)
    const { history, authorEmail } = props
    
    const handleTabSwitch = (event, newValue) => {
        setVisibleTab(newValue)
    }

    useEffect(() => {
        document.title = 'My Tales | ' + CONST_TITLE

        // If user is logged in
        // then default tab is My Online Tales
        if (authorEmail) {
            setVisibleTab(1)
        }

        window.hideLoader()
    }, [])

    return (
        <Box py={2}>
            
            <Typography variant="h4" component="h1">
                My Tales
            </Typography>
            
            <Box mt={2} mb={4} className="flex-space-between">
                <Typography variant="subtitle1">
                    Here you will find all the tales created by you
                </Typography>
            </Box>

            <Paper square>
                <Tabs
                    value={visibleTabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabSwitch}
                    centered
                    aria-label="tabs to create the story"
                >
                    <Tab label="Local" />
                    <Tab label="Online" />
                </Tabs>
            </Paper>
            
            <Box className={visibleTabIndex !== 0 ? 'hide' : ''}>
                <MyLocalTales history={history}/>
            </Box>

            <Box className={visibleTabIndex !== 1 ? 'hide' : ''}>
                <MyOnlineTales history={history} authorEmail={authorEmail} />
            </Box>
        </Box>
    )
}

const mapStateToProps = state => ({
    authorEmail: state.user.email
})
export default connect(mapStateToProps)(MyTales)