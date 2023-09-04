import React from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const accent = theme.palette.accent.main;

  // Data for "About Us" links
  const aboutUsLinks = [
    { text: "Company Overview", href: "/" },
    { text: "Our Team", href: "/" },
    { text: "Contact Us", href: "/" },
  ];

  // Data for "Services" links
  const servicesLinks = [
    { text: "Service 1", href: "/" },
    { text: "Service 2", href: "/" },
    { text: "Service 3", href: "/" },
  ];

  return (
    <Box minHeight={150} mt={8} bgcolor={tertiary} p={3}>
      <Box
        mb={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
      >
        {/* Render "About Us" links */}
        <RenderLinks title="ABOUT US" links={aboutUsLinks} accent={accent} />

        <Divider orientation="vertical" flexItem />

        {/* Render "Services" links */}
        <RenderLinks title="SERVICES" links={servicesLinks} accent={accent} />

        <Divider orientation="vertical" flexItem />

        {/* Render "Follow Us" icons */}
        <Box display="flex" flexDirection="column" marginRight={4}>
          <Typography color={accent} mb={1} fontWeight={700} variant="body1">
            FOLLOW US
          </Typography>
          <Box align="center">
            <Link href="/" onClick={() => {}}>
              <TwitterIcon fontSize="large" color="accent" />
            </Link>
            <Link href="/" onClick={() => {}}>
              <FacebookIcon fontSize="large" color="accent" />
            </Link>
            <Link href="/" onClick={() => {}}>
              <InstagramIcon fontSize="large" color="accent" />
            </Link>
          </Box>
        </Box>
      </Box>
      <Typography mb={1} align="center" color={accent} variant="body2">
        © 2023 Gleek
      </Typography>
    </Box>
  );
};

// A reusable component to render links
const RenderLinks = ({ title, links, accent }) => (
  <Box display="flex" flexDirection="column" marginRight={4}>
    <Typography color={accent} mb={1} fontWeight={700} variant="body1">
      {title}
    </Typography>
    {links.map((link, index) => (
      <Link key={index} href={link.href} underline="hover" onClick={() => {}}>
        <Typography color={accent} variant="body2">
          {link.text}
        </Typography>
      </Link>
    ))}
  </Box>
);

export default Footer;
