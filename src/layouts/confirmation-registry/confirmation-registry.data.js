import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import IconButton from '@mui/material/IconButton';

export const confirmationRegistryColumnData = [
  { Header: "Serial Number", accessor: "serialNumber", align: "center", width: "150%" },
  { Header: "Baptismal Serial Number", accessor: "baptismalNumber", align: "center", width: "150%" },
  { Header: "Name", accessor: "name", align: "left", width: "100%" },
  { Header: "Date of Confirmation", accessor: "dateOfConfirmation", align: "left", width: "100%" },
  { Header: "Place of Confirmation", accessor: "placeOfConfirmation", align: "left", width: "100%" },
  { Header: "Place of Baptism", accessor: "baptismalPlace", align: "left", width: "100%" },
  { Header: "Date of Birth", accessor: "dob", align: "left", width: "100%" },
  { Header: "Parents", accessor: "parentsNames", align: "left", width: "100%" },
  { Header: "Godparent", accessor: "godParentsName", align: "left", width: "100%" },
  {
    Header: "Action",
    accessor: "action",
    align: "center",
  },
  { Header: "Domicile", accessor: "domicile", align: "left", width: "100%" },
  { Header: "Minister", accessor: "minister", align: "left", width: "100%" },
  { Header: "Date of Death", accessor: "deathDate", align: "left", width: "100%" },
  { Header: "Remarks", accessor: "remarks", align: "left", width: "100%" },
];

export const confirmationRegistryRowData = (rawData, props) => {
  const volumeNumber = props.volumeNumberToFetch;
  const handleClickEdit = (id, currentIterationData) => {
    props.setEditEntryID(id);
    props.setOpenEditDialog(true);
    props.setCurrentIterationData(currentIterationData);
  }

  const handleClickDelete = (id) => {
    props.setDeleteEntryID(Number(id) - 1);
    props.setOpenDeleteDialog(true);
  }

  return rawData
    && rawData.map((data, i) =>  ({
        serialNumber: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.serialNumber}
          </MDTypography>
        ),
        name: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.name}
          </MDTypography>
        ),
        dateOfConfirmation: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.dateOfConfirmation}
          </MDTypography>
        ),
        baptismalNumber: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.baptismalNumber}
          </MDTypography>
        ),
        placeOfConfirmation: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.placeOfConfirmation}
          </MDTypography>
        ),
        baptismalPlace: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.baptismalPlace}
          </MDTypography>
        ),
        dob: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.dob}
          </MDTypography>
        ),
        parentsNames: data.parentsNames ? (
          data.parentsNames.map((name) => (
            <>
              <MDTypography
                component="a"
                variant="button"
                color="text"
                fontWeight="medium"
              >
                {name}
              </MDTypography>
              <br />
            </>
          ))
        ) : (
          <></>
        ),
        godParentsName: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.godParentsName}
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', }}>
            <IconButton onClick={() => handleClickEdit(i, data)} variant="button" color="text">
              <Icon color = "warning" style={{ cursor: "pointer" }} >edit</Icon>
            </IconButton>
            <Divider/>
            <IconButton onClick={() => handleClickDelete(data.serialNumber)} variant="button" color="text">
                <Icon color="danger" style={{ cursor: "pointer" }} >delete</Icon>
            </IconButton>
          </div>
        ),
        domicile: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.domicile}
          </MDTypography>
        ),
        minister: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.minister}
          </MDTypography>
        ),
        remarks: (
          <MDTypography key={Math.random()} variant="button" color="text" fontWeight="medium">
            {data.remarks}
          </MDTypography>
        ),
      }))
    }