import React, { Dispatch } from 'react'
import clsx from 'clsx'
import { ajaxPost } from '../../../utils/ajax'
import { makeStyles, Container, Box, Grid, FormControlLabel, Checkbox, Button } from '@material-ui/core'
import { InfoCard } from '../../common/cards'
import featureText from './exportFeatureText'
import { Li } from '../../common/misc'
import { PUB_UNPUB } from '../../../utils/urls'
import { connect } from 'react-redux'
import { TALE_PUBLISH, TALE_UNPUBLISH } from '../../../redux/actionTypes'
import { TWindow, TReactale } from '../../../types'
import { E_SAVE_TYPES } from '../../../types/enums'

const useStyles = makeStyles(theme => ({
    cardHeaders: {
        fontWeight: 500,
        margin: 0,
        textAlign: 'center',
        color: theme.palette.primary.main
    },
    cardContainer: {
        marginTop: theme.spacing(3)
    },
    cardInfo: {
        padding: '0 10px',
        marginTop: 3
    },
    pubSec: {
        borderTop: `1px solid ${theme.palette.primary.main}`,
        marginTop: 60,
        paddingTop: 5
    },
    btnContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}))

type Props = {
    exportWIPTale: () => void
    saveTaleOnline: () => void
    saveTaleLocal: () => void
    markSaveDefault: (saveType: E_SAVE_TYPES) => void
    publish: () => void
    unpublish: () => void
    tale: TReactale
    saveDefault: E_SAVE_TYPES
}

const CreateTaleFinish = (props: Props) => {
    const classes = useStyles()
    const { exportWIPTale, saveTaleOnline, saveTaleLocal, saveDefault, 
        markSaveDefault, tale, publish, unpublish } = props
    const { notify }  = window as TWindow

    const togglePublish = () => {
        if(!tale.info.storyUrl) {
            notify('The story must be saved online once before publishing')
            return
        }

        let data = {
            storyUrl: tale.info.storyUrl,
            isPublished: !tale.isPublished
        }
        ajaxPost(PUB_UNPUB, data)
        .then(res => {
            const { status, msg } = res.data
            if(status === 200) {
                if(data.isPublished) {
                    publish()
                    notify("Published successfully")
                }
                else {
                    unpublish()
                    notify("Unpublished successfully")
                }
            }
            else {
                notify(msg)
            }
        })
        .catch(err => {
            notify('Some error occured')
            console.log(err)
        })
    }
    
    return (
        <Box pb={10}>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    
                    <Grid item xs={12} md={4} className={classes.cardContainer}>
                        <InfoCard>
                            <h2 className={classes.cardHeaders}>Save Offline</h2>
                            <span className={classes.cardInfo}>{featureText.saveLocal.desc}</span>
                            
                            <Box my={1}>
                                <FormControlLabel
                                    control={<Checkbox checked={saveDefault === E_SAVE_TYPES.OFFLINE} onChange={() => markSaveDefault(E_SAVE_TYPES.OFFLINE)} name="OFFLINE" />}
                                    label="Set as default"
                                />
                            </Box>

                            <div className="fillmid">
                                <h3 className={classes.cardHeaders}>Pros &amp; Cons</h3>
                                <ul className="">
                                    {
                                        featureText.saveLocal.features.map( t => 
                                            <Li key={t}>{t}</Li>
                                        )
                                    }
                                </ul>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveTaleLocal}
                            >
                                Save Offline
                            </Button>
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={4} className={classes.cardContainer} >
                        <InfoCard>
                            <h2 className={classes.cardHeaders}>Save Online</h2>
                            <span className={classes.cardInfo}>{featureText.saveOnline.desc}</span>
                            
                            <Box my={1}>
                                <FormControlLabel
                                    control={<Checkbox checked={saveDefault === E_SAVE_TYPES.ONLINE} onChange={() => markSaveDefault(E_SAVE_TYPES.ONLINE)} name="ONLINE" />}
                                    label="Set as default"
                                />
                            </Box>

                            <div className="fillmid">
                                <h3 className={classes.cardHeaders}>Pros &amp; Cons</h3>
                                <ul className="">
                                    {
                                        featureText.saveOnline.features.map( t => 
                                            <Li key={t}>{t}</Li>
                                        )
                                    }
                                </ul>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveTaleOnline}
                            >
                                Save Online
                            </Button>
                        </InfoCard>
                    </Grid>
                    
                    <Grid item xs={12} md={4} className={classes.cardContainer}>
                        <InfoCard>
                            <h2 className={classes.cardHeaders}>Export Reactale</h2>
                            <span className={classes.cardInfo}>{featureText.exportTale.desc}</span>
                            
                            <Box my={1}>
                                <FormControlLabel
                                    control={<Checkbox checked={saveDefault === E_SAVE_TYPES.EXPORT} onChange={() => markSaveDefault(E_SAVE_TYPES.EXPORT)} name="EXPORT" />}
                                    label="Set as default"
                                />
                            </Box>

                            <div className="fillmid">
                                <h3 className={classes.cardHeaders}>Pros &amp; Cons</h3>
                                <ul className="">
                                    {
                                        featureText.exportTale.features.map( t => 
                                            <Li key={t}>{t}</Li>
                                        )
                                    }
                                </ul>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={exportWIPTale}
                            >
                                Export
                            </Button>
                        </InfoCard>
                    </Grid>
                </Grid>
            </Container>
            <Box className={clsx(!tale.info.storyUrl && 'hidden', classes.pubSec)}>
                <h2>Publish / Unpublish</h2>
                <p>
                Your story will be visible to others only when you publish it. You can publish / unpublish your story anytime you want after your first online save.
                </p>
                
                <div className={classes.btnContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className=""
                        onClick={togglePublish}
                    >
                        { !tale.isPublished && <>Publish</> }
                        { tale.isPublished && <>Un-publish</> }
                    </Button>
                </div>
                
            </Box>
        </Box>
    )
}
const mapStateToProps = (state: { wipTale: TReactale }) => ({
    tale: state.wipTale
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    publish: () => dispatch({type: TALE_PUBLISH}),
    unpublish: () => dispatch({type: TALE_UNPUBLISH})
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateTaleFinish)