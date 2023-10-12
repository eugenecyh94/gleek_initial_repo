import { CircularProgress, Typography, useTheme } from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import { useActivityStore, useAdminStore } from "../../zustand/GlobalStore";
import ActivityDraftList from "./ActivityDraftList";
import { useEffect } from "react";
import styled from "@emotion/styled";
import InfoIcon from "@mui/icons-material/Info";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const ViewActivityDrafts = () => {
  const theme = useTheme();
  const {
    activities,
    getActivityForAdmin,
    isLoading,
    deleteActivity,
    bulkDeleteActivity,
  } = useActivityStore();
  const { admin } = useAdminStore();
  useEffect(() => {
    const fetchData = async () => {
      await getActivityForAdmin(admin._id);
    };
    fetchData();
  }, [getActivityForAdmin]);
  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={false}
        breadcrumbNames={[]}
        breadcrumbLinks={[]}
        currentBreadcrumbName={"View My Activities"}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          View My Activities
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
          <Typography color="#9F91CC">
            View all the activities I created
          </Typography>
        </div>

        {isLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <ActivityDraftList
            activities={activities}
            deleteActivity={deleteActivity}
            bulkDeleteActivity={bulkDeleteActivity}
          />
        )}
      </MainBodyContainer>
    </StyledPage>
  );
};

export default ViewActivityDrafts;
