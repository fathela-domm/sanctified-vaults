import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FirebaseRealtimeDatabaseService from "../../services/firebase-realtime.service";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    paddingLeft: "27px"
};

export default function CreateDialogComponent(props){
    const [name, setName] = React.useState("");
    const [serialNumber, setSerialNumber] = React.useState("");
    const [baptismalSerialNumber, setBaptismalSerialNumber] = React.useState("");
    const [baptismalDate, setBaptismalDate] = React.useState("");
    const [baptismalPlace, setBaptismalPlace] = React.useState("");
    const [confirmationDate, setConfirmationDate] = React.useState("");
    const [confirmationPlace, setConfirmationPlace] = React.useState("");
    const [dob, setDob] = React.useState("");
    const [mothersName, setMothersName] = React.useState("");
    const [fathersName, setFathersName] = React.useState("");
    const [godParentsName, setGodParentsName] = React.useState("");
    const [domicile, setDomicile] = React.useState("");
    const [minister, setMinister] = React.useState("");
    const [remarks, setRemarks] = React.useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const firebaseDatabaseService = new FirebaseRealtimeDatabaseService();
    const volumeNo = Number(props.volumeNumber) - 1;

    const handleSubmit = (event) => {
        if(confirmationDate && baptismalSerialNumber && dob && serialNumber && name && minister){
            setIsLoading(true);
            let parentsNames = [];
            parentsNames[0] = fathersName || "";
            parentsNames[1] = mothersName || "";
            const dataToSubmit = {
                "baptismalDate": baptismalDate,
                "baptismalNumber": baptismalSerialNumber,
                "baptismalPlace": baptismalPlace,
                "dateOfConfirmation": confirmationDate,
                "placeOfConfirmation": confirmationPlace,
                "dob": dob,
                "domicile": domicile,
                "godParentsName": godParentsName,
                "minister": minister,
                "name": name,
                "parentsNames": parentsNames,
                "remarks": remarks,
                "serialNumber": serialNumber
            }
            return firebaseDatabaseService.create(`/confirmation_registry/${volumeNo}/data/${Number(serialNumber) - 1}`, dataToSubmit)
                .then((res) => {
                    props.setIsLoading(false);
                    setOpenSnackbar(true);
                    props.setOpenCreateDialog(false);
                    setName("");
                    setSerialNumber("");
                    setBaptismalDate("");
                    setBaptismalPlace("");
                    setBaptismalSerialNumber("");
                    setDob("");
                    setMothersName(mothersName);
                    setFathersName(fathersName);
                    setGodParentsName("");
                    setConfirmationDate("");
                    setConfirmationPlace("");
                    setDomicile("");
                    setMinister("");
                    setRemarks("");
                    setIsLoading(false);                    
                })
                .catch((err) => props.setError(err));
        }
    }

    const changeHandler = {
        handleSerialNumberChange: (event) => {
            setSerialNumber(event.target.value);
        },
        handleNameChange: (event) => {
            setName(event.target.value);
        },

        handleBaptismalDateChange: (event) => {
            setBaptismalDate(event.target.value);
        },
        handlebaptismalPlaceChange: (event) => {
            setBaptismalPlace(event.target.value);
        },
        handleDobChange: (event) => {
            setDob(event.target.value);
        },
        handleFathersNamesChange: (event) => {
            setFathersName(event.target.value)
        },
        handleMothersNamesChange: (event) => {
            setMothersName(event.target.value)
        },
        handleGodParentsNameChange: (event) => {
            setGodParentsName(event.target.value)
        },
        handleConfirmationPlaceChange: (event) => {
            setConfirmationPlace(event.target.value)
        },
        handleConfirmationDateChange: (event) => {
            setConfirmationDate(event.target.value)
        },
        handleMinisterChange: (event) => {
            setMinister(event.target.value)
        },
        handleDomicileChange: (event) => {
            setDomicile(event.target.value)
        },
        handleRemarksChange: (event) => {
            setRemarks(event.target.value)
        },
        handleBaptismalNumberChange: (event) => {
            setBaptismalSerialNumber(event.target.value)
        },
    }

    return (
      <>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.openCreateDialog}
            onClose={() => props.setOpenCreateDialog(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.openCreateDialog}>
                <Card sx={style}>
                    <Typography id="transition-modal-title" style={{ textAlign: "center", paddingTop: "10px" }} variant="h4" component="h2">
                        Create a New Entry
                    </Typography>
                    <ValidatorForm
                        className=" pb-4 row col-sm-12"
                        onSubmit={handleSubmit}
                        onError={errors => console.log(errors)}
                        style={{
                            width: "100%"
                        }}                           
                    >
                          <div className="col-sm-6">
                            <TextValidator
                                type="number"
                                label="Serial Number"
                                onChange={changeHandler.handleSerialNumberChange}
                                name="Serial Number"
                                value={serialNumber}
                                validators={['required']}
                                style={{
                                    width: "100%",
                                    marginTop: "20px"
                                }}
                                errorMessages={['this field is required']}
                                />  
                            <TextValidator
                                type="number"
                                label="Baptismal Number"
                                onChange={changeHandler.handleBaptismalNumberChange}
                                name="Baptismal Number"
                                value={baptismalSerialNumber}
                                validators={['required']}
                                style={{
                                    width: "100%",
                                    marginTop: "20px"
                                }}
                                errorMessages={['this field is required']}
                                />    
                            <TextValidator
                                label="Full Name"
                                onChange={changeHandler.handleNameChange}
                                name="name"
                                value={name}
                                validators={['required']}
                                style={{
                                    width: "100%",
                                    marginTop: "20px"
                                }}
                                errorMessages={['this field is required']}
                                />
                            <TextValidator
                                label="Place of Confirmation"
                                onChange={changeHandler.handleConfirmationPlaceChange}
                                name="Place of Confirmation"
                                validators={['required']}
                                errorMessages={['this field is required']}
                                value={confirmationPlace}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            />
                            <TextValidator
                                label="Date of Confirmation"
                                onChange={changeHandler.handleConfirmationDateChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                name="Date of Confirmation"
                                value={confirmationDate}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                                />
                            <TextValidator
                                label="Date of Birth"
                                onChange={changeHandler.handleDobChange}
                                name="Date of Birth"
                                value={dob}
                                validators={['required']}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                                errorMessages={['this field is required']}
                            />
                            <TextValidator
                                label="Father"
                                onChange={changeHandler.handleFathersNamesChange}
                                name="Father"
                                value={fathersName}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            />
                        </div>  
                          <div className="col-sm-6">
                            <TextValidator
                                    label="Mother"
                                    onChange={changeHandler.handleMothersNamesChange}
                                    name="Mother"
                                    value={mothersName}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%"
                                    }}
                                />    
                            <TextValidator
                                label="Godparent"
                                onChange={changeHandler.handleGodParentsNameChange}
                                name="Godparent"
                                value={godParentsName}
                                validators={['required']}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                                errorMessages={['this field is required']}
                            />
                             <TextValidator
                                label="Baptismal Date"
                                onChange={changeHandler.handleBaptismalDateChange}
                                name="Baptismal Date"
                                value={baptismalDate}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            />
                            <TextValidator
                                label="Baptismal Place"
                                onChange={changeHandler.handlebaptismalPlaceChange}
                                name="Baptismal Place"
                                value={baptismalPlace}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            />
                            <TextValidator
                                label="Domicile"
                                onChange={changeHandler.handleDomicileChange}
                                name="Domicile"
                                value={domicile}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                                />
                            <TextValidator
                                label="Minister"
                                onChange={changeHandler.handleMinisterChange}
                                name="Minister"
                                validators={['required']}
                                errorMessages={['this field is required']}
                                value={minister}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                                />  
                            <TextValidator
                                label="Remarks"
                                onChange={changeHandler.handleRemarksChange}
                                name="Remarks"
                                value={remarks}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            />    
                        </div>  
                        <div className="col-sm-12 pt-4 pb-2">
                            <button disabled={isLoading} type="submit" className="btn btn-secondary col-sm-11" style={{ display: "block", margin: "0 auto" }} onClick={ handleSubmit }>
                                Create
                                {
                                    isLoading && 
                                        <CircularProgress style={{ marginLeft: "20px", marginBottom: "-10px", zoom: ".5","color" : "ivory"}}/>
                                }
                            </button>
                        </div>
                    </ValidatorForm>
                </Card>
            </Fade>
          </Modal > 
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
            New entry successfully added 
            </Alert>
        </Snackbar>
        </> 
    );
}