import { useTheme } from "@emotion/react";
import { Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { activityStore, useAdminStore } from "../zustand/GlobalStore";
import Layout from "./Layout";
import ActivityListTable from "./activity/ActivityListTable";

const ViewPublishedActivities = () => {
  const theme = useTheme();
  const { activities, getActivity } = activityStore();
  const { token } = useAdminStore();
  useEffect(() => {
    async function fetchData() {
      await getActivity(token);
    }
    fetchData();
  }, [getActivity, token]);

  return (
    <Layout>
      <Toolbar />
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        View Published Activities
      </Typography>

      <ActivityListTable allActivities={activities} />
    </Layout>
  );
};

export default ViewPublishedActivities;
