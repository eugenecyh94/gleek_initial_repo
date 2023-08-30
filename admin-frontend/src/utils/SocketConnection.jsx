import { useEffect } from "react";
import {
  updateAllActivity,
} from "../zustand/GlobalStore";
import AxiosConnect from "./AxiosConnect";

const SocketConnection = () => {

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

  const subscribeData = () => {
    subscribeActivitiesData();
    // subscribeBookingsData();
  };

  useEffect(() => {
    subscribeData();
  }, [subscribeData]);

  return <></>;
};

export default SocketConnection;
