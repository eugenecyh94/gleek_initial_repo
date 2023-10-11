import React from "react";
import { Grid, Typography } from "@mui/material";
import BlockedTimingItem from "./BlockedTimingItem";

const BlockedTimingsSection = ({ timeslots, title }) => {
  if (!timeslots || timeslots.length === 0) return null;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} width="100%">
        {timeslots.map((timeslot) => (
          <Grid item xs={4} key={timeslot._id}>
            <BlockedTimingItem blockedTimeslot={timeslot} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BlockedTimingsSection;
