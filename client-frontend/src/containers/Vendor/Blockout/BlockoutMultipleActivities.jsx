import React, { useState } from "react";
import { Box, Typography, TextField, Stack } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function BlockoutMultipleActivities() {
  const [blockedStartDateTime, setBlockedStartDateTime] = useState(null);
  const [blockedEndDateTime, setBlockedEndDateTime] = useState(null);
  const [activityIds, setActivityIds] = useState([]);

  const handleStartDateTimeChange = (date) => {
    setBlockedStartDateTime(date);
  };

  const handleEndDateTimeChange = (date) => {
    setBlockedEndDateTime(date);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Typography color="secondary" variant="h3">
        Create Blockout Timings
      </Typography>
      <Typography color="primary" variant="h5">
        Timing
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DateTimePicker
            label="Start Date and Time"
            value={blockedStartDateTime}
            onChange={handleStartDateTimeChange}
            renderInput={(params) => (
              <TextField sx={{ width: "100%" }} {...params} />
            )}
            format="YYYY/MM/DD HH:mm a"
          />
          <div>-</div>
          <DateTimePicker
            label="End Date and Time"
            value={blockedEndDateTime}
            onChange={handleEndDateTimeChange}
            renderInput={(params) => (
              <TextField sx={{ width: "100%" }} {...params} />
            )}
            format="YYYY/MM/DD HH:mm a"
          />
        </Stack>
      </LocalizationProvider>
      <Typography color="primary" variant="h5">
        Your Activities
      </Typography>
    </Box>
  );
}

export default BlockoutMultipleActivities;
