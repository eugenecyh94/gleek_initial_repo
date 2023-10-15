import styled from "@emotion/styled";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import ActivityDraftList from "./ActivityDraftList.jsx";
import useActivityStore from "../../../zustand/ActivityStore";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: "#FAFAFA",
}));

const ActivitiesPage = () => {
  const theme = useTheme();
  const {
    activities,
    getActivityForVendor,
    isLoading,
    deleteActivity,
    bulkDeleteActivity,
  } = useActivityStore();

  useEffect(() => {
    const fetchData = async () => {
      await getActivityForVendor();
    };
    fetchData();
  }, [getActivityForVendor]);
  return (
    <StyledPage>
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
        paddingLeft={2}
      >
        View My Activities
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <Box sx={{ paddingLeft: 2 }}>
          <ActivityDraftList
            activities={activities}
            deleteActivity={deleteActivity}
            bulkDeleteActivity={bulkDeleteActivity}
          />
        </Box>
      )}
    </StyledPage>
  );
};

export default ActivitiesPage;
