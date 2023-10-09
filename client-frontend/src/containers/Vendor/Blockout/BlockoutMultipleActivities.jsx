import Add from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import BlockedTimingItem from "../../../components/Blockout/BlockedTimingItem";
import BlockedTimingsDisplayModal from "../../../components/Blockout/BlockedTimingsDisplayModal";
import SelectActivityTable from "../../../components/Blockout/SelectActivityTable";
import useBlockoutStore from "../../../zustand/BlockoutStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

function BlockoutMultipleActivities() {
  const [blockedStartDateTime, setBlockedStartDateTime] = useState(null);
  const [blockedEndDateTime, setBlockedEndDateTime] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // list of activityId

  const [startError, setStartError] = useState(null); // Start date validation error
  const [endError, setEndError] = useState(null); // End date validation error
  const [endMinDate, setEndMinDate] = useState(null);

  const { openSnackbar } = useSnackbarStore();
  const {
    getActivitiesWithBlockouts,
    isLoadingactivitiesWithBlockouts,
    activitiesWithBlockouts,
    addBlockoutToActivities,
  } = useBlockoutStore();

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const subscribeVendor = async () => {
      try {
        const response = await getActivitiesWithBlockouts();
      } catch (err) {
        console.error(err);
        openSnackbar("Error retrieving your activities.", "error");
      }
    };
    subscribeVendor();
  }, [getActivitiesWithBlockouts, openSnackbar]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateBlockouts = async () => {
    try {
      if (!blockedStartDateTime || !blockedEndDateTime) {
        openSnackbar("Please select a start/end datetime.", "error");
        return; // Prevent blockout creation if validation fails
      }

      if (selectedRows.length === 0) {
        openSnackbar(
          "Please select the activities to apply the blockout to.",
          "error",
        );
        return; // Prevent blockout creation if validation fails
      }

      if (blockedStartDateTime >= blockedEndDateTime) {
        openSnackbar("Start datetime must be before end datetime.", "error");
        return; // Prevent blockout creation if validation fails
      }
      await addBlockoutToActivities(
        blockedStartDateTime,
        blockedEndDateTime,
        selectedRows,
      );
      openSnackbar("Saved successfully.");

      setSelectedRows([]);
      setSelectedActivity(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartDateTimeChange = (date) => {
    setBlockedStartDateTime(date);
    // Validate start date
    if (blockedEndDateTime && date >= blockedEndDateTime) {
      setEndError("End datetime must be after start datetime.");
    } else {
      setEndError(null);
      // Update the minDateTime for endDateTimePicker
      if (date) {
        setEndMinDate(date.add(1, "minute"));
      }
    }
  };

  const handleEndDateTimeChange = (date) => {
    setBlockedEndDateTime(date);
    // Validate end date
    if (date <= blockedStartDateTime) {
      setEndError("End datetime must be after start datetime.");
    } else {
      setEndError(null);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Typography color="secondary" variant="h3">
        Create Blockout Timings
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack spacing={2}>
          <Typography color="primary" variant="h5">
            Select Timing
          </Typography>
          <BlockedTimingItem
            blockedTimeslot={{ blockedStartDateTime, blockedEndDateTime }}
          ></BlockedTimingItem>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FormControl
                fullWidth
                error={!!startError}
                sx={{ minHeight: "100px" }}
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
                sx={{ minHeight: "100px" }}
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
                  } // Set the minDate to prevent selecting earlier dates
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
            onClick={handleCreateBlockouts}
            disabled={startError || endError}
          >
            Apply
          </Button>
        </Box>
      </Stack>
      <Box mb={3}>
        <Divider></Divider>
      </Box>
      <Typography color="primary" variant="h5">
        Your Activities
      </Typography>

      <SelectActivityTable
        activities={activitiesWithBlockouts}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        setOpenModal={setOpenModal}
        openModal={openModal}
      />
      <BlockedTimingsDisplayModal
        open={openModal}
        handleClose={handleCloseModal}
        selectedActivity={selectedActivity}
      />
    </Box>
  );
}

export default BlockoutMultipleActivities;
