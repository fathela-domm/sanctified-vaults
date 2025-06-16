import React, { useEffect, useState } from "react";
import FirebaseRealtimeDatabaseService from "services/firebase-realtime.service";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from '@mui/material/Fab';
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { confirmationRegistryRowData, confirmationRegistryColumnData} from "./confirmation-registry.data";
import DeleteDialogComponent from "./delete-dialog.component";
import EditDialogComponent from "./edit-dialog.component";
import CreateDialogComponent from "./create-dialog.component";
import CreateNewVolumeComponent from "./create-new-volume.component";
import SearchDialogComponent from "./search-dialog.component";
import Skeleton from "@mui/material/Skeleton";

export default function ConfirmationRegistryComponent(props) {
  const [volumeNumberToFetch, setVolumeNumberToFetch] = useState(1);
  const [volumeData, setVolumeData] = useState([]);
  const [numberOfVolumes, setNumberOfVolumes] = useState(1);
  const [inputValue, setInputValue] = useState("Volume " + 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteEntryID, setDeleteEntryID] = useState(null);
  const [editEntryID, setEditEntryID] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [currentIterationData, setCurrentIterationData] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openCreateNewVolumeDialog, setOpenCreateNewVolumeDialog] = useState(false);
  const dbService = new FirebaseRealtimeDatabaseService();

  function fetchVolumeDataFromBackend(volumeNumber) {
    let data = [];
    return dbService
      .get(`/confirmation_registry/${volumeNumber}/`, (snapshot) => {
        for (let id in snapshot.val()) {
          Object.keys(snapshot.val()[id]).map(
            (key, i) => {
               return i >= 0 && snapshot.val()[id][key].serialNumber && (data.push({ ...snapshot.val()[id][key], id: key }));
	          });
        }
        setVolumeData(confirmationRegistryRowData([...data], {volumeNumberToFetch, openDeleteDialog, setOpenDeleteDialog, openEditDialog, setCurrentIterationData, setOpenEditDialog, setEditEntryID, setDeleteEntryID }));
        setIsLoading(false);
      })
      // .catch((err) => {setError(err); setIsLoading(false)});      
  }
  
   useEffect(() => {
    setIsLoading(true);
    dbService
      .get("/confirmation_registry/", (snapshot) => {
        if (snapshot.val()) {
          setNumberOfVolumes(snapshot.val().length);
          fetchVolumeDataFromBackend(Number(inputValue.split(" ")[1]) - 1);
          setVolumeNumberToFetch(inputValue.split(" ")[1]);
        }
      });
    setIsLoading(false);
  }, [inputValue]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={11}>
            <Card>
              <MDBox display="flex" alignItems="center">
                <Autocomplete
                  disableClearable
                  value={inputValue}
                  options={Array.from(Array(numberOfVolumes).keys()).map(n => `Volume ${n+1}`)}
                  onInputChange={(event, value) => setInputValue(value)}
                  sx={{ width: "100%" }}
                  renderInput={(params) => <MDInput {...params} />}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={1}>
            <Fab style={{ cursor: "pointer" }} onClick={() => setOpenCreateNewVolumeDialog(true) }>
              <Icon>add</Icon>
            </Fab>
          </Grid>
          <Grid item xs={12}>            
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Volume {volumeNumberToFetch}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>

                {
                  isLoading ? (
                    <MDBox
                      mx={4}
                      py={4}
                      px={4}
                      mb={2}
                      bgColor="dark"
                      color="dark"
                      borderRadius="lg"
                      shadow="sm"
                        >
                        <Skeleton sx={{ bgcolor: 'ivory' }} />
                        <Skeleton sx={{ bgcolor: 'ivory' }} animation="wave" />
                        <Skeleton sx={{ bgcolor: 'ivory' }} />
                        <Skeleton sx={{ bgcolor: 'ivory' }} animation={false} />
                        <Skeleton sx={{ bgcolor: 'ivory' }} />
                  </MDBox>
                  ): (
                    <DataTable
                      table={{ columns: confirmationRegistryColumnData, rows: volumeData }}
                      entriesPerPage={true}
                      showTotalEntries={true}
                      noEndBorder
                      searchButtonClickEventHandler= { () => setOpenSearchDialog(true)}
                      />
                    ) 
              }
              </MDBox>
            </Card>
          </Grid>
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.25rem"
            height="3.25rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            marginLeft="3rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{ cursor: "pointer" }}
            onClick={() => { setOpenCreateDialog(true)}}
            >
          <Icon fontSize="small" color="inherit">
            add
          </Icon>
        </MDBox>
        </Grid>
      </MDBox>
      <Footer></Footer>
      <DeleteDialogComponent
        fetchVolumeDataFromBackend={fetchVolumeDataFromBackend}
        setError={setError}
        setIsLoading={setIsLoading}
        entryID={deleteEntryID}
        volumeNumber={volumeNumberToFetch}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        />
      <EditDialogComponent
        fetchVolumeDataFromBackend={fetchVolumeDataFromBackend}
        setError={setError}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        entryID={editEntryID}
        volumeNumber={volumeNumberToFetch}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        setCurrentIterationData={setCurrentIterationData}
        currentIterationData={currentIterationData}
        />
      <CreateDialogComponent
        fetchVolumeDataFromBackend={fetchVolumeDataFromBackend}
        setError={setError}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        volumeNumber={volumeNumberToFetch}
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
        />
       <CreateNewVolumeComponent
        fetchVolumeDataFromBackend={fetchVolumeDataFromBackend}
        setError={setError}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        numberOfVolumes={numberOfVolumes}
        setVolumeNumber={setVolumeNumberToFetch}
        setNumberOfVolumes={setNumberOfVolumes}
        openCreateNewVolumeDialog={openCreateNewVolumeDialog}
        setOpenCreateNewVolumeDialog={setOpenCreateNewVolumeDialog}
         />
      <SearchDialogComponent
        openSearchDialog={openSearchDialog}
        setOpenSearchDialog={setOpenSearchDialog}
        numberOfVolumes={numberOfVolumes}
        setError={setError}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        entryID={editEntryID}
        setEditEntryID={setEditEntryID}
        volumeNumber={volumeNumberToFetch}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        setCurrentIterationData={setCurrentIterationData}
        currentIterationData={currentIterationData}
      />
    </DashboardLayout>
  );
}

  