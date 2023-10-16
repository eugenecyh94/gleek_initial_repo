import styled from "@emotion/styled";
import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  Grow,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlockedTimingItem from "../../../components/Blockout/BlockedTimingItem";
import useBlockoutStore from "../../../zustand/BlockoutStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import MainBodyContainer from "../../../components/Common/MainBodyContainer";

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
    addBlockout,
    activityTitle,
    getActivityTitle,
  } = useBlockoutStore();
  const { openSnackbar } = useSnackbarStore();
  const { activityId } = useParams();

  const currentDate = new Date();

  const [selectedItems, setSelectedItems] = useState([]);
  const [blockedStartDateTime, setBlockedStartDateTime] = useState(null);
  const [blockedEndDateTime, setBlockedEndDateTime] = useState(null);

  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);

  useEffect(() => {
    const subscribeBlockouts = async () => {
      try {
        await getBlockoutsByActivityId(activityId);
        await getActivityTitle(activityId);
      } catch (err) {
        console.error(err);
        openSnackbar("Error retrieving your activity.", "error");
      }
    };
    subscribeBlockouts();
  }, [getBlockoutsByActivityId, openSnackbar, activityId, getActivityTitle]);

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

  const handleCreateBlockout = async () => {
    try {
      if (!blockedStartDateTime || !blockedEndDateTime) {
        openSnackbar("Please select a start/end datetime.", "error");
        return;
      }

      if (blockedStartDateTime >= blockedEndDateTime) {
        openSnackbar("Start datetime must be before end datetime.", "error");
        return;
      }
      await addBlockout(blockedStartDateTime, blockedEndDateTime, activityId);
      openSnackbar("Saved successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };

  const handleStartDateTimeChange = (date) => {
    setBlockedStartDateTime(date);

    if (blockedEndDateTime && date >= blockedEndDateTime) {
      setEndError("End datetime must be after start datetime.");
    } else {
      setEndError(null);
    }
  };

  const handleEndDateTimeChange = (date) => {
    setBlockedEndDateTime(date);

    if (date <= blockedStartDateTime) {
      setEndError("End datetime must be after start datetime.");
    } else {
      setEndError(null);
    }
  };

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
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["Blockout Dashboard"]}
      breadcrumbLinks={["/vendor/blockout"]}
      currentBreadcrumbName={`Manage ${activityTitle} Blockouts`}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        p={5}
        width={"100%"}
      >
        <Typography color="secondary" variant="h3">
          Manage <b>{activityTitle}</b> Blockouts
        </Typography>
        <Typography variant="h6" gutterBottom color="primary" marginTop={2}>
          Add New Timing
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack spacing={2} paddingTop={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BlockedTimingItem
                blockedTimeslot={{ blockedStartDateTime, blockedEndDateTime }}
              ></BlockedTimingItem>
              <Stack direction="row" alignItems="center" spacing={2}>
                <FormControl
                  fullWidth
                  error={!!startError}
                  sx={{ minHeight: "100px", backgroundColor: "white" }}
                >
                  <DateTimePicker
                    label="Start Date and Time"
                    value={blockedStartDateTime}
                    onChange={handleStartDateTimeChange}
                    format="YYYY/MM/DD hh:mm a"
                    minDate={dayjs()}
                  />
                  <FormHelperText>{startError}</FormHelperText>
                </FormControl>

                <FormControl
                  fullWidth
                  error={!!endError}
                  sx={{ minHeight: "100px", backgroundColor: "white" }}
                >
                  <DateTimePicker
                    label="End Date and Time"
                    value={blockedEndDateTime}
                    onChange={handleEndDateTimeChange}
                    format="YYYY/MM/DD hh:mm a"
                    minDateTime={
                      blockedStartDateTime
                        ? blockedStartDateTime.add(1, "minute")
                        : null
                    }
                    maxDateTime={
                      blockedStartDateTime
                        ? dayjs(blockedStartDateTime)
                            .set("hour", 23)
                            .set("minute", 59)
                        : null
                    }
                  />
                  <FormHelperText>{endError}</FormHelperText>
                </FormControl>
              </Stack>
            </LocalizationProvider>
          </Stack>

          <Box>
            <Button
              startIcon={<Add />}
              variant="contained"
              size="large"
              color="secondary"
              onClick={handleCreateBlockout}
              disabled={startError || endError}
            >
              Apply
            </Button>
          </Box>
        </Stack>
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
        <Box display="flex" flexDirection="row-reverse" alignItems="center">
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleDeleteSelectedItems}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </MainBodyContainer>
  );
}
export default BlockoutSingleActivity;
