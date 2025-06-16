import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import MDBox from "components/MDBox";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Switch from "@mui/material/Switch";
import { useAuth } from 'context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import MDTypography from "components/MDTypography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FirebaseRealtimeDatabaseService from "services/firebase-realtime.service";

export default function UserManagementTableComponent({ users }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dbService = new FirebaseRealtimeDatabaseService();
  const { currentUser } = useAuth()

  const modifyUserPrivileges = async (event, user) => {
    const newRole = event.target.checked ? "admin" : "basic";
    setIsLoading(true);
    setSelectedUser(user.key);
    try {
      await dbService.update(`/users/${user.key}/`, { role: newRole });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
    }
  };

  return !users ? (
    <MDBox mx={4} pt={3} py={8} px={4} mb={2} bgColor="dark" borderRadius="lg">
      <CircularProgress color="primary" />
    </MDBox>
  ) : (
    <>
      <TableContainer sx={{ padding: 5 }} component={Paper}>
        <Table>
          <TableBody>
            <TableCell>
                <MDTypography variant="button" fontWeight="medium">
                   IDENTIFIER
                </MDTypography>
            </TableCell>  
            <TableCell>
                <MDTypography variant="button" fontWeight="medium">
                    DATE CREATED
                </MDTypography>
            </TableCell>  
            <TableCell>
                <MDTypography variant="button" fontWeight="medium">
                   LAST LOGIN
                </MDTypography>
            </TableCell>  
            <TableCell>
                <MDTypography variant="button" fontWeight="medium">
                   USER PRIVILEDGES
                </MDTypography>
            </TableCell>              
            {users.map((user) => (
              user.identifier !== "dmmmbg149@gmail.com" && (
                <TableRow key={user.key}>
                  <TableCell>
                    <MDTypography variant="button" fontWeight="medium">
                      {user.identifier}
                    </MDTypography>
                  </TableCell>
                  <TableCell>
                    <MDTypography variant="button" fontWeight="medium">
                      {new Date(user["date-created"]).toDateString()}
                    </MDTypography>
                  </TableCell>
                  <TableCell>
                    <MDTypography variant="button" fontWeight="medium">
                      {new Date(user["last-login"]).toDateString()}
                    </MDTypography>
                  </TableCell>
                  <TableCell>
                    {isLoading && selectedUser === user.key ? (
                      <CircularProgress color="primary" />
                    ) : (
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={user.role === "admin"}
                            onChange={(event) => modifyUserPrivileges(event, user)}
                            disabled={ currentUser.email === user.identifier ? true : false }
                          />
                        }
                        label={user.role === "admin" ? "Admin User" : "Basic User"}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Role successfully updated
        </Alert>
      </Snackbar>
    </>
  );
}
