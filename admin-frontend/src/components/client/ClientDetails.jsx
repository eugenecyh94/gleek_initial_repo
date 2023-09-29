import React from "react";
import BreadCrumbsBar from "../common/BreadCrumbsBar";
import { useClientStore } from "../../zustand/GlobalStore";
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

const ClientDetails = () => {
  const { clientId } = useParams();
  const theme = useTheme();
  const { isLoading, updateClient, clientDetails, getClientDetails } =
    useClientStore();
  const [isUpdated, setIsUpdated] = useState(false);

  const handleStatusUpdate = async (id, clientDetails, newStatus) => {
    const updatedProfile = { ...clientDetails, status: newStatus };
    await updateClient(id, updatedProfile);
    setIsUpdated(true);
  };

  useEffect(() => {
    const fetchClientDetails = async () => {
      await getClientDetails(clientId);
    };
    console.log("fetchin" + clientId);
    fetchClientDetails();
    console.log("done fetch");
  }, [getClientDetails, clientId, isUpdated]);

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["View All Clients"]}
      breadcrumbLinks={["/viewAllClients"]}
      currentBreadcrumbName={"View Client Profile"}
    >
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <React.Fragment>
          <Box display="flex" alignItems="center" mb={1}>
            {clientDetails.name && (
              <Avatar sx={{ width: 60, height: 60 }}>
                {clientDetails.name.charAt(0).toUpperCase()}
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
                {clientDetails.companyName}
              </Typography>
              <Typography fontSize={15} color={theme.palette.dark_purple.main}>
                Point of Contact: {clientDetails.name}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            <ProfileCard
              title="Point of Contact"
              icon={
                <PersonIcon style={{ color: theme.palette.dark_purple.main }} />
              }
              fieldNames={[
                "Name",
                "Email",
                "Phone Number",
                "Team",
                "Job Title",
              ]}
              fieldValues={[
                clientDetails.name,
                clientDetails.email,
                clientDetails.phoneNumber,
                clientDetails.team,
                clientDetails.jobTitle,
              ]}
            />
            <ProfileCard
              title="Company"
              icon={
                <BusinessIcon
                  style={{ color: theme.palette.dark_purple.main }}
                />
              }
              fieldNames={[
                "Company Name",
                "Office Address",
                "Office Postal Code",
              ]}
              fieldValues={[
                clientDetails.companyName,
                clientDetails.officeAddress,
                clientDetails.officePostalCode,
              ]}
            />
            <ProfileCard
              title="Billing Details"
              icon={
                <PaidIcon style={{ color: theme.palette.dark_purple.main }} />
              }
              fieldNames={[
                "Billing Party Name",
                "Billing Address",
                "Billing Office Postal Code",
                "Billing Email",
              ]}
              fieldValues={[
                clientDetails.billingPartyName,
                clientDetails.billingAddress,
                clientDetails.billingOfficePostalCode,
                clientDetails.billingEmail,
              ]}
            />
            {clientDetails.status === "APPROVED" && (
              <ProfileCard
                title="Account Details"
                icon={
                  <BadgeIcon
                    style={{ color: theme.palette.dark_purple.main }}
                  />
                }
                fieldNames={["Signup Date", "Status", "Approved Date"]}
                fieldValues={[
                  clientDetails.signupDate,
                  clientDetails.status,
                  clientDetails.approvedDate,
                ]}
              />
            )}
            {clientDetails.status !== "APPROVED" && (
              <ProfileCard
                title="Account Details"
                icon={
                  <BadgeIcon
                    style={{ color: theme.palette.dark_purple.main }}
                  />
                }
                fieldNames={["Signup Date", "Status"]}
                fieldValues={[clientDetails.signupDate, clientDetails.status]}
              />
            )}
          </Box>
          {clientDetails.status === "PENDING" && (
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
                    clientDetails._id,
                    clientDetails,
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
                    clientDetails._id,
                    clientDetails,
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

export default ClientDetails;
