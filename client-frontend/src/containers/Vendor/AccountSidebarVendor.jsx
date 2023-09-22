import React from "react";
import { List, ListItemText, ListItemButton, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import useVendorStore from "../../zustand/VendorStore";
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
      {vendor?.status === "PENDING" && (
        <>
          <Alert severity="warning">
            Your account is pending review.
            <p>Activity creation functionality will be limited.</p>
          </Alert>
        </>
      )}
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
      </List>
    </div>
  );
}

export default AccountSidebarVendor;
