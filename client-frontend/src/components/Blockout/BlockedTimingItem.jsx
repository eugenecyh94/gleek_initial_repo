import { Paper, Typography } from "@mui/material";
import React from "react";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

const BlockedTimingItem = ({ blockedTimeslot }) => {
  return (
    <Paper
      elevation={2}
      style={{
        marginBottom: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1">
        <b>Start:</b> {formatDate(blockedTimeslot.blockedStartDateTime)} at{" "}
        {formatTime(blockedTimeslot.blockedStartDateTime)}
      </Typography>
      <Typography variant="body1">
      <b>End:</b>  {formatDate(blockedTimeslot.blockedEndDateTime)} at{" "}
        {formatTime(blockedTimeslot.blockedEndDateTime)}
      </Typography>
    </Paper>
  );
};

export default BlockedTimingItem;
