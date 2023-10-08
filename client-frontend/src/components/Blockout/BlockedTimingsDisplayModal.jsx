import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from "@mui/material";
import React from "react";
import BlockedTimingItem from "./BlockedTimingItem";

const BlockedTimingsDisplayModal = ({
  open,
  handleClose,
  selectedActivity,
}) => {
  const currentDate = new Date();

  const upcomingTimeslots = selectedActivity?.blockedTimeslots?.filter(
    (timeslot) => new Date(timeslot.blockedStartDateTime) >= currentDate,
  );

  const pastTimeslots = selectedActivity?.blockedTimeslots?.filter(
    (timeslot) => new Date(timeslot.blockedStartDateTime) < currentDate,
  );

  const renderTimeslotSection = (timeslots, title) => {
    if (!timeslots || timeslots.length === 0) return null;

    return (
      <>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2} width="100%">
          {timeslots.map((timeslot) => (
            <Grid item xs={4}>
              <BlockedTimingItem
                key={timeslot._id}
                blockedTimeslot={timeslot}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
      <DialogTitle variant="h4">Blocked Timeslots for {selectedActivity?.title}</DialogTitle>
      <DialogContent>
        {renderTimeslotSection(upcomingTimeslots, "Upcoming")}
        {renderTimeslotSection(pastTimeslots, "Past")}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockedTimingsDisplayModal;
