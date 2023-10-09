
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BlockedTimingsDisplayModal from "../../../components/Blockout/BlockedTimingsDisplayModal";
import ViewActivitiesBlockoutTable from "../../../components/Blockout/ViewActivitiesBlockoutTable";
import MainBodyContainer from "../../../components/Common/MainBodyContainer";
import useBlockoutStore from "../../../zustand/BlockoutStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

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
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Blockout Dashboard"}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        p={5}
        width={"100%"}
      >
        <Typography color="secondary" variant="h3" marginBottom={2}>
          Blockout Dashboard
        </Typography>
        <Stack spacing={2}>
          <Box display="flex" flexDirection="row-reverse" alignItems="center">
            <Button
              variant="outlined"
              href="/vendor/blockout/create/mass"
              startIcon={<MoreTimeIcon />}
            >
              Apply Blockouts to Multiple Activities
            </Button>
          </Box>
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
        </Stack>
      </Box>
    </MainBodyContainer>
  );
}

export default BlockoutDashboard;
