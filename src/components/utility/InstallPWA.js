import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import shareSVG from "../Assets/AppleShare.svg";

export default function InstallPWA() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    useEffect(
    () => {
      handleClickOpen()
    }, []
  )

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Installer Digital Revisor</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            1. Tryk på
            <img
              src={shareSVG}
              style={{ margin: "-5px -5px -10px 0px" }}
              className=""
              alt="Add to homescreen"
              height="40"
              width="40"
            />
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            2. "Føj til hjemmeskærm"
        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Luk
          </Button>
        </DialogActions>
      </Dialog>
  );
}
