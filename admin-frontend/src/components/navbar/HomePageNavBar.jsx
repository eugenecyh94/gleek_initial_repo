import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAdminStore, useNotificationStore } from "../../zustand/GlobalStore";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

const HomePageNavBar = ({ toggleSidebar }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { authenticated, admin, logout, login } = useAdminStore();
  const { unreadNotificationsCount } = useNotificationStore();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = async (event) => {
    navigate("/");
    const response = await logout();
  };

  const handleNotificationClick = () => {
    navigate("/notificationList");
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const stringAvatar = () => {
    const initials = admin.name[0].toUpperCase();
    return {
      sx: {
        bgcolor: theme.palette.light_purple.main,
      },
      children: initials,
    };
  };
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar style={{ paddingLeft: 16, justifyContent: "space-between" }}>
        {authenticated && (
          <IconButton color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
        <Link to="/" style={{ all: "unset", cursor: "pointer" }}>
          <Typography fontSize={25} fontWeight={700} noWrap component="div">
            Gleek Admin
          </Typography>
        </Link>
        {authenticated ? (
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon onClick={handleNotificationClick} />
              </Badge>
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar()} />
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
              <MenuItem key="Logout" onClick={handleCloseUserMenu}>
                <Link
                  onClick={handleLogout}
                  style={{ all: "unset", cursor: "pointer" }}
                >
                  <Typography textAlign="center" onClick={handleLogout}>
                    Logout
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem key="manageProfile" onClick={handleCloseUserMenu}>
                <Link
                  to="/manageProfile"
                  style={{ all: "unset", cursor: "pointer" }}
                >
                  <Typography textAlign="center">Manage Account</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Link to="/login" style={{ all: "unset", cursor: "pointer" }}>
            <Typography textAlign="center">Login</Typography>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default HomePageNavBar;
