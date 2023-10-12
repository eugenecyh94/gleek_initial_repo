import Add from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import MainBodyContainer from "../../../components/Common/MainBodyContainer";

function BlockoutMultipleActivities() {
  const [blockedStartDateTime, setBlockedStartDateTime] = useState(null);
  const [blockedEndDateTime, setBlockedEndDateTime] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);

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
    const subscribeActivities = async () => {
      try {
        const response = await getActivitiesWithBlockouts();
      } catch (err) {
        console.error(err);
        openSnackbar("Error retrieving your activities.", "error");
      }
    };
    subscribeActivities();
  }, [getActivitiesWithBlockouts, openSnackbar]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);

  const handleAccordionToggle = () => {
    setIsAccordionExpanded((prevExpanded) => !prevExpanded);
  };

  const handleCreateBlockouts = async () => {
    try {
      if (!blockedStartDateTime || !blockedEndDateTime) {
        openSnackbar("Please select a start/end datetime.", "error");
        return;
      }

      if (selectedRows.length === 0) {
        openSnackbar(
          "Please select the activities to apply the blockout to.",
          "error",
        );
        return;
      }

      if (blockedStartDateTime >= blockedEndDateTime) {
        openSnackbar("Start datetime must be before end datetime.", "error");
        return;
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

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["Blockout Dashboard"]}
      breadcrumbLinks={["/vendor/blockout"]}
      currentBreadcrumbName={"Blockout Multiple Activities"}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        p={5}
        width={"100%"}
      >
        <Typography color="secondary" variant="h3">
          Blockout Multiple Activities
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
          width={"100%"}
          position="sticky"
          top="0"
          zIndex="999"
          backgroundColor="#FCFCFC99"
        >
          <Accordion
            expanded={isAccordionExpanded}
            onChange={handleAccordionToggle}
            sx={{}}
          >
            <AccordionSummary
              elevation={1}
              expandIcon={<GridExpandMoreIcon />}
              sx={{
                backgroundColor: "#fcfcfc",
              }}
            >
              <Typography color="primary" variant="h6">
                Select Timing
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "#FCFCFC50",
                borderRadius: "8px",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack spacing={2} paddingTop={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                <BlockedTimingItem
                  blockedTimeslot={{ blockedStartDateTime, blockedEndDateTime }}
                ></BlockedTimingItem>
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
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box mb={3} mt={3}>
          <Divider></Divider>
        </Box>

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
    </MainBodyContainer>
  );
}

export default BlockoutMultipleActivities;
