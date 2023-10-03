import {
  Avatar,
  Box,
  Grid,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ActivityCardItem from "../../../components/ActivityCardItem";
import AxiosConnect from "../../../utils/AxiosConnect";

function MyBookmarks() {
  const [activityBookmarks, setActivityBookmarks] = useState([]);
  const [vendorBookmarks, setVendorBookmarks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("activity");

  useEffect(() => {
    const fetchBookmarks = async () => {
      const response = await AxiosConnect.get(`/gleek/bookmark`);
      const data = response.data;
      console.log(data)
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
          {activityBookmarks.map((bm) => {
            return bm.activity ? (
              <Grid item key={bm._id} xs={4} sm={4} md={4} lg={4} xl={4}>
                <Link
                  href={`/shop/activity/${bm.activity._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ActivityCardItem activity={bm.activity} />
                </Link>
              </Grid>
            ) : null;
          })}
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
              key={vendorBookmark._id}
              xs={4}
              sm={4}
              md={4}
              lg={4}
              xl={4}
            >
              <Link
                href={`/shop/vendor/${vendorBookmark.vendor._id}`}
                style={{ textDecoration: "none" }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {vendorBookmark.vendor.preSignedPhoto ? (
                        <img
                          src={vendorBookmark.vendor.preSignedPhoto}
                          alt="Vendor Avatar"
                        />
                      ) : (
                        vendorBookmark?.vendor?.companyName
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
