import { useTheme } from "@emotion/react";
import { Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import AxiosConnect from "../utils/AxiosConnect.js";
import { updateAllActivity, useActivityStore } from "../zustand/GlobalStore";
import Layout from "./Layout";
import ActivityListTable from "./activity/ActivityListTable";

const ViewPublishedActivities = () => {
  const theme = useTheme();

  const subscribeActivitiesData = () => {
    AxiosConnect.get("activity/all")
      .then((body) => {
        console.log("all activity subscribed::", body);
        updateAllActivity(body.data);
      })
      .catch((e) => {
        console.log("Error is ", e.error);
      });
  };
  const { allActivities } = useActivityStore();
  useEffect(() => {
    subscribeActivitiesData();
  }, []);

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

      <ActivityListTable allActivities={allActivities} />
    </Layout>
  );
};

export default ViewPublishedActivities;
