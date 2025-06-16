import React, { useState } from 'react';
import FirebaseRealtimeDatabaseService from "../../services/firebase-realtime.service";
import firebase from "../../services/firebase-config";
import CardContent from '@mui/material/CardContent';
import MDTypography from "components/MDTypography";
import TextField from "@mui/material/TextField";
import Backdrop from '@mui/material/Backdrop';
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Card from '@mui/material/Card';
import Fuse from "fuse.js";
import "./styles.css";

const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "75%",
    paddingLeft: "27px",
    maxHeight: "80vh",
    overflow: 'auto',
};

export default function SearchDialogComponent(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const dbService = new FirebaseRealtimeDatabaseService();
    const [error, setError] = useState(null);
    const handleInputChange = (event) => {
        let searchTerm = event.target.value;
        if (searchTerm) {
            setIsLoading(true);
            filtrationHub(searchTerm);
        }
        return;
    }

    const filtrationHub = (queryText) => {
        let data = [];
        setIsLoading(true);
        const regExp = new RegExp(`${queryText.trim()}`, "gi");
        for (let i = 0; i < props.numberOfVolumes; i++ ){
            dbService
                .get(`/confirmation_registry/${i}/`, (snapshot) => {
                    for (let id in snapshot.val()) {
                        Object.keys(snapshot.val()[id]).map(
                            (key) => snapshot.val()[id][key].serialNumber && (data.push({ ...snapshot.val()[id][key], volume: i + 1 })));
                        }
                    if (i == Number(props.numberOfVolumes) - 1) {
                        setFilteredData(data.filter(entryData => entryData.name.match(regExp) || entryData.serialNumber.toString().match(regExp)));
                        setIsLoading(false);
                    }
                })
        } 
    }  

    const handleClickEdit = (id, currentIterationData) => {
        props.setEditEntryID(id);
        props.setOpenEditDialog(true);
        props.setCurrentIterationData(currentIterationData);
    }

    return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.openSearchDialog}
        onClose={() => {props.setOpenSearchDialog(false); setFilteredData([])}}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
    >
        <Fade in={props.openSearchDialog}>
            <Card sx={style}>
                <div style={{ marginRight: "30px", marginTop: "20px", marginBottom: "10px" }}>
                    <TextField
                        fullWidth  
                        label="Search Field"
                        type="search"
                        autoFocus
                        autoComplete="off"
                        onInput={handleInputChange}
                        /> 
                    {
                        isLoading ? (
                            <React.Fragment>
                                <div className="skeleton mt-3">
                                    <div className="skeleton-left flex1">
                                        <div className="square circle"></div>
                                    </div>
                                    <div className="skeleton-right flex2">
                                        <div className="line h17 w40 m10"></div>
                                        <div className="line"></div>
                                        <div className="line h15 w50"></div>
                                        <div className="line w75"></div>
                                    </div>
                                </div>
                                <div className="skeleton mt-3">
                                        <div className="skeleton-left flex1">
                                            <div className="square circle"></div>
                                        </div>
                                        <div className="skeleton-right flex2">
                                            <div className="line h17 w40 m10"></div>
                                            <div className="line"></div>
                                            <div className="line h15 w50"></div>
                                            <div className="line w75"></div>
                                        </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            filteredData.map((data) => (
                                <Card className="mt-3">
                                    <CardContent style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                                        <MDTypography className="pt-4">{data.serialNumber}</MDTypography>
                                        <MDTypography className="pt-4">{data.name}</MDTypography>
                                        <IconButton className="pt-4" onClick={() => handleClickEdit(data.serialNumber, data)} variant="button" color="text">
                                            <Icon color = "warning" style={{ cursor: "pointer" }} >edit</Icon>
                                        </IconButton>
                                        <MDTypography className="pt-4">{data.baptismalPlace}</MDTypography>
                                        <MDTypography className="pt-4">Vol: {data.volume}</MDTypography>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    }
                </div>
            </Card>
        </Fade>
        </Modal>
  );
}
