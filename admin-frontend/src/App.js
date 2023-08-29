import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import ActivityList from "./components/activity/ActivityList";
import AxiosConnect from "./utils/AxiosConnect";
import { updateAllActivity } from "./zustand/GlobalStore";

function App() {
  //TODO - extract subscribe data function into external component SocketConnection.js
  useEffect(() => {
    const subscribeData = () => {
      subscribeActivitiesData();
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
    subscribeData();
  }, []);

  return (
    <div>
      <Routes>
        <Route exact path="/" element={<ActivityList />} />
      </Routes>
    </div>
  );
}

export default App;
