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

export default function CreateNewVolumeComponent(props) {
  const databaseService = new FirebaseRealtimeDatabaseService();
  const volumeNo = Number(props.numberOfVolumes) + 1;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const handleClose = () => {
      props.setOpenCreateNewVolumeDialog(false);
  };

  const handleSubmit = () => {
    props.setIsLoading(true);
    databaseService.create(`/baptism_registry/${volumeNo - 1}/`, {volume: volumeNo})
      .then((res) => {
        setOpenSnackbar(true);
        // props.fetchVolumeDataFromBackend(volumeNo - 1);
      }) 
      .then((res) => {
          props.setIsLoading(false);
          props.setOpenCreateNewVolumeDialog(false)
          props.setVolumeNumber(volumeNo);
          props.setNumberOfVolumes(volumeNo)
      })
      .catch((err) => props.setError(err));
  }

  return (
    <>
       <Dialog
        open={props.openCreateNewVolumeDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle color="gray">Create Volume {volumeNo} </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            <MDTypography variant="button" style={{color:"green"}} fontWeight="light">
            Are you sure you want to create a new volume in the Database?
            <br/>
            <i style={{color:"orange"}}>NB: This action cannot be undone</i>
            </MDTypography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{color: "green"}} onClick={handleSubmit}>Create</Button>
            <Button style={{color: "red"}} onClick={handleClose}>Close</Button>
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
          Volume {Number(volumeNo) -1} successfully created
        </Alert>
      </Snackbar>
    </>
  );
}
