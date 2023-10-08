import styled from "@emotion/styled";
import { Paper, Typography } from "@mui/material";
import React from "react";

const StyledPaper = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 4px 4px 0px 0px rgb(159, 145, 204, 40%);
`;

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

const BlockedTimingItem = ({ blockedTimeslot }) => {
  const hasValidStart =
    blockedTimeslot.blockedStartDateTime !== undefined &&
    blockedTimeslot.blockedStartDateTime !== null;
  const hasValidEnd =
    blockedTimeslot.blockedEndDateTime !== undefined &&
    blockedTimeslot.blockedEndDateTime !== null;

  return (
    <StyledPaper
      elevation={2}
      style={{
        marginBottom: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasValidStart ? (
        <Typography variant="body1">
          <b>Start:</b> {formatDate(blockedTimeslot.blockedStartDateTime)} at{" "}
          {formatTime(blockedTimeslot.blockedStartDateTime)}
        </Typography>
      ) : (
        <Typography variant="body1">
          <b>Start:</b> No timeslot selected
        </Typography>
      )}
      {hasValidEnd ? (
        <Typography variant="body1">
          <b>End:</b> {formatDate(blockedTimeslot.blockedEndDateTime)} at{" "}
          {formatTime(blockedTimeslot.blockedEndDateTime)}
        </Typography>
      ) : (
        <Typography variant="body1">
          <b>End:</b> No timeslot selected
        </Typography>
      )}
    </StyledPaper>
  );
};

export default BlockedTimingItem;
