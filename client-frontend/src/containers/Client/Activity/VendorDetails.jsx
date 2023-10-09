import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityCardItem from "../../../components/ActivityCardItem";
import AxiosConnect from "../../../utils/AxiosConnect";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import useVendorStore from "../../../zustand/VendorStore";
import VendorBookmarkButton from "../../../components/Bookmark/VendorBookmarkButton";

const VendorDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbarStore();
  const { vendor, getVendorDetails } = useVendorStore();

  const [vendorActivities, setVendorActivities] = useState([]);
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;

  useEffect(() => {
    const subscribeVendor = async () => {
      try {
        const response = await getVendorDetails(id);
      } catch (err) {
        console.error(err);
        openSnackbar("This vendor does not exist.", "error");
        // navigate("/");
      }
    };

    const subscribeVendorActivities = async () => {
      try {
        const response = await AxiosConnect.get(`/gleek/activity/vendor/${id}`);
        setVendorActivities(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
        openSnackbar(
          "There was an error retrieving the vendor's activities.",
          "error",
        );
      }
    };

    subscribeVendor();
    subscribeVendorActivities();
  }, []);

  if (!vendor)
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        p={5}
        width={"100%"}
      >
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContents="center"
        width={"100%"}
        sx={{ p: 5 }}
      >
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: primary,
                  width: 100,
                  height: 100,
                  fontSize: "80px",
                }}
                src={vendor?.preSignedPhoto || ""}
              >
                {vendor?.preSignedPhoto
                  ? null
                  : vendor.companyName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h4"
                color={theme.palette.primary.dark}
                marginLeft={2}
              >
                {vendor.companyName}
              </Typography>
            </Stack>
            <VendorBookmarkButton vendorId={id} />
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Company UEN
          </Typography>
          <Typography>{vendor?.companyUEN}</Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Company Email
          </Typography>
          <Typography>{vendor?.companyEmail}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Phone Number
          </Typography>
          <Typography>{vendor?.companyPhoneNumber}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Company Address
          </Typography>
          <Typography>{vendor?.companyAddress}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Postal Code
          </Typography>
          <Typography>{vendor?.companyPostalCode}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Company Type
          </Typography>
          <Typography>
            {vendor?.customCompanyType || vendor?.vendorType}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Brand Names
          </Typography>
          {vendor?.brandNames?.map((s, index) => (
            <Chip key={index} label={s} style={{ paddingTop: 2 }} />
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Social Media
          </Typography>
          {vendor?.companySocials &&
            Object.entries(vendor?.companySocials).map(
              ([socialMediaName, link], index) => (
                <div key={index}>
                  <Typography variant="body1">{socialMediaName}</Typography>
                  <Typography variant="body2">
                    <Link href={link} color="inherit">
                      {link}
                    </Link>
                  </Typography>
                </div>
              ),
            )}
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Vendor Details
          </Typography>
          <Typography>{vendor?.vendor}</Typography>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <Box sx={{ m: 5 }}>
        <Typography
          color={theme.palette.primary.dark}
          variant="h4"
          marginBottom={2}
        >
          {vendor?.companyName}'s Activities
        </Typography>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {vendorActivities.map((activity) => (
            <Grid item key={activity._id} xs={4} sm={4} md={4} lg={4} xl={4}>
              <Link
                href={`/shop/activity/${activity._id}`}
                style={{ textDecoration: "none" }}
              >
                <ActivityCardItem activity={activity} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default VendorDetails;
