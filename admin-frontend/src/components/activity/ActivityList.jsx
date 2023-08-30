import { Grid, styled } from "@mui/material";
import ActivityListItem from "./ActivityListItem";
import { useEffect, useState } from "react";
import { updateAllActivity, useActivityStore } from "../../zustand/GlobalStore";
import CircularProgress from "@mui/material/CircularProgress";

const GridStyle = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ActivityList = () => {
  const [allActivities, updateAllActivities] = useState(
    useActivityStore.getState().allActivities,
  );
  const [isLoading, updateIsLoading] = useState(true);

  useEffect(() => {
    useActivityStore.subscribe((newState, prevState) => {
      console.log(
        "activity store detected newState::",
        newState.allActivities.data,
      );
      updateAllActivities(newState.allActivities.data);
    });
    updateIsLoading(false);
  }, [isLoading, updateIsLoading, updateAllActivities]);

  useEffect(() => {
    console.log("isloading status::", isLoading);
    console.log("allActivityState::", allActivities);
  }, [isLoading, allActivities]);

  return (
      <>
        {isLoading && <CircularProgress/>}
        {!isLoading && <GridStyle container spacing={3}>
          {allActivities.map((activity) => (
              <Grid key={activity.name} item xs={12} sm={6} md={4} lg={3}>
                <ActivityListItem key={activity.name} activity={activity}/>
              </Grid>
          ))}
        </GridStyle>}
      </>
  );
};

export default ActivityList;
