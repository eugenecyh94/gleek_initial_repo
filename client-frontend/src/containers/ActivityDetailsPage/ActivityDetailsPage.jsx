import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import notFound from "../../assets/not_found.png";
import useShopStore from "../../zustand/ShopStore";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ActivityBookmarkButton from "../../components/Bookmark/ActivityBookmarkButton";
import VendorProfileItem from "../../components/Vendor/VendorProfileItem";
import "./styles.css";

const ActivityDetailsPage = () => {
  const { currentActivity, getCurrentActivity, currentActivityLoading } =
    useShopStore();
  const { activityId } = useParams();
  const theme = useTheme();
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  const accent = theme.palette.accent.main;
  const primary = theme.palette.primary.main;

  useEffect(() => {
    getCurrentActivity(activityId);
  }, [activityId]);

  return (
    <Box>
      {currentActivityLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
      {!currentActivityLoading && (
        <Grid container spacing={2} p={5}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              p={1}
            >
              <Box>
                <Typography color={accent} fontWeight="700" variant="h4" mb={2}>
                  {currentActivity?.title}
                </Typography>
                {currentActivity?.linkedVendor && (
                  <VendorProfileItem vendor={currentActivity?.linkedVendor} />
                )}
              </Box>

              <ActivityBookmarkButton activityId={activityId} />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "500px",
              }}
            >
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
              >
                {currentActivity?.preSignedImages &&
                  currentActivity?.preSignedImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`Img ${index}`}
                        style={{
                          height: "100%",
                          maxWidth: "100%",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                {!currentActivity?.preSignedImages.length > 0 ? (
                  <SwiperSlide key={0}>
                    <img
                      src={notFound}
                      alt={currentActivity?.title}
                      style={{
                        height: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  </SwiperSlide>
                ) : null}
              </Swiper>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
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
                    <Typography color={accent} fontWeight="700" variant="h5">
                      {currentActivity?.title}
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
                      ${currentActivity?.startPricePerPax}/pax
                    </Typography>
                  </Box>
                </Box>
                <Box mb={3} mt={3}>
                  <Divider></Divider>
                </Box>
                <Typography mb={2} color={accent} variant="body1">
                  Ideal duration: {currentActivity?.durationMinutes} mins
                </Typography>
                <Typography color={accent} variant="body1">
                  {currentActivity?.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <Box
              boxShadow={2}
              borderRadius={2}
              width="100%"
              bgcolor={"grey.50"}
              p={3}
            >
              <Typography>No Ratings yet</Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <Box
              boxShadow={2}
              borderRadius={2}
              width="100%"
              bgcolor={"grey.50"}
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
        </Grid>
      )}
    </Box>
  );
};

export default ActivityDetailsPage;
