import React, { useState } from 'react';
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
import { from, of, Subject } from 'rxjs';
import { catchError, finalize, timeout, retry, debounceTime, switchMap } from 'rxjs/operators';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteDialogComponent(props) {
  const databaseService = new FirebaseRealtimeDatabaseService();
  const volumeNo = Number(props.volumeNumber) - 1;
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // RxJS Subject to manage delete events
  const deleteSubject$ = new Subject();

  // Subscribe to deleteSubject$ to process delete requests reactively
  deleteSubject$
    .pipe(
      debounceTime(300), // Prevents multiple rapid requests
      switchMap(() => {
        props.setOpenDeleteDialog(false); // Close dialog immediately
        return from(databaseService.delete(`/baptism_registry/${volumeNo}/data/${props.entryID}`))
          .pipe(
            timeout(5000), // Cancel request if it takes longer than 5s
            retry(2), // Retry up to 2 times in case of failure
            catchError((error) => {
              console.error("Delete Error:", error);
              setSnackbarMessage(error.message || "Error deleting entry.");
              setSnackbarSeverity("error");
              props.setError(error);
              return of(null);
            }),
            finalize(() => {
              setOpenSnackbar(true);
            })
          );
      })
    )
    .subscribe(() => {
      setSnackbarMessage(`Entry ${volumeNo}/${props.entryID} successfully deleted`);
      setSnackbarSeverity("success");
    });

  const handleDelete = () => {
    if (!props.entryID || !props.volumeNumber) {
      setSnackbarMessage("Invalid entry ID or volume number.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    deleteSubject$.next(); // Triggers the delete action through RxJS
  };

  return (
    <>
      <Dialog
        open={props.openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => props.setOpenDeleteDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle color="gray">Delete Entry</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <MDTypography variant="button" style={{ color: "red" }} fontWeight="light">
              Are you sure you want to delete this entry?
            </MDTypography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ color: "red" }} onClick={handleDelete}>Delete</Button>
          <Button style={{ color: "green" }} onClick={() => props.setOpenDeleteDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
