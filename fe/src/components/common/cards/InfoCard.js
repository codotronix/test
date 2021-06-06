import React from 'react'
import { makeStyles, Card } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '8px 16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
    margin: '10px auto',
    borderTop: `5px solid ${theme.palette.primary.main}`,
    '& .fillmid': {
        flexGrow: 1,
        marginBottom: 10
    }
  }
}));

const InfoCard = props => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
        {props.children}
    </Card>
  );
}

export default InfoCard
