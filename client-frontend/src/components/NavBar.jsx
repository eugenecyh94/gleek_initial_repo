import React from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  MenuItem,
  Menu,
  Link,
  IconButton,
  Icon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import useClientStore from "../zustand/clientStore.js";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AxiosConnect from "../utils/AxiosConnect.js";
function NavBar(props) {
  const { authenticated, client, setAuthenticated } = useClientStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open2 = Boolean(anchorE2);
  const handleClick2 = (event) => {
    setAnchorE2(event.currentTarget);
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
      const response = await AxiosConnect.get("/gleek/auth/logout");
      setAuthenticated(false);
      navigate("/");
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  };

  return (
    <div>
      <AppBar position="static" elevation={0} bgcolor={primary}>
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
          <Box
            mr={2}
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            {authenticated && (
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
            )}
            {authenticated && (
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
            )}
            {!authenticated && (
              <Box sx={{ marginRight: "24px" }}>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
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
                      navigate("/login");
                    }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    sx={{ px: "32px" }}
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Register
                  </MenuItem>
                </Menu>
              </Box>
            )}
            {authenticated && (
              <Box sx={{ marginRight: "24px" }}>
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
                  <AccountBoxIcon />
                </IconButton>
                <Menu
                  id="authenticated-menu"
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
                    {client.email}
                  </MenuItem>
                  <MenuItem
                    sx={{ px: "32px" }}
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem sx={{ px: "32px" }} onClick={logout}>
                    Log out
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Box>
      </AppBar>
    </div>
  );
}

export default NavBar;
