import { InputLabel, TextField, Typography } from "@mui/material";
import { useActivityCreationFormStore } from "../../../zustand/GlobalStore";
import { ACTIVITY_TYPES } from "../../../utils/ActivityCreationFormSteps";
import { Fragment } from "react";

const ActivityDetails = (props) => {
  //this handle change should use form update methods from zustand.
  const { handleChange } = props;
  const { activityType } = useActivityCreationFormStore(
    (state) => state.currentActivityCreationForm,
  );

  //retrieve state from zustand store
  switch (activityType) {
    case ACTIVITY_TYPES.OTHERS:
      return <></>;
      break;
    case ACTIVITY_TYPES.POPUPS:
      return <></>;
      break;
    default:
      return (
        <Fragment>
          <Typography variant="h6">Activity Details</Typography>
          <InputLabel htmlFor="outlined-adornment-password">
            Enter Activity NAme
          </InputLabel>
          <TextField
            label="Activity Name"
            name="name"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Activity Description"
            name="name"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Fragment>
      );
  }
};

export default ActivityDetails;
