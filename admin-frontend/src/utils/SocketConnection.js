import { useEffect } from "react";
import {
  // activityStateStore,
  updateAllActivity,
} from "../zustand/GlobalStore";
import AxiosConnect from "./AxiosConnect";

const SocketConnection = () => {
  const subscribeData = () => {
    subscribeActivitiesData();
    // subscribeBookingsData();
  };

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

  useEffect(() => {
    subscribeData();
  }, [subscribeData]);
};

export default SocketConnection;
