import React, { useEffect, useState } from "react";
import FirebaseRealtimeDatabaseService from "services/firebase-realtime.service";
import Skeleton from "@mui/material/Skeleton";
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
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import { baptismRegistryRowData, baptismRegistryColumnData } from "./baptism-registry.data";
import DeleteDialogComponent from "./delete-dialog.component";
import EditDialogComponent from "./edit-dialog.component";
import CreateDialogComponent from "./create-dialog.component";
import CreateNewVolumeComponent from "./create-new-volume.component";
import SearchDialogComponent from "./search-dialog.component";

export default function BaptismRegistryComponent(props) {
  // Declare state variables
  const [volumeNumberToFetch, setVolumeNumberToFetch] = useState(1);
  const [volumeData, setVolumeData] = useState(null);
  const [numberOfVolumes, setNumberOfVolumes] = useState(1);
  const [inputValue, setInputValue] = useState("Volume " + 1);
  const [isLoading, setIsLoading] = useState(true); // Define setIsLoading
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

  // Define fetchVolumeDataFromBackend function
  const fetchVolumeDataFromBackend = (volumeNumber) => {
    let data = [];
    return dbService
      .get(`/baptism_registry/${volumeNumber}/`, (snapshot) => {
        const snapshotData = snapshot.val();
        if (snapshotData) {
          for (let id in snapshotData) {
            Object.keys(snapshotData[id]).map((key, i) => {
              if (i >= 0 && snapshotData[id][key].serialNumber) {
                data.push({ ...snapshotData[id][key], id: key });
              }
            });
          }
          setVolumeData(baptismRegistryRowData([...data].reverse(), {
            volumeNumberToFetch,
            openDeleteDialog,
            setOpenDeleteDialog,
            openEditDialog,
            setCurrentIterationData,
            setOpenEditDialog,
            setEditEntryID,
            setDeleteEntryID
          }));
        }
      });
  };

  // Fetch volume data and number of volumes
  useEffect(() => {
    setIsLoading(true); // Show loading indicator
    dbService.get("/baptism_registry/", (snapshot) => {
      const snapshotData = snapshot.val();
      if (snapshotData) {
        setNumberOfVolumes(Object.keys(snapshotData).length);
        const volumeNumber = Number(inputValue.split(" ")[1]) - 1;
        fetchVolumeDataFromBackend(volumeNumber); // Fetch data for the specific volume
        setVolumeNumberToFetch(inputValue.split(" ")[1]);
      } else {
        setNumberOfVolumes(0); // No data available
      }
    });
  }, [inputValue]); // Trigger when `inputValue` changes

  // Set loading to false once volumeData has been updated
  useEffect(() => {
    if (volumeData) 
      setIsLoading(false); // Stop loading once data is fetched and the table is ready
  }, [volumeData]);

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
            <Fab style={{ cursor: "pointer" }} onClick={() => setOpenCreateNewVolumeDialog(true)}>
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
                  ) : (
                    <DataTable
                      table={{ columns: baptismRegistryColumnData, rows: volumeData }}
                      searchButtonClickEventHandler={() => setOpenSearchDialog(true)}
                      entriesPerPage = {{
                        entries: [10, 50, 100, 150, 200, 500],
                        defaultValue: 10,
                      }}
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
            onClick={() => { setOpenCreateDialog(true) }}
          >
            <Icon fontSize="small" color="inherit">
              add
            </Icon>
          </MDBox>
        </Grid>
      </MDBox>
      <Footer />
      <DeleteDialogComponent
        fetchVolumeDataFromBackend={fetchVolumeDataFromBackend}
        setError={setError}
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
        openCreateNewVolumeDialog={openCreateNewVolumeDialog}
        setOpenCreateNewVolumeDialog={setOpenCreateNewVolumeDialog}
      />
      <SearchDialogComponent
        setError={setError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setEditEntryID={setEditEntryID}
        numberOfVolumes={numberOfVolumes}
        volumeNumber={volumeNumberToFetch}
        openSearchDialog={openSearchDialog}
        setOpenEditDialog={setOpenEditDialog}
        setOpenSearchDialog={setOpenSearchDialog}
        setCurrentIterationData={setCurrentIterationData}
      />
    </DashboardLayout>
  );
}
