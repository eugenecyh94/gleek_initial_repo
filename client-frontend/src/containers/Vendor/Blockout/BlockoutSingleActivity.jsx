// BlockoutSingleActivity.js

import styled from "@emotion/styled";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Grow,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBlockoutStore from "../../../zustand/BlockoutStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

const StyledPaper = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 4px 4px 0px 0px rgb(159, 145, 204, 40%);
`;

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

function BlockoutSingleActivity() {
  const {
    isLoadingBlockoutsForActivity,
    getBlockoutsByActivityId,
    blockoutsForActivity,
    deleteBlockouts,
  } = useBlockoutStore();
  const { openSnackbar } = useSnackbarStore();
  const { activityId } = useParams();

  const currentDate = new Date();

  const [selectedItems, setSelectedItems] = useState([]); // State to track selected items

  const upcomingTimeslots = blockoutsForActivity?.filter(
    (timeslot) => new Date(timeslot.blockedEndDateTime) >= currentDate,
  );

  const handleDeleteSelectedItems = async () => {
    console.log("Selected items to delete:", selectedItems);
    try {
      await deleteBlockouts(selectedItems, activityId);
      openSnackbar("Successfully deleted");
    } catch (error) {
      openSnackbar("There was an error.", "error");
    }
  };

  const handleSelectItem = (itemId) => {
    console.log("handleSelectItem", itemId);
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        console.log("handleSelectItem", prevSelected, "?");
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };

  useEffect(() => {
    const subscribeBlockouts = async () => {
      try {
        const response = await getBlockoutsByActivityId(activityId);
      } catch (err) {
        console.error(err);
        openSnackbar("Error retrieving your activities.", "error");
      }
    };
    subscribeBlockouts();
  }, [getBlockoutsByActivityId, openSnackbar, activityId]);

  if (isLoadingBlockoutsForActivity) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        p={5}
        width={"100%"}
      >
        <Typography color="secondary" variant="h3">
          Manage Blockout Timings
        </Typography>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Typography color="secondary" variant="h3">
        Manage Activity's Blockouts
      </Typography>
      <Typography variant="h6" gutterBottom color="primary">
        Add New Timing
      </Typography>
      <Typography variant="h6" gutterBottom color="primary">
        Delete Timings
      </Typography>
      <Grow in={true}>
        <Grid container spacing={2} width="100%">
          {upcomingTimeslots?.map((timeslot) => (
            <Grid item xs={4} key={timeslot._id}>
              <Paper
                elevation={0}
                style={{
                  padding: "20px",
                  paddingTop: "6px",
                  borderRadius: "10px",
                  border: "1px solid rgb(159, 145, 204)",
                  boxShadow: "4px 4px 0px 0px rgba(159, 145, 204, 0.4)",
                  marginBottom: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedItems.includes(timeslot._id)
                    ? "#e0e0e0"
                    : "",
                }}
              >
                <Checkbox
                  checked={selectedItems.includes(timeslot._id)}
                  onChange={() => handleSelectItem(timeslot._id)}
                />
                <Typography variant="body1">
                  <b>Start:</b> {formatDate(timeslot.blockedStartDateTime)} at{" "}
                  {formatTime(timeslot.blockedStartDateTime)}
                </Typography>
                <Typography variant="body1">
                  <b>End:</b> {formatDate(timeslot.blockedEndDateTime)} at{" "}
                  {formatTime(timeslot.blockedEndDateTime)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grow>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDeleteSelectedItems}
        >
          Delete Selected
        </Button>
      </Box>
    </Box>
  );
}
export default BlockoutSingleActivity;
