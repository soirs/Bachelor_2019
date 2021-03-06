import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

export default function NewUpdateReady() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleReload = () => {
    navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' })
    // window.postMessage({ action: 'skipWaiting' });
    console.error('pre REload')
    window.addEventListener('message', event => {
      
      if (event.data.action === 'skipWaiting') {
        console.log('', event.data)
        console.log('-->', event.data.action)
        console.log('->', event)
      }

    })
    window.location.reload()
  }

  React.useEffect(
    () => {
      handleOpen()
    }, []
  )

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">Ny version tilgængelig.</span>}
      action={[
        <Button key="undo" color="inherit" size="small" onClick={handleReload}>
          Opdater
          </Button>,
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
}
