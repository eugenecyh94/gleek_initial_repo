import Add from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import BlockedTimingsDisplayModal from "../../../components/Blockout/BlockedTimingsDisplayModal";
import SelectActivityTable from "../../../components/Blockout/SelectActivityTable";
import useBlockoutStore from "../../../zustand/BlockoutStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

function BlockoutMultipleActivities() {
  const [blockedStartDateTime, setBlockedStartDateTime] = useState(null);
  const [blockedEndDateTime, setBlockedEndDateTime] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // list of activityId

  const { openSnackbar } = useSnackbarStore();
  const {
    getActivitiesWithBlockouts,
    isLoadingactivitiesWithBlockouts,
    activitiesWithBlockouts,
    addBlockoutToActivities,
  } = useBlockoutStore();

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCreateBlockouts = async () => {
    try {
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
  }, [getActivitiesWithBlockouts]);

  const handleStartDateTimeChange = (date) => {
    setBlockedStartDateTime(date);
  };

  const handleEndDateTimeChange = (date) => {
    setBlockedEndDateTime(date);
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <DateTimePicker
                label="Start Date and Time"
                value={blockedStartDateTime}
                onChange={handleStartDateTimeChange}
                renderInput={(params) => (
                  <TextField sx={{ width: "100%" }} {...params} />
                )}
                format="YYYY/MM/DD hh:mm a"
              />
              <div>-</div>
              <DateTimePicker
                label="End Date and Time"
                value={blockedEndDateTime}
                onChange={handleEndDateTimeChange}
                renderInput={(params) => (
                  <TextField sx={{ width: "100%" }} {...params} />
                )}
                format="YYYY/MM/DD hh:mm a"
              />
            </Stack>
          </LocalizationProvider>
        </Stack>
        <Box>
          <Button
            startIcon={<Add />}
            variant="contained"
            size="large"
            onClick={handleCreateBlockouts}
          >
            Apply
          </Button>
        </Box>
      </Stack>
      <Box mb={3} mt={3}>
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
