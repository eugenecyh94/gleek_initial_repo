import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ActivityItem from "../../../components/ActivityItem";

const bookmarks = [
  {
    id: 1,
    title: "Title 1",
    vendorName: "Vendor 1",
    caption: "Activity 1 Caption",
    durationMinutes: 200,
    startPricePerPax: 20,
    rating: 4.0,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357",
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
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357",
    date: new Date(2023, 6, 17),
  },
];

function MyBookmarks() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Typography color="secondary" variant="h3">
        My Bookmarks
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
      >
        {bookmarks.map((activity) => (
          <Grid item key={activity.id} xs={4} sm={4} md={4} lg={4} xl={4}>
            <Link
              href={`/shop/activity/${activity.id}`}
              style={{ textDecoration: "none" }}
            >
              <ActivityItem activity={activity} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MyBookmarks;
