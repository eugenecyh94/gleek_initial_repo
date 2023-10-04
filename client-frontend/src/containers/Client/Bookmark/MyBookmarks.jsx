import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";

import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";

import ActivityCardItem from "../../../components/ActivityCardItem";
import useBookmarkStore from "../../../zustand/BookmarkStore";
import VendorProfileItem from "../../../components/Vendor/VendorProfileItem";

const DeleteIconButtonActivity = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 50%;
  z-index: 1;
`;

const DeleteIconButtonVendor = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 5px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 50%;
  z-index: 1;
`;

function MyBookmarks() {
  const {
    activityBookmarks,
    vendorBookmarks,
    isLoadingBookmarks,
    getBookmarks,
    removeActivityBookmark,
    set,
  } = useBookmarkStore();
  const [selectedTab, setSelectedTab] = useState("activity");

  useEffect(() => {
    const fetchBookmarks = async () => {
      await getBookmarks();
    };

    fetchBookmarks();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeleteBookmark = async (bm) => {
    await removeActivityBookmark(bm.activity._id, bm);
  };

  const handleDeleteVendorBookmark = async (vendorId) => {
    console.log("!!");
  };

  if (isLoadingBookmarks) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

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
      <TabPanel
        value={selectedTab}
        index="activity"
        minHeight="calc(100vh - 140px)"
      >
        {" "}
        {/* Set the min-height here */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {activityBookmarks.map((bm) => {
            return bm.activity ? (
              <Grid item key={bm._id} xs={4} sm={4} md={4} lg={4} xl={4}>
                <div style={{ position: "relative" }}>
                  <DeleteIconButtonActivity
                    onClick={() => handleDeleteBookmark(bm)}
                  >
                    <DeleteIcon />
                  </DeleteIconButtonActivity>
                  <Link
                    href={`/shop/activity/${bm.activity._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ActivityCardItem activity={bm.activity} />
                  </Link>
                </div>
              </Grid>
            ) : null;
          })}
        </Grid>
      </TabPanel>
      <TabPanel
        value={selectedTab}
        index="vendor"
        minHeight="calc(100vh - 140px)"
      >
        {" "}
        {/* Set the min-height here */}
        <Grid
          container
          p={5}
          spacing={{ xs: 6, md: 8 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {vendorBookmarks.map((vendorBookmark) => (
            <Grid
              spacing={5}
              item
              key={vendorBookmark._id}
              xs={4}
              sm={4}
              md={4}
              lg={4}
              xl={4}
            >
              {vendorBookmark?.vendor && (
                <div style={{ position: "relative" }}>
                  <DeleteIconButtonVendor
                    onClick={() =>
                      handleDeleteVendorBookmark(vendorBookmark.vendor._id)
                    }
                  >
                    <DeleteIcon />
                  </DeleteIconButtonVendor>
                  <VendorProfileItem vendor={vendorBookmark?.vendor} />
                </div>
              )}
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, minHeight } = props;
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box pt={3} pb={3} style={{ minHeight: minHeight }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default MyBookmarks;
