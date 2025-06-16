import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FirebaseRealtimeDatabaseService from "../../services/firebase-realtime.service";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    paddingLeft: "27px"
};

export default function EditDialogComponent(props) {
    const [name, setName] = React.useState("");
    const [serialNumber, setSerialNumber] = React.useState("");
    const [baptismalDate, setBaptismalDate] = React.useState("");
    const [baptismalPlace, setBaptismalPlace] = React.useState("");
    const [dob, setDob] = React.useState("");
    const [mothersName, setMothersName] = React.useState("");
    const [fathersName, setFathersName] = React.useState("");
    const [godParentsName, setGodParentsName] = React.useState("");
    const [confirmation, setConfirmation] = React.useState("");
    const [firstHolyCommunion, setFirstHolyCommunion] = React.useState("");
    const [marriage, setMarriage] = React.useState("");
    const [domicile, setDomicile] = React.useState("");
    const [minister, setMinister] = React.useState("");
    const [deathDate, setDeathDate] = React.useState("");
    const [remarks, setRemarks] = React.useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const firebaseDatabaseService = new FirebaseRealtimeDatabaseService();
    const volumeNo = Number(props.volumeNumber) - 1;

    React.useEffect(() => {
        let mothersName = props.currentIterationData.parentsNames ? props.currentIterationData.parentsNames[1] : "";
        let fathersName = props.currentIterationData.parentsNames ? props.currentIterationData.parentsNames[0] : "";
        setName(props.currentIterationData.name);
        setSerialNumber(props.currentIterationData.serialNumber);
        setBaptismalDate(props.currentIterationData.baptismalDate);
        setBaptismalPlace(props.currentIterationData.baptismalPlace);
        setDob(props.currentIterationData.dob);
        setMothersName(mothersName);
        setFathersName(fathersName);
        setGodParentsName(props.currentIterationData.godParentsName);
        setConfirmation(props.currentIterationData.confirmation);
        setMarriage(props.currentIterationData.marriage);
        setFirstHolyCommunion(props.currentIterationData.firstHolyCommunion);
        setDomicile(props.currentIterationData.domicile);
        setMinister(props.currentIterationData.minister);
        setDeathDate(props.currentIterationData.deathDate);
        setRemarks(props.currentIterationData.remarks);
    }, [props.currentIterationData]);

    const handleSubmit = (event) => {
        if(baptismalDate && minister && baptismalPlace && dob && serialNumber && name && godParentsName){
            setIsLoading(true);
            let parentsNames = [];
            parentsNames[0] = fathersName;
            parentsNames[1] = mothersName;
            const dataToSubmit = {
                baptismalDate,
                baptismalPlace,
                confirmation,
                marriage: marriage || "",
                deathDate,
                dob,
                domicile,
                firstHolyCommunion,
                godParentsName,
                minister,
                name,
                parentsNames,
                remarks,
                serialNumber
            };

            firebaseDatabaseService.update(`/baptism_registry/${volumeNo}/data/${Number(serialNumber) - 1}`, dataToSubmit)
                .then(() => {
                    setIsLoading(false);
                    setOpenSnackbar(true);
                    props.setOpenEditDialog(false); // Close dialog
                    resetForm(); // Clear form
                })
                .catch((err) => {
                    setIsLoading(false);
                    props.setError(err);
                });
        }
    };

    const resetForm = () => {
        setName("");
        setSerialNumber("");
        setBaptismalDate("");
        setBaptismalPlace("");
        setDob("");
        setMothersName("");
        setFathersName("");
        setGodParentsName("");
        setConfirmation("");
        setFirstHolyCommunion("");
        setMarriage("");
        setDomicile("");
        setMinister("");
        setDeathDate("");
        setRemarks("");
    };
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
        handleFirstHolyCommunionChange: (event) => {
            setFirstHolyCommunion(event.target.value)
        },
        handleConfirmationChange: (event) => {
            setConfirmation(event.target.value)
        },
        handleMarriageChange: (event) => {
            setMarriage(event.target.value)
        },
        handleMinisterChange: (event) => {
            setMinister(event.target.value)
        },
        handleDomicileChange: (event) => {
            setDomicile(event.target.value)
        },
        handleDeathDateChange: (event) => {
            setDeathDate(event.target.value)
        },
        handleRemarksChange: (event) => {
            setRemarks(event.target.value)
        },
    }

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.openEditDialog}
                onClose={() => props.setOpenEditDialog(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={props.openEditDialog}>
                <Card sx={style}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h2" style={{ textAlign: "center", paddingTop: "10px" }}>
                                Edit this Entry
                            </Typography>
                            <IconButton
                                edge="end"
                                color="secondary"
                                onClick={() => props.setOpenEditDialog(false)}
                                aria-label="close"
                                style={{left: "-20px"}}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <ValidatorForm className="pb-4 row col-sm-12" onSubmit={handleSubmit} style={{ width: "100%" }}>
                            {/* Form Fields */}
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
                                    label="Baptismal Date"
                                    onChange={changeHandler.handleBaptismalDateChange}
                                    name="Baptismal Date"
                                    value={baptismalDate}
                                    validators={['required']}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%"
                                    }}
                                    errorMessages={['this field is required']}
                                />
                                <TextValidator
                                    label="Baptismal Place"
                                    onChange={changeHandler.handlebaptismalPlaceChange}
                                    name="Baptismal Place"
                                    value={baptismalPlace}
                                    validators={['required']}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%"
                                    }}
                                    errorMessages={['this field is required']}
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
                            </div>  
                            <div className="col-sm-6">
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
                                    label="First Holy Communion"
                                    onChange={changeHandler.handleFirstHolyCommunionChange}
                                    name="First Holy Communion"
                                    value={firstHolyCommunion}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%"
                                    }}
                                    />
                                <TextValidator
                                    label="Confirmation"
                                    onChange={changeHandler.handleConfirmationChange}
                                    name="Confirmation"
                                    value={confirmation}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%"
                                    }}
                                />
                                <TextValidator
                                    label="Marriage"
                                    onChange={changeHandler.handleMarriageChange}
                                    name="Marriage"
                                    value={marriage}
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
                                    value={minister}
                                    validators={['required']}
                                    style={{
                                        width: "100%",
                                        marginTop: "20px"
                                    }}
                                    errorMessages={['this field is required']}
                                    />  
                                <TextValidator
                                    label="Death Date"
                                    onChange={changeHandler.handleDeathDateChange}
                                    name="Death Date"
                                    value={deathDate}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%"
                                    }}
                                    />   
                            </div> 
                            <TextValidator
                                label="Remarks"
                                onChange={changeHandler.handleRemarksChange}
                                name="Remarks"
                                className="col-sm-12"
                                value={remarks}
                                style={{
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            />   
                            <div className="col-sm-12 pt-4 pb-2">
                                <button disabled={isLoading} type="submit" className="btn btn-secondary col-sm-11" style={{ display: "block", margin: "0 auto" }}>
                                    Update
                                    {isLoading && <CircularProgress style={{ marginLeft: "20px", marginBottom: "-10px", zoom: ".5", color: "ivory" }} />}
                                </button>
                            </div>
                        </ValidatorForm>
                    </Card>
                </Fade>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                message="This Snackbar will be dismissed in 5 seconds."
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Entry {volumeNo}/{props.entryID} successfully updated
                </Alert>
            </Snackbar>
        </>
    );
}
