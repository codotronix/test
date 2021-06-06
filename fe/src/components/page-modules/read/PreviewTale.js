import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Box, TextField, Button, Grid, makeStyles } from '@material-ui/core'
import { LOCAL_TALE_IDENTIFIER, CONST_TITLE } from '../../../utils/constants'
import { GET_STORY } from "../../../utils/urls";
import { ajaxGetWPathParams } from '../../../utils/ajax'
import Banner from './Banner'
import SimpleModal from '../../common/modal/SimpleModal'
import {Accordion} from '../../common/misc'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { getOneOfflineSavedTales } from '../../../services/offlinesavedtales.service'
const notify = window['notify']

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative'
    },
    backBtn: {
        position: 'absolute',
        top: 18,
        left: 2,
        width: 32,
        height: 34,
        borderRadius: '50%',
        background: theme.palette.primary.main,
        color: '#fff'
    }
}))

const PreviewTale = props => {
    const [tale, setTale] = useState(null)
    // const [sb, setSB] = useState([])    // sb = Storyboard, sbI[], sbI = { stID, selectedCID }
    const { match, history } = props
    const classes = useStyles()
    // const goTo = (url, as) => history ? history.push(url) : NextRouter.push(as || url, url)
    const [customVars, setCustomVars] = useState({})
    const [isCstmModalVisible, setIsCstmModalVisible] = useState(false)
    const [modifiedVars, setModifiedVars] = useState({})

    // Update the Page Title    
    useEffect(() => {
        document.title = 'Preview Tale | ' + CONST_TITLE
    }, [])

    /**
     * When user is entering new value for custom variables
     */
    const onChangeMVar = e => {
        setModifiedVars({
            ...modifiedVars,
            [e.target.name]: e.target.value
        })
    }

    const applyChangedVars = () => {
        window.rto.setAllVars(modifiedVars)
        //LET THE DOM STABILIZE
        setTimeout(() => {
            window.rto.createTimeline('timelineContainer', tale)
        }, 500)
        notify('Customization successfull ...')
        setIsCstmModalVisible(false)
    }

    const addStoredReactos = tale => {
        if(tale.reactos && tale.reactos.vars) {
            /**
             * tale.reactos.vars has a structure of
             * vars = {
             *  k1: {
             *       name: 'k1', value: 'v1', userCustomizable: true / false
             *      },
             *  k2: {
             *       name: 'k2', value: 'v2', userCustomizable: true / false
             *      }
             * 
             * we need to convert it to
             * vars = { k1: 'v1', k2: 'v2' }
             */
            let vars = {}
            let customizableVars = {}
            Object.values(tale.reactos.vars).forEach(v => {
                vars[v.name] = v.val

                // also pickup the customizable vars
                if (v.userCustomizable) {
                    customizableVars[v.name] = v
                }
            })
            setCustomVars(customizableVars)
            window.rto.setAllVars(vars)
        }
    }

    useEffect(() => {
        // let storyUrl = match.params.id
        let storyUrl = match.params.id
        // If it is a local story
        // Then the ID should start with "local"
        if (storyUrl.indexOf(LOCAL_TALE_IDENTIFIER) >= 0) {
            storyUrl = storyUrl.trim().replace(LOCAL_TALE_IDENTIFIER, "")
            const theTale = getOneOfflineSavedTales(storyUrl)
            // console.log(theTale)
            setTale(theTale)
            // setSB([{ stID: theTale.id }])
            addStoredReactos(theTale)
            // if(theTale.reactos && theTale.reactos.vars) {
            //     window.rto.setAllVars(theTale.reactos.vars)
            // }

            //LET THE DOM STABILIZE
            setTimeout(() => {
                document.title = `Preview Tale | ${theTale.info.name} | ` + CONST_TITLE
                window.rto.createTimeline('timelineContainer', theTale)
                window.hideLoader()
            }, 500)
        }

        // Else fetch it online
        else {
            window.showLoader()
            ajaxGetWPathParams(GET_STORY, [storyUrl])
            .then(res => {
                // console.log(res.data)
                let {status, tale, msg} = res.data
                // console.log(wrapperTale)
                if(status === 200) {
                    // let tale = wrapperTale.tale
                    // tale = JSON.parse(tale)
                    // console.log(tale)
                    setTale(tale)
                    addStoredReactos(tale)
                    // if(tale.reactos && tale.reactos.vars) {
                    //     window.rto.setAllVars(tale.reactos.vars)
                    // }

                    //LET THE DOM STABILIZE
                    setTimeout(() => {
                        document.title = `Preview Tale | ${tale.info.name} | ` + CONST_TITLE
                        window.rto.createTimeline('timelineContainer', tale)
                    }, 500)
                }
                else {
                    // console.log("most probably some error occurred")
                    notify(msg)
                }
            })
            .catch(err =>{
                console.log(err)
            })
            .finally(() => window.hideLoader())
        }
    },
    [match])

    const goBack = () => history.goBack()

    if(!tale) return <div>Loading tale ...</div>

    return (
        <Box py={2} mb={5} className={clsx(classes.root, 'dev-mode')}>
            {
                <Banner 
                    info={tale.info} 
                    isCutomizable={Object.values(customVars).length > 0}
                    onCustomize={() => setIsCstmModalVisible(true)}
                />
            }

            <KeyboardBackspaceIcon onClick={goBack} className={classes.backBtn} />

            <h2>{tale.info.name}</h2>
            <div id="timelineContainer"></div>

            {/* Gift a tale feature */}
            <SimpleModal 
                isOpen={isCstmModalVisible}
                handleClose={() => setIsCstmModalVisible(false)}
                title="Gift-a-Tale"
                // className={classes.loginModal}
            >
                {
                    Object.values(customVars).map( (cv, i) => (
                        <Accordion title={'Custom Variable ' + (i+1) } className="mt-5" key={cv.name}>
                            <Box>{cv.helptext}</Box>
                            <Box mt={1}>Current Value: {cv.val}</Box>
                            <Box mt={1}>
                                <div>New Value</div>
                                <TextField
                                    multiline
                                    name={cv.name}
                                    rows="2"
                                    variant="outlined"
                                    fullWidth
                                    value={modifiedVars[cv.name]}
                                    onChange={onChangeMVar}
                                />
                            </Box>
                        </Accordion>
                    ))
                }

                <Grid container spacing={1}>
                        <Grid item xs>
                            <Button
                                variant="contained"
                                color="primary"
                                className="mt-15"
                                fullWidth
                                size="small"
                                onClick={applyChangedVars}
                            >
                                Apply
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button
                                variant="contained"
                                color="primary"
                                className="mt-15"
                                fullWidth
                                size="small"
                                onClick={() => notify('Sorry, this feature is not available in Preview Mode')}
                            >
                                Get URL
                            </Button>
                        </Grid>
                    </Grid>
                
            </SimpleModal>
            
        </Box>
    )
}

export default PreviewTale