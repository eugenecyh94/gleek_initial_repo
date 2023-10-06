import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ActivityCardItem from "../../../components/ActivityCardItem";
import VendorProfileItem from "../../../components/Vendor/VendorProfileItem";
import useBookmarkStore from "../../../zustand/BookmarkStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

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
  top: 50%; /* Center vertically */
  right: 5px;
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 50%;
  z-index: 1;
`;

function MyBookmarks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "activity";

  const {
    activityBookmarks,
    vendorBookmarks,
    isLoadingBookmarks,
    getBookmarks,
    removeActivityBookmark,
    removeVendorBookmark,
  } = useBookmarkStore();
  const { openSnackbar } = useSnackbarStore();
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);

    // Update the query parameter with the selected tab
    setSearchParams({ tab: newValue });
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      await getBookmarks();
    };

    fetchBookmarks();
  }, [getBookmarks]);

  const handleDeleteBookmark = async (bm) => {
    try {
      await removeActivityBookmark(bm.activity._id, bm);
      openSnackbar("Removed activity bookmark.", "success");
    } catch (error) {
      console.log(error);
      openSnackbar("Error", "error");
    }
  };

  const handleDeleteVendorBookmark = async (bm) => {
    try {
      await removeVendorBookmark(bm);
      openSnackbar("Removed vendor bookmark.", "success");
    } catch (error) {
      console.log(error);
      openSnackbar("Error", "error");
    }
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
      <TabPanel value={selectedTab} index="activity">
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
        <Grid
          container
          p={5}
          spacing={{ xs: 6, md: 8 }}
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
              {vendorBookmark?.vendor && (
                <Paper
                  sx={{
                    position: "relative",
                    padding: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <DeleteIconButtonVendor
                    onClick={() => handleDeleteVendorBookmark(vendorBookmark)}
                  >
                    <DeleteIcon />
                  </DeleteIconButtonVendor>
                  <VendorProfileItem vendor={vendorBookmark?.vendor} />
                </Paper>
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
