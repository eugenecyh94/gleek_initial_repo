import { useTheme } from "@emotion/react";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useActivityStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import ActivityListTable from "./ActivityListTable";
import styled from "@emotion/styled";
import InfoIcon from "@mui/icons-material/Info";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const ViewPublishedActivities = () => {
  const theme = useTheme();
  const { activities, getActivity, isLoading, pendingApprovalActivities } =
    useActivityStore();
  useEffect(() => {
    const fetchData = async () => {
      await getActivity();
    };
    fetchData();
  }, [getActivity]);

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={false}
        breadcrumbNames={[]}
        breadcrumbLinks={[]}
        currentBreadcrumbName={"View Published Activities"}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          View Published Activities
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
          <Typography color="#9F91CC">
            View all published activities and handle activity creation requests
          </Typography>
        </div>
        {isLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <ActivityListTable
            activities={activities}
            pendingApprovalActivities={pendingApprovalActivities}
          />
        )}
      </MainBodyContainer>
    </StyledPage>
  );
};

export default ViewPublishedActivities;
