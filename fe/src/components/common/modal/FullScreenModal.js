import React from 'react';
import clsx from 'clsx'
import { makeStyles, Button, Dialog, AppBar, Toolbar, 
    Typography, Slide } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'fixed',
        '& .MuiToolbar-regular': {
            minHeight: 45
        }
    },
    title: {
        flex: 1,
    },
    body: {
        padding: '45px 0 25px 0'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = props => {
    const classes = useStyles();
    const { isOpen, handleClose, title, children, className, btnText, btnClick, cancelText } = props

    return (
        <div className={clsx(className)}>
            <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        {btnText &&
                            <Button 
                                variant="contained"
                                onClick={btnClick || handleClose}
                                size="small"
                                color="secondary"
                                startIcon={<DoneIcon />}
                            >
                                {btnText}
                            </Button>
                        }
                        <Button 
                            color="inherit" 
                            onClick={handleClose}
                            size="small"
                        >
                           { cancelText || "Cancel" }
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className={classes.body}>
                    {children}
                </div>
            </Dialog>
        </div>
    );
}


export default FullScreenModal