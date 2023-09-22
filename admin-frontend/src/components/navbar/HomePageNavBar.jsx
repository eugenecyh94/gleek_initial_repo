import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const stringAvatar = (name, theme) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return {
    sx: {
      bgcolor: theme.palette.light_purple.main,
    },
    children: initials,
  };
};

const HomePageNavBar = () => {
  const theme = useTheme();
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar style={{ paddingLeft: 16, justifyContent: "space-between" }}>
        <Typography fontSize={25} fontWeight={700} noWrap component="div">
          Gleek Admin
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar {...stringAvatar("Admin", theme)} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default HomePageNavBar;
