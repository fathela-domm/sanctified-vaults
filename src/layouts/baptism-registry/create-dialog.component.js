import React, { useState, useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import dbService from 'services/idb.service';  // Custom IndexedDB service
import { rdb as database } from 'services/firebase-config'; // Firebase configuration

const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    paddingLeft: "27px"
};

export default function CreateDialogComponent({ openCreateDialog, setOpenCreateDialog, volumeNumber, setError }) {
    const volumeNo = Number(volumeNumber) - 1;
    const [formData, setFormData] = useState({
        name: "", serialNumber: "", baptismalDate: "", baptismalPlace: "",
        dob: "", fathersName: "", mothersName: "", godParentsName: "",
        confirmation: "", marriage: "", firstHolyCommunion: "",
        domicile: "", minister: "", deathDate: "", remarks: ""
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const latestForm = formData;
        if (!latestForm.baptismalDate || !latestForm.baptismalPlace || !latestForm.minister || !latestForm.serialNumber || !latestForm.name || !latestForm.godParentsName || !latestForm.dob) {
            return;
        }

        setIsLoading(true);
        try {
            const latestForm = {
                ...formData,
                parentsNames: [formData.fathersName, formData.mothersName]
            };
            // Save the form data to IndexedDB
            await dbService.saveRecord(volumeNo, Number(latestForm.serialNumber), latestForm);
            
            setFormData({
                name: "", serialNumber: "", baptismalDate: "", baptismalPlace: "",
                dob: "", fathersName: "", mothersName: "", godParentsName: "",
                confirmation: "", marriage: "", firstHolyCommunion: "",
                domicile: "", minister: "", deathDate: "", remarks: ""
            });

            // Close the CreateDialogComponent
            setOpenCreateDialog(false);
            setOpenSnackbar(true);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Handle background data submission after the dialog closes
        if (!openCreateDialog) {
            const submitDataToFirebase = async () => {
                try {
                    const records = await dbService.getAllRecords(`/baptism_registry/${volumeNo}`);
                    for (let record of records) {
                        const path = `/baptism_registry/${volumeNo}/data/${Number(record.serialNumber - 1)}`;
                        
                        // Submit to Firebase
                        await database.ref(path).set(record);

                        // Once data is successfully submitted, delete the record from IndexedDB
                        await dbService.deleteRecord(record.serialNumber);
                    }
                } catch (error) {
                    console.error("Error submitting data to Firebase or deleting from IndexedDB:", error);
                }
            };

            // Run the function in the background after closing the dialog
            submitDataToFirebase();
        }
    }, [openCreateDialog, volumeNo]);

    return (
        <>
            <Modal
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            >
                <Fade in={openCreateDialog}>
                    <Card sx={style}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h2" style={{ textAlign: "center", paddingTop: "10px" }}>
                                Create a New Entry
                            </Typography>
                            <IconButton
                                edge="end"
                                color="secondary"
                                onClick={() => setOpenCreateDialog(false)}
                                aria-label="close"
                                style={{left: "-20px"}}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <ValidatorForm className="pb-4 row col-sm-12" onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <div className="col-sm-6">
                                <TextValidator
                                    type="number"
                                    label="Serial Number"
                                    name="serialNumber"
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ width: "100%", marginTop: "20px" }}
                                />
                                <TextValidator
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ width: "100%", marginTop: "20px" }}
                                />
                                <TextValidator
                                    label="Baptismal Date"
                                    name="baptismalDate"
                                    value={formData.baptismalDate}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Baptismal Place"
                                    name="baptismalPlace"
                                    value={formData.baptismalPlace}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Date of Birth"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Father"
                                    name="fathersName"
                                    value={formData.fathersName}
                                    onChange={handleChange}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Mother"
                                    name="mothersName"
                                    value={formData.mothersName}
                                    onChange={handleChange}
                                    style={{ marginTop: "20px", width: "100%" }}
                                    />
                            </div>
                            <div className="col-sm-6">
                                <TextValidator
                                    label="God Parent"
                                    name="godParentsName"
                                    value={formData.godParentsName}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="First Holy Communion"
                                    name="firstHolyCommunion"
                                    value={formData.firstHolyCommunion}
                                    onChange={handleChange}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Confirmation Date"
                                    name="confirmation"
                                    value={formData.confirmation}
                                    onChange={handleChange}
                                    style={{ marginTop: "20px", width: "100%" }}
                                    />
                                <TextValidator
                                    label="Marriage"
                                    name="marriage"
                                    value={formData.marriage}
                                    onChange={handleChange}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Minister"
                                    name="minister"
                                    value={formData.minister}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Domicile"
                                    name="domicile"
                                    value={formData.domicile}
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                                <TextValidator
                                    label="Death Date"
                                    name="deathDate"
                                    value={formData.deathDate}
                                    onChange={handleChange}
                                    style={{ marginTop: "20px", width: "100%" }}
                                />
                            </div>
                            <TextValidator
                                label="Remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                style={{ width: "100%", marginTop: "20px" }}
                            />
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                style={{ width: "100%", marginTop: "20px" }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : "Save Entry"}
                            </Button>
                        </ValidatorForm>
                    </Card>
                </Fade>
            </Modal>

            {/* Snackbar for success */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={1000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Record saved successfully!
                </Alert>
            </Snackbar>
        </>
    );
}