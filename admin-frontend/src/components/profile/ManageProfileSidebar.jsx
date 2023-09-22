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
import Avatar from "@mui/material/Avatar";

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
         }}>
         <ListItemText primary={text} sx={{ textAlign: "center" }} />
      </ListItemButton>
   );
};

function ManageProfileSidebar(props) {
   const theme = useTheme();
   const primary = theme.palette.primary.main;
   const tertiary = theme.palette.secondary.main;
   return (
      <div style={{ width: "100%", height: "100vh" }}>
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               padding: "16px",
            }}>
            <Avatar
               sx={{ bgcolor: primary, width: 200, height: 200 }}
               src="https://i.imgur.com/ZTevUo0.png"></Avatar>
         </div>
         <List>
            <CustomListItemButton
               route="/manageProfile"
               text="Account Details"
            />
            <CustomListItemButton
               route="/manageProfile/changePassword"
               text="Change Password"
            />
         </List>
      </div>
   );
}

export default ManageProfileSidebar;
