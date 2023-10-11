import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import notFound from "../assets/not_found.png";
import { useTheme, lighten } from "@mui/material/styles";

const CartItem = (props) => {
  const theme = useTheme();
  const accent = theme.palette.accent.main;
  const tertiary = theme.palette.tertiary.main;
  const secondary = theme.palette.secondary.main;
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  let containerStyle = {
    height: "10rem",
    width: "10rem",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };
  return (
    <Box boxShadow={2} borderRadius={2} width="100%" bgcolor="white" p={3}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="row">
          {/* Apply styling to the image */}
          {props.cartItem.preSignedImages &&
            props.cartItem.preSignedImages?.length > 0 && (
              <img
                src={props.cartItem.preSignedImages[0]}
                alt={props.cartItem.activityTitle}
                style={containerStyle}
              />
            )}
          {!props.cartItem.preSignedImages?.length > 0 && (
            <img
              src={notFound}
              alt={props.cartItem.activityTitle}
              style={containerStyle}
            />
          )}
          <Box display="flex" flexDirection="column" ml={5}>
            <Typography color={secondary} fontWeight="700" variant="h6">
              {props.cartItem.activityTitle}
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              <b>Date: </b>
              {new Date(props.cartItem.startDateTime).toLocaleDateString()}
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              <b>Start Time: </b>
              {new Date(props.cartItem.startDateTime).toLocaleTimeString()}
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              <b>End Time: </b>
              {new Date(props.cartItem.endDateTime).toLocaleTimeString()}
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              <b>Comments: </b>
              {props.cartItem.additionalComments}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography color={secondary} variant="h6">
            Adult: {props.cartItem.totalPax} pax
          </Typography>
        </Box>
      </Box>
      <Box mb={2} mt={2}>
        <Divider />
      </Box>
      {props.cartItem.isItemStillAvailable && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography color={secondary} variant="h6" fontWeight="700">
            Total
          </Typography>
          <Typography color={secondary} variant="h6" fontWeight="700">
            S$ {props.cartItem.totalCost?.toFixed(2)}
          </Typography>
        </Box>
      )}
      {!props.cartItem.isItemStillAvailable && (
        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <Typography color="error" variant="h6" fontWeight="700">
            Item No Longer Available! Please delete from cart
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CartItem;
