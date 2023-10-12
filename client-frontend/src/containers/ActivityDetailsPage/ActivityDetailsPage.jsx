import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  Modal,
} from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import notFound from "../../assets/not_found.png";
import useShopStore from "../../zustand/ShopStore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GppGoodIcon from "@mui/icons-material/GppGood";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { DatePicker } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import useSnackbarStore from "../../zustand/SnackbarStore";
import useCartStore from "../../zustand/CartStore";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ActivityBookmarkButton from "../../components/Bookmark/ActivityBookmarkButton";
import VendorProfileItem from "../../components/Vendor/VendorProfileItem";
import "./styles.css";
import Holidays from "date-holidays";

const ActivityDetailsPage = () => {
  const {
    currentActivity,
    getCurrentActivity,
    currentActivityLoading,
    getTimeSlots,
    timeSlotsLoading,
    timeSlots,
  } = useShopStore();
  const { addToCart, addToCartLoading } = useCartStore();
  const { activityId } = useParams();
  const theme = useTheme();
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  const accent = theme.palette.accent.main;
  const primary = theme.palette.primary.main;
  const tertiary = theme.palette.tertiary.main;
  const [selectedDate, setSelectedDate] = useState(null);
  const [pax, setPax] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const hd = new Holidays("SG");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState("");
  const { openSnackbar } = useSnackbarStore();

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  useEffect(() => {
    getCurrentActivity(activityId);
  }, [activityId]);

  const handlePaxChange = (event) => {
    const { value } = event.target;
    setPax(value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const shouldDisableDate = (date) => {
    const dayOfWeek = dayjs(date).day();
    const isPublicHoliday = hd.isHoliday(new Date(date));
    const conditionsToCheck = [];
    const phEnabled = false;
    for (const dayAvailability of currentActivity?.dayAvailabilities) {
      if (
        dayAvailability.toLowerCase().includes("weekends") &&
        (dayOfWeek === 0 || dayOfWeek === 6)
      ) {
        // return true if weekend
        conditionsToCheck.push(true);
      }

      if (
        dayAvailability.toLowerCase().includes("weekdays") &&
        dayOfWeek >= 1 &&
        dayOfWeek <= 5
      ) {
        // return true if weekday
        conditionsToCheck.push(true);
      }

      if (
        dayAvailability.toLowerCase().includes("public holidays") &&
        isPublicHoliday
      ) {
        phEnabled = true;
        // return true PH
        conditionsToCheck.push(true);
      }
    }

    if (!phEnabled && isPublicHoliday) {
      return true;
    }
    return !conditionsToCheck.some((condition) => condition);
  };

  const clientPriceCalculated = (pax) => {
    for (const pricingRule of currentActivity?.activityPricingRules) {
      if (pax >= pricingRule.start && pax <= pricingRule.end) {
        return pricingRule.clientPrice;
      }
    }
  };

  // Function to calculate the base price
  const calculateBasePrice = (pax) => {
    return pax * clientPriceCalculated(pax);
  };

  const calculateWeekendAddOn = (selectedDate, weekendPricing) => {
    if (
      weekendPricing.amount !== null &&
      (dayjs(selectedDate).day() === 0 || dayjs(selectedDate).day() === 6)
    ) {
      if (weekendPricing.isDiscount) {
        return -weekendPricing.amount;
      } else {
        return weekendPricing.amount;
      }
    }
    return 0;
  };

  const calculateOnlineAddOn = (location, onlinePricing) => {
    if (
      onlinePricing.amount !== null &&
      (location.toLowerCase().includes("off-site") ||
        location.toLowerCase().includes("on-site"))
    ) {
      if (onlinePricing.isDiscount) {
        return -onlinePricing.amount;
      } else {
        return onlinePricing.amount;
      }
    }
    return 0;
  };

  const calculateOfflineAddOn = (location, offlinePricing) => {
    if (
      offlinePricing.amount !== null &&
      location.toLowerCase().includes("virtual")
    ) {
      if (offlinePricing.isDiscount) {
        return -offlinePricing.amount;
      } else {
        return offlinePricing.amount;
      }
    }
    return 0;
  };

  // Combined function to calculate the total price
  const totalPrice = () => {
    let totalPriceCalculated = calculateBasePrice(pax);

    const weekendAddOn = calculateWeekendAddOn(
      selectedDate,
      currentActivity.weekendPricing,
    );

    const onlineAddOn = calculateOnlineAddOn(
      location,
      currentActivity.offlinePricing,
    );

    const offlineAddOn = calculateOfflineAddOn(
      location,
      currentActivity.onlinePricing,
    );

    totalPriceCalculated =
      totalPriceCalculated + weekendAddOn + onlineAddOn + offlineAddOn;
    return totalPriceCalculated?.toFixed(2);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = async (event) => {
    const weekendAddOn = calculateWeekendAddOn(
      selectedDate,
      currentActivity.weekendPricing,
    );
    const onlineAddOn = calculateOnlineAddOn(
      location,
      currentActivity.offlinePricing,
    );
    const offlineAddOn = calculateOfflineAddOn(
      location,
      currentActivity.onlinePricing,
    );
    const timeParts = time.split(",");
    const cartItem = {
      activityId: currentActivity._id,
      totalPax: Number(pax),
      basePricePerPax: clientPriceCalculated(pax),
      eventLocationType: location,
      additionalComments: comments,
      weekendAddOnCost: weekendAddOn,
      onlineAddOnCost: onlineAddOn,
      offlineAddOnCost: offlineAddOn,
      startDateTime: timeParts[0],
      endDateTime: timeParts[1],
    };
    if (
      cartItem.activityId !== null &&
      cartItem.totalPax.length > 0 &&
      cartItem.basePricePerPax !== null &&
      cartItem.eventLocationType.length > 0
    ) {
      openSnackbar("There are errors in adding this booking to cart", "error");
      return;
    }
    try {
      const responseStatus = await addToCart(cartItem);
      if (responseStatus) {
        openSnackbar("Booking added to cart!", "success");
        setSelectedDate(null);
        setPax("");
        setTime("");
        setLocation("");
        setComments("");
      }
    } catch (error) {
      openSnackbar(error.response.data.msg, "error");
    }
  };
  useEffect(() => {
    // Check if all three variables are defined
    if (pax.length !== 0 && selectedDate !== null && location.length !== 0) {
      getTimeSlots(currentActivity._id, selectedDate);
    }
  }, [pax, selectedDate, location]);

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
            md={8}
            lg={8}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "800px",
                maxHeight: "600px",
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
            md={4}
            lg={4}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <Box
              display="flex"
              flexDirection="column"
              bgcolor="white"
              borderRadius={2}
              width="100%"
              justifyContent="space-between"
              p={2}
              boxShadow={5}
            >
              <Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography mr={1} color={accent} variant="h6">
                    From
                  </Typography>
                  <Box display="flex" flexDirection="row">
                    <Typography variant="caption" color={accent}>
                      $
                    </Typography>
                    <Typography color={accent} variant="h5" fontWeight="700">
                      {currentActivity?.minimumPricePerPax?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography ml={1} color={accent} variant="h6">
                    per pax
                  </Typography>
                </Box>
                <Typography variant="caption" color={accent}>
                  Prices are in $SGD
                </Typography>
                <Box mb={1} mt={1}>
                  <Divider></Divider>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      locale="en"
                    >
                      <FormControl>
                        <DatePicker
                          value={selectedDate}
                          onChange={handleDateChange}
                          format="DD/MM/YYYY"
                          minDate={dayjs().add(
                            currentActivity?.bookingNotice,
                            "days",
                          )}
                          shouldDisableDate={shouldDisableDate}
                          sx={{ marginRight: "12px" }}
                        />
                      </FormControl>
                    </LocalizationProvider>
                    <TextField
                      label="Pax"
                      id="pax"
                      name="pax"
                      type="number"
                      value={pax}
                      onChange={handlePaxChange}
                      inputProps={{
                        min: currentActivity?.minParticipants,
                        max: currentActivity?.maxParticipants,
                      }}
                    />
                  </Box>
                </Box>
                <Box mt={2}>
                  <FormControl fullWidth>
                    <InputLabel id="select-location-label">
                      Select Location
                    </InputLabel>
                    <Select
                      labelId="select-location-label"
                      id="select-location"
                      value={location}
                      label="Select location"
                      onChange={handleLocationChange}
                    >
                      {currentActivity?.location.map((location, index) => (
                        <MenuItem key={index} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box mt={2}>
                  {timeSlotsLoading && (
                    <Grid item xs={4} sm={8} md={12} lg={12} xl={16}>
                      <Box display="flex" justifyContent="center">
                        <CircularProgress sx={{ margin: "auto" }} />
                      </Box>
                    </Grid>
                  )}
                  {!timeSlotsLoading && (
                    <FormControl fullWidth>
                      <InputLabel id="select-time-label">
                        Select Time Slot
                      </InputLabel>
                      <Select
                        labelId="select-time-label"
                        id="select-time"
                        value={time}
                        label="Select time"
                        onChange={handleTimeChange}
                        disabled={
                          selectedDate === null ||
                          pax.length === 0 ||
                          location.length === 0
                        }
                        sx={{
                          // Apply custom styles for the disabled state
                          backgroundColor:
                            selectedDate === null ||
                            pax.length === 0 ||
                            location.length === 0
                              ? "lightgray"
                              : "white",
                          color:
                            selectedDate === null ||
                            pax.length === 0 ||
                            location.length === 0
                              ? "gray"
                              : "black",
                          // Add any other styles you want to apply when disabled or enabled
                        }}
                      >
                        {timeSlots?.map((timeSlot, index) => (
                          <MenuItem
                            key={index}
                            value={`${timeSlot.startTime},${timeSlot.endTime}`}
                          >
                            {new Date(timeSlot.startTime).toLocaleTimeString()}{" "}
                            -{new Date(timeSlot.endTime).toLocaleTimeString()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
                {selectedDate &&
                  pax.length > 0 &&
                  time.length > 0 &&
                  location.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="caption" color={accent}>
                        Base Price
                      </Typography>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                      >
                        <Typography>
                          {pax} Adults X ${" "}
                          {clientPriceCalculated(pax)?.toFixed(2)}
                        </Typography>
                        <Typography>
                          ${(pax * clientPriceCalculated(pax))?.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                {selectedDate &&
                  pax.length > 0 &&
                  time.length > 0 &&
                  location.length > 0 &&
                  ((currentActivity.weekendPricing.amount !== null &&
                    (dayjs(selectedDate).day() == 0 ||
                      dayjs(selectedDate).day() == 6)) ||
                    (currentActivity.offlinePricing.amount !== null &&
                      (location.toLowerCase().includes("off-site") ||
                        location.toLowerCase().includes("on-site"))) ||
                    (currentActivity.onlinePricing.amount !== null &&
                      location.toLowerCase().includes("virtual"))) && (
                    <Box mt={1}>
                      <Typography variant="caption" color={accent}>
                        Add-ons/Discounts
                      </Typography>
                      {(dayjs(selectedDate).day() == 0 ||
                        dayjs(selectedDate).day() == 6) &&
                        currentActivity.weekendPricing.amount !== null && (
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                          >
                            <Typography>Weekend Pricing</Typography>
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                            >
                              <Typography>
                                {currentActivity?.weekendPricing?.isDiscount
                                  ? "-"
                                  : ""}
                              </Typography>
                              <Typography>
                                {currentActivity?.weekendPricing?.isDiscount
                                  ? "-"
                                  : ""}
                                $
                                {currentActivity?.weekendPricing?.amount?.toFixed(
                                  2,
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      {(location.toLowerCase().includes("off-site") ||
                        location.toLowerCase().includes("on-site")) &&
                        currentActivity.offlinePricing.amount !== null && (
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                          >
                            <Typography>Offline Pricing</Typography>
                            <Box>
                              <Typography>
                                {currentActivity?.offlinePricing?.isDiscount
                                  ? "-"
                                  : ""}
                                {""}$
                                {currentActivity?.offlinePricing?.amount?.toFixed(
                                  2,
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      {location.toLowerCase().includes("virtual") &&
                        currentActivity.onlinePricing.amount !== null && (
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                          >
                            <Typography>Online Pricing</Typography>
                            <Box>
                              <Typography>
                                {currentActivity?.onlinePricing?.isDiscount
                                  ? "-"
                                  : ""}
                                {""}$
                                {currentActivity?.onlinePricing?.amount?.toFixed(
                                  2,
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                    </Box>
                  )}
                {selectedDate &&
                  pax.length > 0 &&
                  time.length > 0 &&
                  location.length > 0 && (
                    <Box
                      mt={2}
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Typography
                        color="secondary"
                        variant="subtitle1"
                        fontWeight="700"
                      >
                        Total Price
                      </Typography>

                      <Typography
                        color="secondary"
                        variant="subtitle1"
                        fontWeight="700"
                      >
                        $ {totalPrice()}
                      </Typography>
                    </Box>
                  )}
                <Modal open={isModalOpen} onClose={closeModal}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80%",
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      borderRadius: "25px",
                      p: 4,
                    }}
                  >
                    <Typography color="primary" variant="h5">
                      Add Additional Comments
                    </Typography>
                    <TextField
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter additional comments here"
                    />
                  </Box>
                </Modal>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    disabled={
                      selectedDate === null ||
                      pax.length === 0 ||
                      location.length === 0 ||
                      time.length === 0
                    }
                    onClick={openModal}
                  >
                    Add Additional Comments
                  </Button>
                </Box>
                <Box mt={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={
                      selectedDate === null ||
                      pax.length === 0 ||
                      location.length === 0 ||
                      time.length === 0
                    }
                    color="secondary"
                    style={{ color: "white" }}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </Box>
                <Box mt={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={
                      selectedDate === null ||
                      pax.length === 0 ||
                      location.length === 0 ||
                      time.length === 0
                    }
                  >
                    Download Quotation PDF
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <Box mb={2}>
              <Divider></Divider>
              <Grid container spacing={2} p={2}>
                <Grid item display="flex" flexDirection="row">
                  <AccessTimeIcon color="secondary" />
                  <Typography color="secondary" sx={{ marginLeft: "5px" }}>
                    {currentActivity?.duration} mins
                  </Typography>
                </Grid>
                <Grid item display="flex" flexDirection="row">
                  <LocationOnIcon color="secondary" />
                  {currentActivity?.location.map((location, index) => (
                    <Typography
                      color="secondary"
                      key={index}
                      sx={{ marginLeft: "5px" }}
                    >
                      {index + 1}. {location.split(" ")[0]}
                    </Typography>
                  ))}
                </Grid>
                <Grid item display="flex" flexDirection="row">
                  <CalendarTodayIcon color="secondary" />
                  {currentActivity?.dayAvailabilities.map((location, index) => (
                    <Typography
                      color="secondary"
                      key={index}
                      sx={{ marginLeft: "5px" }}
                    >
                      {index + 1}. {location}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
              <Divider></Divider>
            </Box>
            <Box width="100%" p={2}>
              <Typography mb={2} color={accent} variant="h5" fontWeight="700">
                Overview
              </Typography>
              <Typography
                mb={1}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Pricing:
              </Typography>
              <Grid container spacing={2}>
                {currentActivity?.activityPricingRules.map(
                  (activityPricingRule, index) => (
                    <Grid item key={index}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        bgcolor={
                          index ===
                          currentActivity?.activityPricingRules.length - 1
                            ? tertiary
                            : tertiaryLighter
                        }
                        p={3}
                        borderRadius={5}
                      >
                        {index ===
                        currentActivity?.activityPricingRules.length - 1 ? (
                          <Box display="flex" flexDirection="row">
                            <DiscountIcon color="accent" />
                            <Typography
                              mb={2}
                              ml={1}
                              color={accent}
                              fontWeight={700}
                            >
                              Most For Value Price
                            </Typography>
                          </Box>
                        ) : null}
                        <Box display="flex" flexDirection="row" mb={2}>
                          <Typography variant="caption" color={accent}>
                            $
                          </Typography>
                          <Typography
                            color={accent}
                            variant="h4"
                            fontWeight="700"
                          >
                            {activityPricingRule.clientPrice.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color={accent}>
                            ++
                          </Typography>
                        </Box>
                        <Typography color={accent}>
                          For {activityPricingRule.start} to{" "}
                          {activityPricingRule.end} pax
                        </Typography>
                      </Box>
                    </Grid>
                  ),
                )}
              </Grid>
              {(currentActivity?.offlinePricing?.isDiscount ||
                currentActivity?.onlinePricing?.isDiscount ||
                currentActivity?.weekendPricing?.isDiscount) && (
                <Typography
                  mb={1}
                  color="secondary"
                  variant="subtitle1"
                  fontWeight="700"
                >
                  Discounts:
                </Typography>
              )}
              {currentActivity?.offlinePricing?.isDiscount ? (
                <Box display="flex" flexDirection="row">
                  <LocalOfferIcon color="primary" />
                  <Typography ml={1} variant="caption" color={accent}>
                    $
                  </Typography>
                  <Typography>
                    {currentActivity?.offlinePricing.amount.toFixed(2)} discount
                    for Offline option
                  </Typography>
                </Box>
              ) : null}
              {currentActivity?.onlinePricing?.isDiscount ? (
                <Box display="flex" flexDirection="row">
                  <LocalOfferIcon color="primary" />
                  <Typography ml={1} variant="caption" color={accent}>
                    $
                  </Typography>
                  <Typography>
                    {currentActivity?.onlinePricing.amount.toFixed(2)} discount
                    for Online option
                  </Typography>
                </Box>
              ) : null}
              {currentActivity?.weekendPricing?.isDiscount ? (
                <Box display="flex" flexDirection="row">
                  <LocalOfferIcon color="primary" />
                  <Typography ml={1} variant="caption" color={accent}>
                    $
                  </Typography>
                  <Typography>
                    {currentActivity?.weekendPricing.amount.toFixed(2)} discount
                    for Weekend option
                  </Typography>
                </Box>
              ) : null}
              {((!currentActivity?.offlinePricing?.isDiscount &&
                currentActivity?.offlinePricing?.amount !== null) ||
                (!currentActivity?.onlinePricing?.isDiscount &&
                  currentActivity?.onlinePricing?.amount !== null) ||
                (!currentActivity?.weekendPricing?.isDiscount &&
                  currentActivity?.weekendPricing?.amount !== null)) && (
                <Typography
                  mb={1}
                  color="secondary"
                  variant="subtitle1"
                  fontWeight="700"
                >
                  Add-ons:
                </Typography>
              )}
              {!currentActivity?.offlinePricing?.isDiscount &&
              currentActivity?.offlinePricing?.amount !== null ? (
                <Box display="flex" flexDirection="row">
                  <LocalOfferIcon color="primary" />
                  <Typography ml={1} variant="caption" color={accent}>
                    $
                  </Typography>
                  <Typography>
                    {currentActivity?.offlinePricing.amount.toFixed(2)} discount
                    for Offline option
                  </Typography>
                </Box>
              ) : null}
              {!currentActivity?.onlinePricing?.isDiscount &&
              currentActivity?.onlinePricing?.amount !== null ? (
                <Box display="flex" flexDirection="row">
                  <LocalOfferIcon color="primary" />
                  <Typography ml={1} variant="caption" color={accent}>
                    $
                  </Typography>
                  <Typography>
                    {currentActivity?.onlinePricing.amount.toFixed(2)} discount
                    for Online option
                  </Typography>
                </Box>
              ) : null}
              {!currentActivity?.weekendPricing?.isDiscount &&
              currentActivity?.weekendPricing?.amount !== null ? (
                <Box display="flex" flexDirection="row">
                  <LocalOfferIcon color="primary" />
                  <Typography ml={1} variant="caption" color={accent}>
                    $
                  </Typography>
                  <Typography>
                    {currentActivity?.weekendPricing.amount.toFixed(2)} discount
                    for Weekend option
                  </Typography>
                </Box>
              ) : null}
              <Typography
                mb={1}
                mt={2}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Requirements:
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt={1}
              >
                <CalendarMonthIcon color="primary" />
                <Typography sx={{ marginLeft: "5px" }}>
                  Book <b>{currentActivity?.bookingNotice}</b> days in advance
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt={1}
              >
                <PeopleAltIcon color="primary" />
                <Typography sx={{ marginLeft: "5px" }}>
                  Minimum No. of Pax per booking:{" "}
                  <b>{currentActivity?.minParticipants}</b>
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt={1}
              >
                <PeopleAltIcon color="primary" />
                <Typography sx={{ marginLeft: "5px" }}>
                  Maximum No. of Pax per booking:{" "}
                  <b> {currentActivity?.maxParticipants}</b>
                </Typography>
              </Box>
              <Typography
                mb={1}
                mt={2}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Theme:
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt={1}
              >
                <Typography>{currentActivity?.theme?.name}</Typography>
              </Box>
              <Typography
                mb={1}
                mt={2}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Subthemes:
              </Typography>
              {currentActivity?.subtheme.map((subtheme, index) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  key={index}
                  mt={1}
                >
                  <ArrowRightIcon color="primary" />
                  <Typography sx={{ marginLeft: "5px" }}>
                    {subtheme?.name.split(" ")[0]}
                  </Typography>
                </Box>
              ))}
              <Typography
                mb={1}
                mt={2}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Activity Type:
              </Typography>
              <Typography mb={2}>{currentActivity?.activityType}</Typography>
              <Typography
                mb={1}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Description:
              </Typography>
              <Typography sx={{ flex: 1, textAlign: "justify" }} mb={2}>
                {currentActivity?.description}
              </Typography>
              <Typography
                mb={1}
                color="secondary"
                variant="subtitle1"
                fontWeight="700"
              >
                Sustainable Development Goals:
              </Typography>
              {currentActivity?.sdg.map((sdg, index) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  key={index}
                  mt={1}
                >
                  <GppGoodIcon color="primary" />
                  <Typography sx={{ marginLeft: "5px" }}>
                    {sdg.split(" ")[0]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <Box
              boxShadow={2}
              borderRadius={2}
              width="100%"
              bgcolor="white"
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
          ></Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ActivityDetailsPage;
