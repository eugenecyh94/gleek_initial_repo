import { Grid, styled } from "@mui/material";
import ActivityListItem from "./ActivityListItem";
import { useEffect, useState } from "react";
import { updateAllActivity, useActivityStore } from "../../zustand/GlobalStore";

const GridStyle = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ActivityList = () => {
  const [allActivities, updateAllActivities] = useState(
    useActivityStore.getState().allActivities,
  );

  const MockData = [
    {
      _id: "64eddea82965fac7c8a47860",
      title: "Airport Event",
      description: "This is an airport event",
      price: 20,
      image:
        "https://www.visitsingapore.com/content/dam/mice2-0/plan-your-event/sustainability/host-a-sustainable-event-1-360x203.jpg",
    },
    {
      _id: "64eddfad2965fac7c8a47861",
      title: "MBS Event",
      description: "This is an mbs event",
      price: 15,
      image:
        "https://www.visitsingapore.com/content/dam/mice2-0/plan-your-event/sustainability/host-a-sustainable-event-2-360x203.jpg",
    },
    {
      _id: "64ede00f2965fac7c8a47862",
      title: "Farm Event",
      description: "This is a farm event",
      price: 10,
      image:
        "https://www.visitsingapore.com/content/dam/mice2-0/plan-your-event/sustainability/host-a-sustainable-event-3-360x203.jpg",
    },
  ];

  return (
    //{allActivities.data.map((activity) => (
    <GridStyle container spacing={3}>
      {MockData.map((activity) => (
        <Grid key={activity.name} item xs={12} sm={6} md={4} lg={3}>
          <ActivityListItem key={activity.name} activity={activity} />
        </Grid>
      ))}
    </GridStyle>
  );
};

export default ActivityList;
