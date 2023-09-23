import React from "react";
import {
  List,
  ListItemText,
  ListItemButton,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import useVendorStore from "../../zustand/VendorStore";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
const CustomNavLink = styled(NavLink)(({ theme }) => ({
  "&.active": {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const CustomListItemButton = ({ route, text }) => {
  return (
    <ListItemButton
      component={CustomNavLink}
      to={route}
      sx={{
        "&.active": {
          color: "primary",
          fontWeight: 600,
        },
      }}
    >
      <ListItemText primary={text} sx={{ textAlign: "center" }} />
    </ListItemButton>
  );
};

function AccountSidebarVendor(props) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const tertiary = theme.palette.tertiary.main;

  const { vendor } = useVendorStore();

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Avatar
          sx={{ bgcolor: primary, width: 200, height: 200 }}
          src={vendor?.preSignedPhoto || "https://i.imgur.com/ZTevUo0.png"}
        ></Avatar>
      </div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        {vendor?.status === "PENDING" && (
          <>
            <Alert severity="warning">
              Your account is pending review.
              <p>Activity creation functionality will be limited.</p>
            </Alert>
          </>
        )}
        <Box marginTop={2}>
          {vendor?.verified ? (
            <Chip icon={<MailOutlineIcon />} label="Verified" />
          ) : (
            <Chip
              component="a"
              href="/vendor/verifyEmail"
              icon={<MailOutlineIcon />}
              label="Unverified"
              variant="outlined"
              clickable
            />
          )}
        </Box>
      </Box>
      <List>
        <CustomListItemButton
          route="/vendor/settings/profile"
          text="Account Details"
        />
        <CustomListItemButton
          route="/vendor/settings/picture"
          text="Change Picture"
        />
        <CustomListItemButton
          route="/vendor/settings/password"
          text="Manage Password"
        />
        <CustomListItemButton
          route="/vendor/settings/termsAndConditons"
          text="Terms & Conditions"
        />
      </List>
    </div>
  );
}

export default AccountSidebarVendor;
