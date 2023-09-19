import React, { useEffect, useState } from "react";
import ActivityItem from "../components/ActivityItem";
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
} from "@mui/material";
import useShopStore from "../zustand/ShopStore";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PriceFilter from "../components/Filters/PriceFilter";
import CheckBoxGroup from "../components/Filters/CheckBoxGroup";
import RadioButtonGroup from "../components/Filters/RadioButtonGroup";
const ShopPage = (props) => {
  const navigate = useNavigate();
  const activitiesSampleData = [
    {
      id: 1,
      title: "Title 1",
      vendorName: "Vendor 1", //By aggregating Vendor and Activity tables
      caption: "Activity 1 Caption",
      durationMinutes: 200, // ideal duration?
      startPricePerPax: 20,
      rating: 4.0,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 17),
    },
    {
      id: 2,
      title: "Title 2",
      vendorName: "Vendor 2",
      caption: "Activity 2 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg",
      date: new Date(2023, 6, 18),
    },
    {
      id: 3,
      title: "Title 3",
      vendorName: "Vendor 3",
      caption: "Activity 3 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg",
      date: new Date(2023, 6, 19),
    },
    {
      id: 4,
      title: "Title 4",
      vendorName: "Vendor 4",
      caption: "Activity 4 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://image.shutterstock.com/image-vector/dotted-spiral-vortex-royaltyfree-images-600w-2227567913.jpg",
      date: new Date(2023, 6, 10),
    },
    {
      id: 5,
      title: "Title 5",
      vendorName: "Vendor 5",
      caption: "Activity 5 Caption",
      durationMinutes: 200,
      startPricePerPax: 10,
      rating: 4.0,
      description: "description",
      image:
        "https://image.shutterstock.com/image-vector/dotted-spiral-vortex-royaltyfree-images-600w-2227567913.jpg",
      date: new Date(2023, 6, 20),
    },
    {
      id: 6,
      title: "Title 6",
      vendorName: "Vendor 6",
      caption: "Activity 6 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 21),
    },
    {
      id: 7,
      title: "Title 7",
      vendorName: "Vendor 7",
      caption: "Activity 7 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 22),
    },
    {
      id: 8,
      title: "Title 8",
      vendorName: "Vendor 8",
      caption: "Activity 8 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 23),
    },
    {
      id: 9,
      title: "Title 9",
      vendorName: "Vendor 9",
      caption: "Activity 9 Caption",
      durationMinutes: 200,
      startPricePerPax: 40,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 24),
    },
    {
      id: 10,
      title: "Title 10",
      vendorName: "Vendor 10",
      caption: "Activity 10 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 25),
    },
    {
      id: 11,
      title: "Title 11",
      vendorName: "Vendor 11",
      caption: "Activity 11 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 6, 26),
    },
    {
      id: 12,
      title: "Title 12",
      vendorName: "Vendor 12",
      caption: "Activity 12 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg",
      date: new Date(2023, 5, 17),
    },
    {
      id: 13,
      title: "Title 13",
      vendorName: "Vendor 13", //By aggregating Vendor and Activity tables
      caption: "Activity 13 Caption",
      durationMinutes: 200, // ideal duration?
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 18),
    },
    {
      id: 14,
      title: "Title 14",
      vendorName: "Vendor 14",
      caption: "Activity 14 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg",
      date: new Date(2023, 5, 19),
    },
    {
      id: 15,
      title: "Title 15",
      vendorName: "Vendor 15",
      caption: "Activity 15 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg",
      date: new Date(2023, 5, 20),
    },
    {
      id: 16,
      title: "Title 16",
      vendorName: "Vendor 16",
      caption: "Activity 16 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://image.shutterstock.com/image-vector/dotted-spiral-vortex-royaltyfree-images-600w-2227567913.jpg",
      date: new Date(2023, 5, 21),
    },
    {
      id: 17,
      title: "Title 17",
      vendorName: "Vendor 17",
      caption: "Activity 17 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://image.shutterstock.com/image-vector/dotted-spiral-vortex-royaltyfree-images-600w-2227567913.jpg",
      date: new Date(2023, 5, 22),
    },
    {
      id: 18,
      title: "Title 18",
      vendorName: "Vendor 18",
      caption: "Activity 18 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 23),
    },
    {
      id: 19,
      title: "Title 19",
      vendorName: "Vendor 19",
      caption: "Activity 19 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 24),
    },
    {
      id: 20,
      title: "Title 20",
      vendorName: "Vendor 20",
      caption: "Activity 20 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 25),
    },
    {
      id: 21,
      title: "Title 21",
      vendorName: "Vendor 21",
      caption: "Activity 21 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 26),
    },
    {
      id: 22,
      title: "Title 22",
      vendorName: "Vendor 22",
      caption: "Activity 22 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 27),
    },
    {
      id: 23,
      title: "Title 23",
      vendorName: "Vendor 23",
      caption: "Activity 23 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      date: new Date(2023, 5, 28),
    },
    {
      id: 24,
      title: "Title 24",
      vendorName: "Vendor 24",
      caption: "Activity 24 Caption",
      durationMinutes: 200,
      startPricePerPax: 20,
      rating: 4.0,
      description: "description",
      image:
        "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg",
      date: new Date(2023, 5, 29),
    },
  ];
  const {
    activities,
    setActivities,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    currentActivity,
    setCurrentActivity,
  } = useShopStore();
  const theme = useTheme();

  const secondary = theme.palette.secondary.main;
  const accent = theme.palette.accent.main;
  const tertiary = theme.palette.tertiary.main;

  const itemsPerPage = 12;

  const totalItems = activities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const displayedActivities = activities.slice(startIndex, endIndex);

  useEffect(() => {
    const sortedActivities = activitiesSampleData.sort(
      (a, b) => b.date - a.date
    );
    setActivities(sortedActivities);
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
        (a, b) => b.startPricePerPax - a.startPricePerPax
      );
    } else if (event.target.value === "Price Low to High") {
      sortedActivities = sortedActivities.sort(
        (a, b) => a.startPricePerPax - b.startPricePerPax
      );
    }

    setActivities(sortedActivities);
    setCurrentPage(currentPage);
  };

  const minRangeValue = 0;
  const maxRangeValue = 100;
  const [sliderValue, setSliderValue] = React.useState([
    minRangeValue,
    maxRangeValue,
  ]);
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  // Fetched from BE
  const Locations = {
    ONSITE: "On-site (within the company premises)",
    OFFSITE: "Off-site (external venues or outdoor locations)",
    VIRTUAL: "Virtual (online sessions)",
    HYBRID: "Hybrid (online + virtual at the same time)",
  };

  const initialLocationState = Object.fromEntries(
    Object.entries(Locations).map(([key, value]) => [key, false])
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
      key,
      false,
    ])
  );

  const [sgState, setSGState] = React.useState(initialSGState);
  const handleSGChange = (event) => {
    setSGState({
      ...sgState,
      [event.target.name]: event.target.checked,
    });
  };

  const SIZE = {
    COSY: "Cosy (1-10 participants)",
    SMALL: "Small (11-20 participants)",
    MEDIUM: "Medium (21-30 participants)",
    LARGE: "Large (31+ participants)",
  };

  const [durationState, setDurationState] = useState("");

  const handleDurationChange = (event) => {
    setDurationState(event.target.value);
  };
  return (
    <Grid container spacing={5} p={5}>
      {/* Left Column */}
      <Grid item xs={12} sm={12} md={12} lg={3}>
        <PriceFilter
          minRangeValue={minRangeValue}
          maxRangeValue={maxRangeValue}
          sliderValue={sliderValue}
          handleSliderChange={handleSliderChange}
        />
        <RadioButtonGroup
          value={durationState}
          handleChange={handleDurationChange}
          title="Duration"
          VALUES={SIZE}
        />
        <CheckBoxGroup
          title="Location"
          handleChange={handleLocationChange}
          state={locationState}
          VALUES={Locations}
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
          {displayedActivities.map((activity) => (
            <Grid item key={activity.id} xs={4} sm={4} md={4} lg={4} xl={4}>
              <Link
                href={`/shop/activity/${activity.id}`}
                underline="none"
                onClick={(event) => {
                  event.preventDefault();
                  const clickedActivity = activities.find(
                    (item) => item.id === activity.id
                  );
                  if (clickedActivity) {
                    setCurrentActivity(clickedActivity);
                  }
                  navigate(`/shop/activity/${activity.id}`);
                }}
              >
                <ActivityItem activity={activity} />
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
