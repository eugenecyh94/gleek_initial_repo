import React from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer(props) {
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const accent = theme.palette.accent.main;

  return (
    <Box minHeight={150} mt={8} bgcolor={tertiary} p={3}>
      <Box
        mb={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
      >
        <Box display="flex" flexDirection="column" marginRight={4}>
          <Typography color={accent} mb={1} fontWeight={700} variant="body1">
            ABOUT US
          </Typography>
          <Link href="/ " underline="hover" onClick={() => {}}>
            <Typography color={accent} variant="body2">
              Company Overview
            </Typography>
          </Link>
          <Link href="/ " underline="hover" onClick={() => {}}>
            <Typography color={accent} variant="body2">
              Our Team
            </Typography>
          </Link>
          <Link href="/ " underline="hover" onClick={() => {}}>
            <Typography color={accent} variant="body2">
              Contact Us
            </Typography>
          </Link>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display="flex" flexDirection="column" marginRight={4}>
          <Box display="flex" flexDirection="column" marginRight={4}>
            <Typography color={accent} mb={1} fontWeight={700} variant="body1">
              SERVICES
            </Typography>
            <Link href="/ " underline="hover" onClick={() => {}}>
              <Typography color={accent} variant="body2">
                Service 1
              </Typography>
            </Link>
            <Link href="/ " underline="hover" onClick={() => {}}>
              <Typography color={accent} variant="body2">
                Service 2
              </Typography>
            </Link>
            <Link href="/ " underline="hover" onClick={() => {}}>
              <Typography color={accent} variant="body2">
                Service 3
              </Typography>
            </Link>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display="flex" flexDirection="column" marginRight={4}>
          <Box display="flex" flexDirection="column" marginRight={4}>
            <Typography color={accent} mb={1} fontWeight={700} variant="body1">
              FOLLOW US
            </Typography>
            <Box align="center">
              <Link href="/ " onClick={() => {}}>
                <TwitterIcon fontSize="large" color="accent" />
              </Link>
              <Link href="/ " onClick={() => {}}>
                <FacebookIcon fontSize="large" color="accent" />
              </Link>
              <Link href="/ " onClick={() => {}}>
                <InstagramIcon fontSize="large" color="accent" />
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
      <Typography mb={1} align="center" color={accent} variant="body2">
        © 2023 Gleek
      </Typography>
    </Box>
  );
}

export default Footer;
