import { MenuItem, TextField, Typography } from "@mui/material";
import { ACTIVITY_TYPES_OPTIONS } from "../../../utils/ActivityCreationFormSteps";
import { Fragment } from "react";

const ActivityType = (props) => {
  //this handle change should use form update methods from zustand to update activityType.
  const { handleChange } = props;

  return (
    <Fragment>
      <Typography variant="h6">ActivityType</Typography>
      {/*can change to checkbox as well*/}
      <TextField
        id="outlined-select-currency"
        select
        label="Select"
        defaultValue=""
        helperText="Please select your actvity type"
        onChange={handleChange}
      >
        {ACTIVITY_TYPES_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Fragment>
  );
};

export default ActivityType;
