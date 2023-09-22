import React from "react";
import {
  Typography,
  List,
  ListItemText,
  Link,
  ListItemButton,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import useClientStore from "../../zustand/ClientStore";
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

function AccountSidebar(props) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const tertiary = theme.palette.tertiary.main;

  const { client } = useClientStore();

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Avatar
          sx={{ bgcolor: primary, width: 200, height: 200 }}
          src={client.preSignedPhoto || "https://i.imgur.com/ZTevUo0.png"}
        ></Avatar>
      </div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        {client?.status === "PENDING" && (
          <Alert severity="warning">
            Your account is pending review.
            <p>
              Booking functionality will be limited, but you can still browse
              activities.
            </p>
          </Alert>
        )}

        <Box marginTop={2}>
          {client?.verified ? (
            <Chip icon={<MailOutlineIcon />} label="Verified" />
          ) : (
            <Chip
              component="a"
              href="/client/verifyEmail"
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
          route="/settings/profile"
          text="Account Details"
        />
        <CustomListItemButton route="/settings/picture" text="Change Picture" />
        <CustomListItemButton
          route="/settings/privacy"
          text="Privacy Settings"
        />
        <CustomListItemButton
          route="/settings/password"
          text="Manage Password"
        />
      </List>
    </div>
  );
}

export default AccountSidebar;
