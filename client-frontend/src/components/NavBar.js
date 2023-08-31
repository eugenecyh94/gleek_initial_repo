import React from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  MenuItem,
  Menu,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function NavBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  return (
    <div>
      <AppBar elevation={0} color="dark_purple">
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
            <Typography ml={2} color="secondary" my={2} variant="h3">
              Gleek
            </Typography>
          </Link>
          <Box
            mr={2}
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
          >
            <Button
              variant="text"
              onClick={() => {
                navigate("/Shop");
              }}
            >
              <Typography color="secondary" variant="body1">
                Shop
              </Typography>
            </Button>
            <Button
              variant="text"
              onClick={() => {
                navigate("/Cart");
              }}
            >
              <Typography color="secondary" variant="body1">
                Cart
              </Typography>
            </Button>
            <Box>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <Typography color="secondary" variant="body1">
                  WELCOME
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
              >
                <MenuItem
                  onClick={() => {
                    navigate("/Login");
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/Register");
                  }}
                >
                  Register
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </AppBar>
    </div>
  );
}

export default NavBar;
