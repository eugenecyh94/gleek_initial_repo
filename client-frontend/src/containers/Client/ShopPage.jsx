import React, { useEffect, useState } from "react";
import ActivityCardItem from "../../components/ActivityCardItem";
import {
  Box,
  Typography,
  Grid,
  Link,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
} from "@mui/material";
import useShopStore from "../../zustand/ShopStore";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PriceFilter from "../../components/Filters/PriceFilter";
import CheckBoxGroup from "../../components/Filters/CheckBoxGroup";
import NestedCheckboxList from "../../components/Filters/NestedCheckBoxList";

const ShopPage = (props) => {
  const navigate = useNavigate();
  const {
    activities,
    setActivities,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    currentActivity,
    setCurrentActivity,
    themes,
    searchValue,
    getThemes,
    filter,
    setFilter,
    minPriceValue,
    maxPriceValue,
    getPriceInterval,
    getFilteredActivities,
    getFilteredActivitiesLoading,
    searchValueOnClicked,
    setSearchValue,
    setSearchValueOnClicked,
    setParentChecked,
    setChildChecked,
  } = useShopStore();
  const theme = useTheme();

  const secondary = theme.palette.secondary.main;
  const accent = theme.palette.accent.main;
  const tertiary = theme.palette.tertiary.main;

  const itemsPerPage = 24;

  const totalItems = activities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const displayedActivities = activities.slice(startIndex, endIndex);

  useEffect(() => {
    const sortedActivities = activities.sort(
      (a, b) => b.createdDate - a.createdDate,
    );
    setActivities(sortedActivities);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getThemes();
      await getPriceInterval();
    };
    fetchData();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChange = (event) => {
    setSortBy(event.target.value);
    let sortedActivities = [...activities];
    if (event.target.value === "Newest First") {
      sortedActivities = sortedActivities.sort((a, b) => b.date - a.date);
    } else if (event.target.value === "Price High to Low") {
      sortedActivities = sortedActivities.sort(
        (a, b) => b.minimumPricePerPax - a.minimumPricePerPax,
      );
    } else if (event.target.value === "Price Low to High") {
      sortedActivities = sortedActivities.sort(
        (a, b) => a.minimumPricePerPax - b.minimumPricePerPax,
      );
    }

    setActivities(sortedActivities);
    setCurrentPage(currentPage);
  };

  const [sliderValue, setSliderValue] = React.useState([
    minPriceValue,
    maxPriceValue,
  ]);
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  useEffect(() => {
    setSliderValue([minPriceValue, maxPriceValue]);
  }, [minPriceValue, maxPriceValue]);

  // Fetched from BE
  const Locations = {
    ONSITE: "On-site (within the company premises)",
    OFFSITE: "Off-site (external venues or outdoor locations)",
    VIRTUAL: "Virtual (online sessions)",
    HYBRID: "Hybrid (online + virtual at the same time)",
  };

  const initialLocationState = Object.fromEntries(
    Object.entries(Locations).map(([key, value]) => [value, false]),
  );

  const [locationState, setLocationState] =
    React.useState(initialLocationState);

  const handleLocationChange = (event) => {
    setLocationState({
      ...locationState,
      [event.target.name]: event.target.checked,
    });
  };

  // Fetch from BE
  const SustainableDevelopmentGoals = {
    NO_POVERTY: "No Poverty",
    ZERO_HUNGER: "Zero Hunger",
    GOOD_HEALTH_AND_WELL_BEING: "Good Health and Well-being",
    QUALITY_EDUCATION: "Quality Education",
    GENDER_EQUALITY: "Gender Equality",
    CLEAN_WATER_AND_SANITATION: "Clean Water and Sanitation",
    AFFORDABLE_AND_CLEAN_ENERGY: "Affordable and Clean Energy",
    DECENT_WORK_AND_ECONOMIC_GROWTH: "Decent Work and Economic Growth",
    INDUSTRY_INNOVATION_AND_INFRASTRUCTURE:
      "Industry, Innovation, and Infrastructure",
    REDUCED_INEQUALITIES: "Reduced Inequalities",
    SUSTAINABLE_CITIES_AND_COMMUNITIES: "Sustainable Cities and Communities",
    RESPONSIBLE_CONSUMPTION_AND_PRODUCTION:
      "Responsible Consumption and Production",
    CLIMATE_ACTION: "Climate Action",
    LIFE_BELOW_WATER: "Life Below Water",
    LIFE_ON_LAND: "Life on Land",
    PEACE_AND_JUSTICE_STRONG_INSTITUTIONS:
      "Peace and Justice Strong Institutions",
    PARTNERSHIPS_FOR_THE_GOALS: "Partnerships for the Goals",
  };

  const initialSGState = Object.fromEntries(
    Object.entries(SustainableDevelopmentGoals).map(([key, value]) => [
      value,
      false,
    ]),
  );

  const [sgState, setSGState] = React.useState(initialSGState);
  const handleSGChange = (event) => {
    setSGState({
      ...sgState,
      [event.target.name]: event.target.checked,
    });
  };

  const ActivityDayAvailability = {
    WEEKDAYS: "Weekdays",
    WEEKENDS: "Weekends",
    PUBLIC_HOLIDAYS: "Public Holidays",
  };

  const initialDaysAvailabilityState = Object.fromEntries(
    Object.entries(ActivityDayAvailability).map(([key, value]) => [
      value,
      false,
    ]),
  );

  const [daysAvailabilityState, setDaysAvailabilityState] = React.useState(
    initialDaysAvailabilityState,
  );
  const handleDaysAvailabilityChange = (event) => {
    setDaysAvailabilityState({
      ...daysAvailabilityState,
      [event.target.name]: event.target.checked,
    });
  };

  const TYPE = {
    WORKSHOP: "Workshops",
    TALKS: "Talks/ Seminars/ Webinars",
    LEARNING_JOURNEY: "Learning Journeys",
    POPUP_FOOD: "Popups (Food)",
    POPUP_NONFOOD: "Popups (Non-food)",
  };

  const initialActivityTypeState = Object.fromEntries(
    Object.entries(TYPE).map(([key, value]) => [value, false]),
  );

  const [activityTypeState, setActivityTypeState] = React.useState(
    initialActivityTypeState,
  );
  const handleActivityTypeChange = (event) => {
    setActivityTypeState({
      ...activityTypeState,
      [event.target.name]: event.target.checked,
    });
  };

  const durations = {
    THIRTY_MINS: 30,
    AN_HOUR: 60,
    AN_HOUR_HALF: 90,
    TWO_HOURS: 120,
  };

  const initialDurationState = Object.fromEntries(
    Object.entries(durations).map(([key, value]) => [value, false]),
  );

  const [durationState, setDurationState] =
    React.useState(initialDurationState);
  const handleDurationChange = (event) => {
    setDurationState({
      ...durationState,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    getFilteredActivities(filter, searchValueOnClicked);
  }, [filter]);

  useEffect(() => {
    const locations = Object.entries(locationState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);

    setFilter({ ...filter, locations: locations });
  }, [locationState]);

  useEffect(() => {
    const sgs = Object.entries(sgState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);

    setFilter({ ...filter, sgs: sgs });
  }, [sgState]);

  useEffect(() => {
    const daysAvailability = Object.entries(daysAvailabilityState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);

    setFilter({ ...filter, daysAvailability: daysAvailability });
  }, [daysAvailabilityState]);

  useEffect(() => {
    const activityType = Object.entries(activityTypeState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);

    setFilter({ ...filter, activityType: activityType });
  }, [activityTypeState]);

  useEffect(() => {
    const duration = Object.entries(durationState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);

    setFilter({ ...filter, duration: duration });
  }, [durationState]);

  useEffect(() => {
    setFilter({ ...filter, priceRange: sliderValue });
  }, [sliderValue]);

  const clearAllFilters = () => {
    setFilter({
      themes: [],
      locations: [],
      sgs: [],
      daysAvailability: [],
      activityType: [],
      duration: [],
      priceRange: [null, null],
    });
    setSearchValue("");
    setSearchValueOnClicked("");
    setLocationState(initialLocationState);
    setSGState(initialSGState);
    setDaysAvailabilityState(initialDaysAvailabilityState);
    setActivityTypeState(initialActivityTypeState);
    setDurationState(initialDurationState);
    setSliderValue([minPriceValue, maxPriceValue]);
    setParentChecked([]);
    setChildChecked([]);
  };
  return (
    <Grid container spacing={5} p={5}>
      {/* Left Column */}
      <Grid item xs={12} sm={12} md={12} lg={3}>
        <Button variant="contained" fullWidth onClick={clearAllFilters}>
          CLEAR ALL FILTERS
        </Button>
        <NestedCheckboxList title="Themes" themes={themes} />
        <CheckBoxGroup
          title="Activity Type"
          handleChange={handleActivityTypeChange}
          state={activityTypeState}
          VALUES={TYPE}
        />
        <PriceFilter
          minRangeValue={minPriceValue}
          maxRangeValue={maxPriceValue}
          sliderValue={sliderValue}
          handleSliderChange={handleSliderChange}
        />
        <CheckBoxGroup
          title="Location"
          handleChange={handleLocationChange}
          state={locationState}
          VALUES={Locations}
        />
        <CheckBoxGroup
          title="Duration (minutes)"
          handleChange={handleDurationChange}
          state={durationState}
          VALUES={durations}
        />
        <CheckBoxGroup
          title="Days Availability"
          handleChange={handleDaysAvailabilityChange}
          state={daysAvailabilityState}
          VALUES={ActivityDayAvailability}
        />
        <CheckBoxGroup
          title="Sustainable Development Goals"
          handleChange={handleSGChange}
          state={sgState}
          VALUES={SustainableDevelopmentGoals}
        />
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} sm={12} md={12} lg={9}>
        <Box
          mb={3}
          display="flex"
          flexDirection="row"
          bgcolor={tertiary}
          justifyContent="space-between"
          boxShadow={1}
          p={2}
        >
          <Typography color={accent} variant="h6">
            Showing: {startIndex}-{endIndex} activities of {totalItems}{" "}
            activities
          </Typography>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Typography mr={3} color={accent} variant="h6">
              Sort by:
            </Typography>
            <FormControl size="small">
              <InputLabel id="sort-by-label">Sort by:</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by-select"
                value={sortBy}
                label="Sort By"
                onChange={handleChange}
              >
                <MenuItem value={"Newest First"}>Newest First</MenuItem>
                <MenuItem value={"Price High to Low"}>
                  Price High to Low
                </MenuItem>
                <MenuItem value={"Price Low to High"}>
                  Price Low to High
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        {/* Right Column */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {getFilteredActivitiesLoading && (
            <Grid item xs={4} sm={8} md={12} lg={12} xl={16}>
              <Box display="flex" justifyContent="center">
                <CircularProgress sx={{ margin: "auto" }} />
              </Box>
            </Grid>
          )}
          {!getFilteredActivitiesLoading &&
            displayedActivities.map((activity) => (
              <Grid item key={activity._id} xs={4} sm={4} md={4} lg={4} xl={4}>
                <Link
                  href={`/shop/activity/${activity._id.toString()}`}
                  underline="none"
                  onClick={(event) => {
                    event.preventDefault();
                    const clickedActivity = activities.find(
                      (item) => item._id.toString() === activity._id.toString(),
                    );
                    navigate(`/shop/activity/${activity._id.toString()}`);
                  }}
                >
                  <ActivityCardItem activity={activity} />
                </Link>
              </Grid>
            ))}
        </Grid>
        {/* Pagination Controls */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          mt={5}
        >
          <Button
            color="secondary"
            variant="outlined"
            disabled={currentPage <= 1}
            onClick={() => {
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
          >
            &lt; Previous Page
          </Button>
          <Typography mx={5} color={secondary} variant="h6">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            disabled={currentPage === totalPages}
            color="secondary"
            variant="outlined"
            onClick={() => {
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
          >
            Next Page &gt;
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ShopPage;
