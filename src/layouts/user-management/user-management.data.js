import Switch from "@mui/material/Switch"
import MDTypography from "components/MDTypography";

export function userRowData() {
    // iterate through all users and their roles and return data

    return [{
        name: (
            <MDTypography key={Math.random() } variant="button" color="text" fontWeight="medium">
                data.name
            </MDTypography>
        ),
        lastLogin: (
            <MDTypography key={Math.random() } variant="button" color="text" fontWeight="medium">
                data.name
            </MDTypography>
        ),
        isAdmin: (
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', }}>
                data.name
            </div>
        )
    }, {
        name: (
            <MDTypography key={Math.random() } variant="button" color="text" fontWeight="medium">
                data.name
            </MDTypography>
        ),
        lastLogin: (
            <MDTypography key={Math.random() } variant="button" color="text" fontWeight="medium">
                data.name
            </MDTypography>
        ),
        isAdmin: (
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', }}>
                data.name
            </div>
        )
    }]
}