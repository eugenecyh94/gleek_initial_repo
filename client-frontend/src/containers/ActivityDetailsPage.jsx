import React from "react";
import useShopStore from "../zustand/ShopStore";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme, lighten } from "@mui/material/styles";

const ActivityDetailsPage = () => {
  const { currentActivity } = useShopStore();
  const { activityId } = useParams();
  const theme = useTheme();
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  const accent = theme.palette.accent.main;

  return (
    <Grid container spacing={2} p={5}>
      <Grid item xs={12} sm={12} md={5} lg={5}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src={currentActivity.image}
            alt={currentActivity.title}
            style={{ height: "100%", maxWidth: "100%", borderRadius: "8px" }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={7} lg={7}>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor={tertiaryLighter}
          borderRadius={2}
          height="100%"
          justifyContent="space-between"
          p={3}
        >
          <Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box display="flex" flexDirection="column">
                <Typography color={accent} fontWeight="700" variant="h4">
                  {currentActivity.title}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Typography mr={2} color={accent} variant="h6">
                  Starting from
                </Typography>
                <Typography color={accent} variant="h4" fontWeight="700">
                  ${currentActivity.startPricePerPax}/pax
                </Typography>
              </Box>
            </Box>
            <Box mb={3} mt={3}>
              <Divider></Divider>
            </Box>
            <Typography mb={2} color={accent} variant="h6">
              {currentActivity.caption}
            </Typography>
            <Typography mb={2} color={accent} variant="body1">
              Ideal duration: {currentActivity.durationMinutes} mins
            </Typography>
            <Typography color={accent} variant="body1">
              {currentActivity.description}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={5}>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor={tertiaryLighter}
          borderRadius={2}
          justifyContent="center"
          p={3}
        >
          <Typography color={accent} variant="h5">
            By {currentActivity.vendorName}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={7} lg={7}>
        <Box
          boxShadow={2}
          borderRadius={2}
          bgcolor={tertiaryLighter}
          height="100%"
          p={3}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="h6" mr={5}>
                Number of pax:{" "}
              </Typography>
              <TextField
                id="outlined-number"
                label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Button variant="contained" sx={{ marginRight: "10px" }}>
              Download Quotation
            </Button>
            <Button variant="contained">Add to Cart</Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={5}></Grid>
      <Grid item xs={12} sm={12} md={5} lg={7}>
        <Paper>
          <Typography variant="h6">Ratings</Typography>
        </Paper>
        <Paper>
          <Typography variant="h6">Detailed Ratings</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ActivityDetailsPage;
