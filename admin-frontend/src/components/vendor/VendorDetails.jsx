import React from "react";
import BreadCrumbsBar from "../common/BreadCrumbsBar";
import { useVendorStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ProfileCard from "../common/ProfileCard";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PaidIcon from "@mui/icons-material/Paid";
import BadgeIcon from "@mui/icons-material/Badge";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MainBodyContainer from "../common/MainBodyContainer";

const VendorDetails = () => {
  const { vendorId } = useParams();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { vendorDetails, getVendorDetails } = useVendorStore();
  const [isUpdated, setIsUpdated] = useState(false);
  const handleStatusUpdate = async (id, vendorDetails, newStatus) => {
    const updatedProfile = { ...vendorDetails, status: newStatus };
    //await updateVendor(id, updatedProfile);
    setIsUpdated(true);
  };

  useEffect(() => {
    const fetchVendorDetails = async () => {
      await getVendorDetails(vendorId);
    };
    console.log("fetchin " + vendorId);
    fetchVendorDetails();
    console.log("done fetch");
    setIsLoading(false);
  }, [isLoading]);

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["View All Vendors"]}
      breadcrumbLinks={["/viewAllVendors"]}
      currentBreadcrumbName={"View Vendor Profile"}
    >
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <React.Fragment>
          <Box display="flex" alignItems="center" mb={1}>
            {vendorDetails.companyName && (
              <Avatar sx={{ width: 60, height: 60 }}>
                {vendorDetails.companyName.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Box ml={2}>
              <Typography
                fontSize={25}
                fontWeight={700}
                noWrap
                component="div"
                color={theme.palette.primary.main}
              >
                {vendorDetails.companyName}
              </Typography>
              <Typography fontSize={15} color={theme.palette.dark_purple.main}>
                Company UEN: {vendorDetails.companyUEN}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            <ProfileCard
              title="Vendor Details"
              icon={
                <PersonIcon style={{ color: theme.palette.dark_purple.main }} />
              }
              fieldNames={[
                "Company Name",
                "UEN",
                "Company Type", //custom type?
                "Details",
              ]}
              fieldValues={[
                vendorDetails.companyName,
                vendorDetails.companyUEN,
                vendorDetails.companyType,
                vendorDetails.vendorDetails,
              ]}
            />
            <ProfileCard
              title="Contact Info"
              icon={
                <PersonIcon style={{ color: theme.palette.dark_purple.main }} />
              }
              fieldNames={["Address", "Phone Number", "Email"]}
              fieldValues={[
                vendorDetails.companyAddress,
                vendorDetails.companyNumber,
                vendorDetails.companyEmail,
              ]}
            />
            {/* {vendorDetails && (
              <ProfileCard
              title="Brand Names"
              icon={
                <BusinessIcon
                  style={{ color: theme.palette.dark_purple.main }}
                />
              }
              fieldValues={vendorDetails ? vendorDetails.brandNames : []}
            />
            )} */}

            {Object.keys(vendorDetails.companySocials).length > 0 && (
              <ProfileCard
                title="Company Socials"
                icon={
                  <PaidIcon style={{ color: theme.palette.dark_purple.main }} />
                }
                fieldNames={Object.keys(vendorDetails.companySocials)}
                fieldValues={Object.values(vendorDetails.companySocials)}
              />
            )}

            {vendorDetails.status === "APPROVED" && (
              <ProfileCard
                title="Account Details"
                icon={
                  <BadgeIcon
                    style={{ color: theme.palette.dark_purple.main }}
                  />
                }
                fieldNames={["Signup Date", "Status"]}
                fieldValues={[
                  vendorDetails.signupDate,
                  vendorDetails.status,
                  // vendor.approvedDate,
                ]}
              />
            )}
            {vendorDetails.status !== "APPROVED" && (
              <ProfileCard
                title="Account Details"
                icon={
                  <BadgeIcon
                    style={{ color: theme.palette.dark_purple.main }}
                  />
                }
                fieldNames={["Signup Date", "Status"]}
                fieldValues={[vendorDetails.signupDate, vendorDetails.status]}
              />
            )}
          </Box>
          {vendorDetails.status === "PENDING" && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              mt={2}
            >
              <Button
                variant="outlined"
                color="success"
                sx={{ margin: 1 }}
                startIcon={<DoneIcon />}
                onClick={async () =>
                  await handleStatusUpdate(
                    vendorDetails._id,
                    vendorDetails,
                    "APPROVED",
                  )
                }
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ margin: 1 }}
                startIcon={<CloseIcon />}
                onClick={async () =>
                  await handleStatusUpdate(
                    vendorDetails._id,
                    vendorDetails,
                    "REJECTED",
                  )
                }
              >
                Reject
              </Button>
            </Box>
          )}
        </React.Fragment>
      )}
    </MainBodyContainer>
  );
};

export default VendorDetails;
