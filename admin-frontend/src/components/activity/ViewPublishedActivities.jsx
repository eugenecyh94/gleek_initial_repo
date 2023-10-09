import { useTheme } from "@emotion/react";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useActivityStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import ActivityListTable from "./ActivityListTable";
import styled from "@emotion/styled";

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
