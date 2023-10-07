import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, ListItemText, Stack, Typography } from "@mui/material";

function VendorProfileItem({ vendor }) {
  const vendorLink = `/shop/vendor/${vendor._id}`;

  return (
    <Link
      to={vendorLink}
      style={{
        textDecoration: "none",
        display: "inline-block",
        margin: 0, 
      }}
    >
      <Box display="flex" alignItems="center">
        {vendor.preSignedPhoto ? (
          <Avatar alt={vendor.companyName} src={vendor.preSignedPhoto} />
        ) : (
          <Avatar alt="Empty Avatar" />
        )}
        <Stack sx={{ marginLeft: "10px" }}>
          <Typography color="primary" fontWeight="700" variant="h6">
            {vendor.companyName}
          </Typography>
          <Typography color="grey.500" fontWeight="40" variant="h7">
            {vendor.vendorType}
          </Typography>
        </Stack>
      </Box>
    </Link>
  );
}

export default VendorProfileItem;
