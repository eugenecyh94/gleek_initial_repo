import {
  Box,
  Grid,
  Typography,
  Chip,
  Link,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosConnect from "../../../utils/AxiosConnect";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import ActivityItem from "../../../components/ActivityItem";
import ActivityCardItem from "../../../components/ActivityCardItem";

const vendor = {
  _id: "650e73b36f3dd9da59896cbd",
  companyName: "Company A",
  companyUEN: "12345678",
  companyAddress: "company a",
  companyPhoneNumber: "6512345678",
  vendorType: "B Corp",
  customCompanyType: "",
  companyEmail: "companya@email.com",
  companyPostalCode: "123456",
  password: "$2a$10$1EkyElRewhRHZy8/sMkwWuMd98MwshWEM.6Ex.dYQQ6sAM7V/Umz.",
  brandNames: [],
  vendorDetails: "Company A",
  companySocials: { facebook: "https://" },
  signupDate: "1695445939849",
  verified: true,
  approved: false,
  disabled: false,
  status: "APPROVED",

  approvedDate: "1695446325447",
  companyLogo:
    "https://urban-origins.s3.ap-southeast-1.amazonaws.com/companyLogos/companya%40email.com/1695446544919-515ddbba-a1c7-4b0a-8f25-d97fe7ecf8e0-otter.jpg",
};

const VendorDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbarStore();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorActivities, setVendorActivities] = useState([]);
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;

  useEffect(() => {
    const subscribeVendorDetails = async () => {
      try {
        const response = await AxiosConnect.get(
          `/gleek/vendor/viewVendor/${id}`,
        );
        setVendorDetails(response.data || null);
      } catch (err) {
        console.error(err);
        openSnackbar("This vendor does not exist.", "error");
        navigate("/");
      }
    };

    const subscribeVendorActivities = async () => {
      try {
        const response = await AxiosConnect.get(`/gleek/activity/vendor/${id}`);
        setVendorActivities(response.data);
        console.log(response.data)
      } catch (err) {
        console.error(err);
        openSnackbar("There was an error retrieving the vendor's activities.", "error");
       
      }
      
    };

    subscribeVendorDetails();
    subscribeVendorActivities()
  }, []);

  if (!vendorDetails)
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
        spacing={2}
        alignItems="left"
        justifyContent="left"
        sx={{ m: 5 }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" color={theme.palette.primary.dark}>
            {vendorDetails.companyName}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography color={theme.palette.primary.main} component="div">
            Company UEN
          </Typography>
          <Typography component="div">{vendorDetails?.companyUEN}</Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Company Email
          </Typography>
          <Typography component="div">{vendorDetails?.companyEmail}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Phone Number
          </Typography>
          <Typography component="div">
            {vendorDetails?.companyPhoneNumber}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Company Address
          </Typography>
          <Typography>{vendorDetails?.companyAddress}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Postal Code
          </Typography>
          <Typography>{vendorDetails?.companyPostalCode}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Company Type
          </Typography>
          <Typography>
            {vendorDetails?.customCompanyType || vendorDetails?.vendorType}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Brand Names
          </Typography>
          {vendorDetails?.brandNames?.map((s, index) => (
            <Chip key={index} label={s} style={{ paddingTop: 2 }} />
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main} component="div">
            Social Media
          </Typography>
          {vendorDetails?.companySocials &&
            Object.entries(vendorDetails?.companySocials).map(
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
          <Typography color={theme.palette.primary.main} component="div">
            Vendor Details
          </Typography>
          <Typography>{vendorDetails?.vendorDetails}</Typography>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <Box sx={{ m: 5 }}>
        <Typography color={theme.palette.primary.dark} variant="h4">
          {vendorDetails.companyName}'s Activities
        </Typography>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
        >
          {vendorActivities.map((activity) => (
            <Grid item key={activity.id} xs={4} sm={4} md={4} lg={4} xl={4}>
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
