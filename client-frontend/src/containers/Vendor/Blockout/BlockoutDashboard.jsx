import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import useBlockoutStore from "../../../zustand/BlockoutStore";
import ViewActivitiesBlockoutTable from "../../../components/Blockout/ViewActivitiesBlockoutTable";
import BlockedTimingsDisplayModal from "../../../components/Blockout/BlockedTimingsDisplayModal";

function BlockoutDashboard() {
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

  if (isLoadingactivitiesWithBlockouts) {
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
        Manage Blockout Timings
      </Typography>
      <Box>
        <Button variant="outlined" href="/vendor/blockout/create/mass">
          Apply Blockouts to Multiple Activities
        </Button>
        <Typography color="primary" variant="h5">
          Activity Blockouts
        </Typography>
        <ViewActivitiesBlockoutTable
          activities={activitiesWithBlockouts}
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
    </Box>
  );
}

export default BlockoutDashboard;
