import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  MenuItem,
  Menu,
  Link,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Avatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import useClientStore from "../zustand/ClientStore.js";
import SearchBar from "./SearchBar/SearchBar.jsx";
import SearchIcon from "@mui/icons-material/Search";
import useGlobalStore from "../zustand/GlobalStore.js";
import useVendorStore from "../zustand/VendorStore.js";
import { BookmarkBorderOutlined, LogoutOutlined, Person2Outlined } from "@mui/icons-material";
function NavBar(props) {
  const { authenticated, client, logoutClient } = useClientStore();
  const { vendorAuthenticated, vendor, logoutVendor } = useVendorStore();
  const { role, setRole } = useGlobalStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const boxLivesForeverElement = document.getElementById("boxLivesForever");
  const handleClick = (event) => {
    setAnchorEl(boxLivesForeverElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick2 = (event) => {
    setAnchorE2(boxLivesForeverElement);
  };
  const handleClose2 = () => {
    setAnchorE2(null);
  };

  const navigate = useNavigate();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;

  const logout = async () => {
    try {
      if (role === "Vendor") {
        logoutVendor();
      } else {
        logoutClient();
      }
      setAnchorE2(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Search bar (WIP)
  const [value, setValue] = useState("");
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Role selection
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  let loginLink;
  if (role === "Vendor") {
    loginLink = "/vendor/login";
  } else {
    loginLink = "/login";
  }

  let registerLink;
  if (role === "Vendor") {
    registerLink = "/vendor/register";
  } else {
    registerLink = "/register";
  }

  return (
    <div>
      <AppBar position="static" elevation={0} bgcolor={primary}>
        <Box
          id="boxLivesForever"
          sx={{ height: "auto", position: "absolute", top: "58px", right: 0 }}
        ></Box>
        {!authenticated && !vendorAuthenticated && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link
              href="/"
              underline="none"
              onClick={() => {
                navigate("/");
              }}
            >
              <Typography
                fontWeight={700}
                ml={2}
                color={accent}
                my={1}
                variant="h4"
              >
                Gleek
              </Typography>
            </Link>
            <Box display="flex" flexDirection="row">
              <FormControl size="small" sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="select-role-label">Role</InputLabel>
                <Select
                  labelId="select-role-label"
                  id="select-role"
                  value={role}
                  label="Role"
                  onChange={handleRoleChange}
                >
                  <MenuItem value={"Client"}>Client</MenuItem>
                  <MenuItem value={"Vendor"}>Vendor</MenuItem>
                </Select>
              </FormControl>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-label="welcome"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ marginRight: "26px" }}
              >
                <Typography fontWeight={700} color={accent} variant="body1">
                  Welcome!
                </Typography>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                slotProps={{
                  paper: {
                    elevation: 2,
                  },
                }}
              >
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate(loginLink);
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate(registerLink);
                  }}
                >
                  Register
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
        {authenticated && !vendorAuthenticated && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              href="/"
              underline="none"
              onClick={() => {
                navigate("/");
              }}
            >
              <Typography
                fontWeight={700}
                ml={2}
                color={accent}
                my={1}
                variant="h4"
              >
                Gleek
              </Typography>
            </Link>
            <Box display="flex" flexDirection="row">
              <SearchBar value={value} onChange={onChange} />
              <IconButton
                onClick={() => {
                  navigate("/shop");
                }}
                sx={{ marginLeft: "5px" }}
                color="tertiary"
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton
                onClick={() => {
                  navigate("/cart");
                }}
                disableRipple
                disableFocusRipple
                aria-label="cart"
                color="accent"
                sx={{ marginRight: "16px" }}
              >
                <ShoppingBagOutlinedIcon />
              </IconButton>
              <Button
                sx={{ marginRight: "16px" }}
                variant="text"
                onClick={() => {
                  navigate("/shop");
                }}
              >
                <Typography fontWeight={700} color={accent} variant="body1">
                  Shop
                </Typography>
              </Button>
              <IconButton
                id="icon-button"
                aria-controls={open2 ? "authenticated-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? "true" : undefined}
                onClick={handleClick2}
                disableRipple
                disableFocusRipple
                aria-label="profile"
                color="accent"
                sx={{ marginRight: "16px" }}
              >
                {client ? (
                  <Avatar alt={client.name} src={client.preSignedPhoto} />
                ) : (
                  <Avatar alt="Empty Avatar" />
                )}
              </IconButton>
              <Menu
                id="authenticated-menu"
                anchorEl={anchorE2}
                open={open2}
                onClose={handleClose2}
                onClick={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "icon-button",
                }}
                slotProps={{
                  paper: {
                    elevation: 2,
                  },
                }}
                disableScrollLock={true}
              >
                <MenuItem disabled sx={{ px: "32px" }}>
                  {client?.email}
                </MenuItem>
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate("/settings");
                  }}
                >
                  <ListItemIcon>
                    <Person2Outlined />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate("/bookmarks");
                  }}
                >
                  <ListItemIcon>
                    <BookmarkBorderOutlined />
                  </ListItemIcon>
                  <ListItemText>Bookmarks</ListItemText>
                </MenuItem>
                <MenuItem sx={{ px: "32px" }} onClick={logout}>
                  <ListItemIcon>
                    <LogoutOutlined />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
        {!authenticated && vendorAuthenticated && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              href="/"
              underline="none"
              onClick={() => {
                navigate("/");
              }}
            >
              <Typography
                fontWeight={700}
                ml={2}
                color={accent}
                my={1}
                variant="h4"
              >
                Gleek
              </Typography>
            </Link>
            <Box>
              <IconButton
                id="icon-button"
                aria-controls={open2 ? "authenticated-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? "true" : undefined}
                onClick={handleClick2}
                disableRipple
                disableFocusRipple
                aria-label="profile"
                color="accent"
                sx={{ marginRight: "16px" }}
              >
                {vendor ? (
                  <Avatar alt={vendor.name} src={vendor.preSignedPhoto} />
                ) : (
                  <Avatar alt="Empty Avatar" />
                )}
              </IconButton>
              <Menu
                id="vendor-authenticated-menu"
                anchorEl={anchorE2}
                open={open2}
                onClose={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "icon-button",
                }}
                slotProps={{
                  paper: {
                    elevation: 2,
                  },
                }}
              >
                <MenuItem disabled sx={{ px: "32px" }}>
                  {vendor?.companyEmail}
                </MenuItem>
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate("/vendor/settings");
                  }}
                >
                  Vendor Profile Settings
                </MenuItem>
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate("/vendor/activities");
                  }}
                >
                  My Activities
                </MenuItem>
                <MenuItem sx={{ px: "32px" }} onClick={logout}>
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
      </AppBar>
    </div>
  );
}

export default NavBar;
