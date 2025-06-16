import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { userHeaderColumnNames, userRowData } from "./user-management.data";
import UserManagementTableComponent from "./user-management-table.component";
import FirebaseRealtimeDatabaseService from "services/firebase-realtime.service";

export default function UserManagementComponent() {
  const dbService = new FirebaseRealtimeDatabaseService();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = () => {
      try {
        let data = [];
        dbService.get(`/users/`, (snapshot) => {
          const snapshotData = snapshot.val();
          if (snapshotData) {
            for (let id in snapshotData) {
              data.push({ ...snapshotData[id], key: id });
            }
            setUsers(data);
            data = [];
          }
        });
      } catch (err) {
        console.error("Error fetching users:", err);
      } 
    };

    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
                  All Users
                </MDTypography>
              </MDBox>
              <UserManagementTableComponent users={users} />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}