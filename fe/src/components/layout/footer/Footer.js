import React from 'react'
import clsx from 'clsx'
import { makeStyles, Typography, Box, Grid } from '@material-ui/core'
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import AndroidIcon from '@material-ui/icons/Android';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
        color: '#fff',
        padding: `${theme.spacing(5)}px ${theme.spacing(4)}px`
    },
    links: {
        '& a': {
            textDecoration: 'none',
            color: '#fff !important'
        }
    },
    iconLinks: {
        display: 'flex',
        '& svg': {
            fontSize: 27,
            marginRight: theme.spacing(1)
        }
    }
}))

const Footer = props => {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <p className="mt-0">
                        Reactale is what happens when literature embraces technology and comes to life. When a reader reads a Reactale (a.k.a Reactive Tale), the Reactale also reads back its reader and then reacts by magically altering itself depending on the reader's actions / decisions / sorroundings and other learnings that are made available to it about its reader.
                    </p>
                    <p>
                        REACTALE marks the birth of a NEW ERA of story telling, in search of a new way, a very REACTIVE one, where no longer will an immersive tale ONLY ENGAGE its readers, but it will INTERACT, and most importantly, it will REACT...
                    </p>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Connect
                        </Typography>
                        <ul className={clsx(classes.links, classes.iconLinks)}>
                            <li><a href="https://www.facebook.com/reactale"><FacebookIcon /></a></li>
                            <li><a href="https://twitter.com/ReactiveTales"><TwitterIcon /></a></li>
                            <li><a href="mailto:hello@reactale.com"><EmailIcon /></a></li>
                            <li title="Android app coming soon"><a><AndroidIcon /></a></li>
                        </ul>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="h5" gutterBottom>
                            Links
                        </Typography>
                        <ul className={classes.links}>
                            <li>
                                <a href="https://reacto.reactale.com/">Reacto</a>
                            </li>
                            <li>
                                <a href="/privacy-policy.html">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="/terms.html">Terms and Conditions</a>
                            </li>
                        </ul>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Footer