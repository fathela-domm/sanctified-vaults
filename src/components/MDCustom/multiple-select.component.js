import React from "react";
import { Input, OutlinedInput } from "@mui/material/";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const names = [
    { id: "1", value: "Oliver Hansen" },
    { id: "2", value: "Van Henry" },
    { id: "3", value: "Van Henry" }
];

export default function NativeSelects() {
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value }
        } = event;
        setPersonName(
            // On autofill we get a the stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <div>
            <FormControl>
                <InputLabel htmlFor="age-native-simple">
                    Names here to select from
                </InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={personName}
                    name="first"
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.map(obj => names[obj - 1].value).join(", ")}
                >
                    {names.map((name) => (
                        <MenuItem key={name.id} value={name.id}>
                            <Checkbox checked={personName.indexOf(name.id) > -1} />
                            <ListItemText primary={name.value} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}