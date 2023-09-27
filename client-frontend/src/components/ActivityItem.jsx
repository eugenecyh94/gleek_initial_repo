import { Box, Typography, useMediaQuery, Rating, Paper } from "@mui/material";
import React from "react";
import { useTheme, lighten } from "@mui/material/styles";

const ActivityItem = ({ activity }) => {
  const theme = useTheme();
  const accent = theme.palette.accent.main;
  const tertiary = theme.palette.tertiary.main;
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md"),
  );
  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("md", "lg"),
  );
  let containerStyle = {
    height: "15rem", // Default for extra-large screens
    maxWidth: "100%",
    width: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };

  if (isLargeScreen) {
    containerStyle = {
      height: "15rem", // Customize for large screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    };
  }

  if (isMediumScreen) {
    containerStyle = {
      height: "12rem", // Customize for medium screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    };
  }

  if (isSmallScreen) {
    containerStyle = {
      height: "20rem", // Customize for small screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    };
  }
  return (
    <Paper
      display="flex"
      flexDirection="column"
      bgcolor={"grey.50"}
      sx={{ height: "100%", overflow: "hidden"}}
    >
      <Box
        display="flex"
        justifyContent="center"
        width={"100%"}
        bgcolor={"grey.50"}
      >
        {/* Apply styling to the image */}
        <img src={activity.image} alt={activity.title} style={containerStyle} />
      </Box>
      <Box p={3}>
        <Typography color={accent} fontWeight="700" variant="h5">
          {activity.title}
        </Typography>
        <Typography color={accent} mt={2} variant="body1">
          By {activity.vendorName}
        </Typography>
        <Typography color={accent} variant="body1">
          {activity.caption}
        </Typography>
        <Typography color={accent} variant="body1">
          Duration: {activity.durationMinutes} minutes
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box>
            <Typography color={accent} mt={4} variant="body1">
              From{" "}
            </Typography>
            <Typography color={accent} variant="h6" fontWeight="700">
              ${activity.startPricePerPax}/pax
            </Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography color={accent} variant="body2" mr={1}>
              {activity.rating.toFixed(1)}
            </Typography>
            <Rating
              name="rating-read"
              defaultValue={activity.rating}
              precision={0.5}
              size="small"
              readOnly
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ActivityItem;
