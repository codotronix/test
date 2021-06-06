import React from 'react'
import clsx from 'clsx'
import { makeStyles, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'

const useStyles = makeStyles(theme => ({
  titleBar: {
    margin: 0,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: `${theme.spacing(.5)}px ${theme.spacing(1)}px`,
    fontSize: theme.typography.pxToRem(20),
    minWidth: 300
  },
  modalBody: {
    padding: `${theme.spacing(2)}px`
  },
  closeIco: {
    position: "absolute",
    top: 3,
    right: 2,
    boxSizing: 'content-box',
    padding: '5px 7px',
    color: '#fff',
    cursor: 'pointer'
  }
}))

const SimpleModal = props => {
  const classes = useStyles();
  const { isOpen, handleClose, title, children, className } = props

  return (
    <div className={clsx(className)}>
      <Dialog open={isOpen} onClose={handleClose}
        aria-labelledby={`form-dialog-${title}`}
      >
        <DialogTitle className={classes.titleBar}>
          <CancelIcon className={classes.closeIco} onClick={handleClose}/>
          {title}
        </DialogTitle>
        <DialogContent className={classes.modalBody}>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SimpleModal




















// import React from 'react'
// import { makeStyles } from '@material-ui/core/styles'
// import clsx from 'clsx'
// import CancelIcon from '@material-ui/icons/Cancel'
// import Modal from '@material-ui/core/Modal'

// const useStyles = makeStyles(theme => ({
//   modalWrapper: {
//     overflow: "auto"
//   },
//   modalBox: {
//     position: 'relative',
//     width: 'calc(100vw - 200px)',
//     margin: 'calc(100vh / 5) auto',
//     minWidth: 300,
//     backgroundColor: theme.palette.background.paper,
//     border: `5px double ${theme.palette.primary.main}`,
//     boxShadow: theme.shadows[5]
//   },
//   titleBar: {
//     margin: 0,
//     backgroundColor: theme.palette.primary.main,
//     color: '#fff',
//     padding: `${theme.spacing(.5)}px ${theme.spacing(1)}px`,
//     fontSize: theme.typography.pxToRem(20)
//   },
//   modalBody: {
//     padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`
//   },
//   closeIco: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     boxSizing: 'content-box',
//     padding: '5px 7px',
//     color: '#fff',
//     cursor: 'pointer'
//   }
// }))

// // const getDynamicStyle = () => ({
// //   width: `${window.innerWidth - 200}px`,
// //   margin: `${window.innerHeight / 5}px auto`
// // })

// const SimpleModal = props => {
//   const classes = useStyles();
//   const { isOpen, handleClose, title, children, className } = props
  
//   return (
//       <Modal
//         aria-labelledby={title}
//         aria-describedby={title}
//         className={classes.modalWrapper}
//         open={!!isOpen}
//         onClose={handleClose}
//       >
//         <div className={clsx(classes.modalBox, className)}>
//           <CancelIcon className={classes.closeIco} onClick={handleClose}/>
//           <h2 className={classes.titleBar}>{title}</h2>
//           <div className={classes.modalBody}>
//             {children}
//           </div>
//         </div>
//       </Modal>
//   );
// }

// export default SimpleModal
