import {
  Avatar,
  Box,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
    type: "ACTIVITY",
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
    type: "ACTIVITY",
  },
  {
    _id: "651427401f60e1b759914fdb",
    activity: null,
    vendor: {
      _id: "650e73b36f3dd9da59896cbd",
      companyName: "Company A",
      vendorType: "B Corp",
      vendorDetails: "Company A",
    },
    client: "650e74840be4238bb3279730",
    isBookmarked: true,
    type: "VENDOR",
    created: "2023-09-27T12:59:44.968Z",
    updated: "2023-09-27T13:00:04.294Z",
  
  },
];

function MyBookmarks() {
  const [activityBookmarks, setActivityBookmarks] = useState([]);
  const [vendorBookmarks, setVendorBookmarks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("activity");

  useEffect(() => {
    const fetchBookmarks = async () => {
      const data = bookmarks;
      const activityBookmarks = data.filter(
        (bookmark) => bookmark.type === "ACTIVITY",
      );
      const vendorBookmarks = data.filter(
        (bookmark) => bookmark.type === "VENDOR",
      );
      setActivityBookmarks(activityBookmarks);
      setVendorBookmarks(vendorBookmarks);
    };

    fetchBookmarks();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
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
        My Bookmarks
      </Typography>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        centered
      >
        <Tab label="Activity" value="activity" />
        <Tab label="Vendor" value="vendor" />
      </Tabs>
      <TabPanel value={selectedTab} index="activity">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {activityBookmarks.map((activity) => (
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
      </TabPanel>
      <TabPanel value={selectedTab} index="vendor">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {vendorBookmarks.map((vendorBookmark) => (
            <Grid
              item
              key={vendorBookmark.id}
              xs={4}
              sm={4}
              md={4}
              lg={4}
              xl={4}
            >
              <Link
                href={`/shop/vendor/${vendorBookmark.id}`}
                style={{ textDecoration: "none" }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {vendorBookmark.avatarImage ? (
                        <img
                          src={vendorBookmark.vendor.preSignedPhoto}
                          alt="Vendor Avatar"
                        />
                      ) : (
                        vendorBookmark.vendor.companyName
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={vendorBookmark.vendor.companyName}
                    secondary={vendorBookmark.vendor.vendorType}
                  />
                </ListItem>
              </Link>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box pt={3} pb={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default MyBookmarks;
