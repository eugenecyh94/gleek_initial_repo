import React from "react";
import {
  Typography,
  List,
  ListItemText,
  Link,
  ListItemButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
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
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <AccountCircleIcon style={{ fontSize: "4rem" }} color="accent" />

        <Typography align="center" variant="h6">
          Account Settings
        </Typography>
      </div>
      <List>
        <CustomListItemButton
          route="/settings/profile"
          text="Account Details"
        />
        <CustomListItemButton
          route="/settings/privacy"
          text="Privacy Settings"
        />
        <CustomListItemButton route="/settings/security" text="Security" />
      </List>
    </div>
  );
}

export default AccountSidebar;
