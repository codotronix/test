import { TWindow, TUser, TNotif, TNotifLinkATaleRequest, E_NOTIF_NAME } from '../../../types'

import React, { Dispatch, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Paper, Box, Grid, Button, Typography, makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { USER_UPDATE } from '../../../redux/actionTypes'
import { EXEC_LINK_A_TALE } from '../../../utils/urls'
import { CONST_TITLE } from '../../../utils/constants'
import { ajaxPost } from '../../../utils/ajax'
// import { UPDATE_USERNAME, UPDATE_MYPROFILE } from '../../../utils/urls'
const { showLoader, hideLoader, notify } = window as TWindow


const useStyles = makeStyles(theme => ({
    notifBox: {
        marginTop: 25,
        '& .inner': {
            padding: "10px 15px"
        },
        '& .title': {
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& .ico': {
                fontSize: 16,
                border: '1px solid #ddd',
                height: 30,
                width: 30,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 7,
                color: '#fff',
                background: 'var(--primary-color)',
                borderRadius: 4
            },
            '& .date': {
                color: 'rgb(0 0 0 / 70%)',
                fontSize: 16
            }
        },
        '& .body': {
            lineHeight: '24px',
            '& a': {
                textDecoration: 'none'
            },
            '& .detailed-list': {
                margin: '20px 0 20px 20px',
                '& li': {
                    marginTop: 3,
                    '& .label': {
                        color: 'rgba(0 0 0 / 50%)',
                        fontWeight: 'bold',
                        marginRight: 5
                    }
                }
            }
        }
    }
}))

type TProps = {
    user: TUser
}

const Notifications = (props: TProps) => {
    const classes = useStyles()
    const [notifs, setNotifs] = useState([] as TNotif[])
    const { user } = props 

    useEffect(() => {
        document.title = 'Notifications | ' + CONST_TITLE
        hideLoader()
    }, [])

    useEffect(() => {
        setNotifs(user.notifs || [])
    },
    [user])

    const formatDate = (dateInMs: number) => {
        const d = new Date(dateInMs)
        return `${(d.getDate()).toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`
    }

    /**
     * 
     * @param { string } execCode 
     */
    const executeLinkATale = (id: string, execCode: 'APPROVE' | 'DENY') => {
        const isConfirmed = window.confirm(`Are you sure to ${execCode} ?`)

        if(isConfirmed) {
            showLoader()
            ajaxPost(EXEC_LINK_A_TALE, { id, execCode })
            .then(res => {
                const { status, msg, _id } = res.data

                // if the operation is successful,
                // the remove the id returned from the state
                if(_id) setNotifs(notifs.filter(n => n._id !== _id))

                notify(msg)
            })
            .catch(err => notify("Some error occurred ..."))
            .finally(() => hideLoader())
        }
        
    }
    

    return (
        <Box py={2}>
            <Typography variant="h4" component="h1">
                Notifications
            </Typography>

            <Box mt={2}>
                Currently you have {notifs.length} notification(s)!
            </Box>

            <Box mt={2}>
            {
                notifs.map(notif => <div className={classes.notifBox}>
                    <Paper className="inner" elevation={3}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className="title">
                                {
                                    notif.name === E_NOTIF_NAME.LINK_A_TALE_REQUEST && 
                                    <span>
                                        <i className="fas fa-code-branch ico"></i>
                                        <span>Link A Tale</span>
                                    </span>
                                }
                                <span className="date">
                                    {formatDate(notif.doC)}
                                </span>
                            </Grid>

                            <Grid item xs={12} className="body">
                                {
                                    notif.name === E_NOTIF_NAME.LINK_A_TALE_REQUEST && 
                                    <>
                                        <p>
                                            Hey, you have got a link request !!!
                                        </p>
                                        <p>
                                            <ul className="detailed-list">
                                                <li>
                                                    <span className="label">Sender: </span>
                                                    <a href={`/user/${(notif as TNotifLinkATaleRequest).requestorID}`}>
                                                        {(notif as TNotifLinkATaleRequest).requestorName}
                                                    </a>
                                                </li>
                                                <li>
                                                    <span className="label">From Story: </span>
                                                    <span>{(notif as TNotifLinkATaleRequest).fromStoryName}</span>
                                                </li>
                                                <li>
                                                    <span className="label">From Storylet ID: </span>
                                                    <span>{(notif as TNotifLinkATaleRequest).fromStID}</span>
                                                </li>
                                                <li>
                                                    <span className="label">Start point: </span>
                                                    <a href={`${(notif as TNotifLinkATaleRequest).fromUrl}`} target="_blank">
                                                        Click here to see
                                                    </a>
                                                </li>
                                                <li>
                                                    <span className="label">Choice text: </span>
                                                    <span>{(notif as TNotifLinkATaleRequest).choiceTxt}</span>
                                                </li>
                                                <li>
                                                    <span className="label">End point: </span>
                                                    <a href={`${(notif as TNotifLinkATaleRequest).toUrl}`} target="_blank">
                                                        Click here to see
                                                    </a>
                                                </li>
                                            </ul>
                                        </p>
                                        
                                        <div className="text-right">
                                            <Button 
                                                variant="contained" 
                                                color="primary"
                                                onClick={() => executeLinkATale(notif._id, 'APPROVE')}
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                color="primary" 
                                                className="ml-5"
                                                onClick={() => executeLinkATale(notif._id, 'DENY')}
                                            >
                                                Deny
                                            </Button>
                                        </div>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </div>)
            }
            </Box>

        </Box>
    )
}

const mapStateToProps = (state: { user: TUser }) => ({
    user: state.user
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    updateUser: (user: TUser) => dispatch({ type: USER_UPDATE, payload: { user } })
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)