import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import MDTypography from "components/MDTypography";
import FirebaseRealtimeDatabaseService from "../../services/firebase-realtime.service";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Transition = React.forwardRef(function Transition(
  props, ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function DeleteDialogComponent(props) {
  const databaseService = new FirebaseRealtimeDatabaseService();
  const volumeNo = Number(props.volumeNumber) - 1;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const handleClose = () => {
      props.setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    props.setIsLoading(true); 
    databaseService.delete(`/confirmation_registry/${volumeNo}/data/${props.entryID}`)
      .then((res) => {
        setOpenSnackbar(true);
      })
      .then((res) => {
        props.setIsLoading(false);
        props.setOpenDeleteDialog(false)
      })
      .catch((err) => props.setError(err));
  }  

  return (
    <>
      <Dialog
        open={props.openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle color="gray">Delete Action Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            <MDTypography variant="button" style={{color:"red"}} fontWeight="light">
              Are you sure you want to delete this entry?
            </MDTypography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{color: "red"}} onClick={handleDelete}>Delete</Button>
            <Button style={{color: "green"}} onClick={handleClose}>Close</Button>
          </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        message="This Snackbar will be dismissed in 5 seconds."
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Entry {volumeNo}/{props.entryID} successfully deleted
        </Alert>
      </Snackbar>
    </>
  );
}
