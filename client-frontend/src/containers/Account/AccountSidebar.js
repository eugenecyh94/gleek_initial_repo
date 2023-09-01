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
        {/* <Avatar
          alt="User Avatar"
          src=""
          sx={{ width: 100, height: 100 }}
        /> */}

        <AccountCircleIcon style={{ fontSize: "4rem" }} color="accent" />

        <Typography variant="h6">Account Settings</Typography>
        {/* <Link
          href="/settings/profile"
          color="secondary"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">Update Personal Info</Typography>
          <ArrowForwardIosIcon fontSize="small"/>
        </Link> */}
      </div>

      <List>
        <ListItemButton component={Link} href="/settings/profile">
          <ListItemText
            primary="Account Details"
            sx={{ textAlign: "center" }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/settings/privacy">
          <ListItemText
            primary="Privacy Settings"
            sx={{ textAlign: "center" }}
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          href="/settings/security"
          disabled={true}
        >
          <ListItemText primary="Security" sx={{ textAlign: "center" }} />
        </ListItemButton>
      </List>
    </div>
  );
}

export default AccountSidebar;
