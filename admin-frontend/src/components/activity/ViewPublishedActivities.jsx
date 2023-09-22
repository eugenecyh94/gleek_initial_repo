import { useTheme } from "@emotion/react";
import { CircularProgress, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useActivityStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import ActivityListTable from "./ActivityListTable";
import MainBodyContainer from "../common/MainBodyContainer";

const ViewPublishedActivities = () => {
  const theme = useTheme();
  const { activities, getActivity, isLoading } = useActivityStore();
  useEffect(() => {
    const fetchData = async () => {
      await getActivity();
    };
    fetchData();
  }, [getActivity]);

  return (
    <MainBodyContainer hasBackButton={false} breadcrumbNames={[]} breadcrumbLinks={[]} currentBreadcrumbName={"View Published Activities"}>
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
        <ActivityListTable allActivities={activities} />
      )}
    </MainBodyContainer>
  );
};

export default ViewPublishedActivities;
