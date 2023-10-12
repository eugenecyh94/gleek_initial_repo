import React, { useState, useEffect } from "react";
import CartItem from "../../components/CartItem";
import useCartStore from "../../zustand/CartStore";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import {
  Box,
  Grid,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
const CheckoutPage = (props) => {
  const steps = [
    "Select bookings",
    "Confirm Billing & Cart Details",
    "Confirm Checkout",
  ];
  const { cartItemsToCheckOut, checkout } = useCartStore();
  const { client } = useClientStore();
  const { openSnackbar } = useSnackbarStore();
  const theme = useTheme();
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  const accent = theme.palette.accent.main;
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const tertiary = theme.palette.tertiary.main;
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  console.log(client);
  const totalValueOfCart = () => {
    const totalCartCost = cartItemsToCheckOut.reduce((total, cartItem) => {
      return total + (cartItem.totalCost || 0);
    }, 0);
    return totalCartCost;
  };

  const totalPaxOfCart = () => {
    const totalCartPax = cartItemsToCheckOut.reduce((totalPax, cartItem) => {
      return totalPax + (cartItem.totalPax || 0);
    }, 0);
    return totalCartPax;
  };

  const handleCheckout = async () => {
    try {
      console.log(cartItemsToCheckOut);
      const responseStatus = await checkout(cartItemsToCheckOut);
      if (responseStatus) {
        openSnackbar("Checkout is successful!", "success");
        navigate(`/`);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        error.response.data.msg ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };

  return (
    <Grid container spacing={2} p={5}>
      {cartItemsToCheckOut.length > 0 && (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              variant="h5"
              textAlign="center"
              fontWeight={700}
              color={accent}
            >
              Checkout
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h6" fontWeight={700} color={accent}>
              Billing Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              boxShadow={2}
              borderRadius={2}
              width="100%"
              bgcolor="white"
              p={3}
            >
              <Grid container xs={12} sm={12} md={12} lg={12}>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Typography color={primary} variant="subtitle1">
                    Billing Party Name
                  </Typography>
                  <Typography variant="subtitle1">
                    {client?.billingPartyName}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Typography color={primary} variant="subtitle1">
                    Billing Email
                  </Typography>
                  <Typography variant="subtitle1">
                    {client?.billingEmail}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Typography color={primary} variant="subtitle1">
                    Billing Postal Code
                  </Typography>
                  <Typography variant="subtitle1">
                    {client?.billingOfficePostalCode}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Typography color={primary} variant="subtitle1">
                    Billing Postal Code
                  </Typography>
                  <Typography variant="subtitle1">
                    {client?.billingOfficePostalCode}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h6" fontWeight={700} color={accent}>
              Bookings
            </Typography>
          </Grid>
        </>
      )}
      {cartItemsToCheckOut.map((cartItem, index) => (
        <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <CartItem cartItem={cartItem} />
          </Box>
        </Grid>
      ))}
      {cartItemsToCheckOut.length > 0 && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            borderRadius={2}
            width="100%"
            bgcolor={tertiary}
            p={3}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography>
                Subtotal ({cartItemsToCheckOut.length} items)
              </Typography>
              <Typography mb={1}>Total pax: {totalPaxOfCart()}</Typography>
              <Typography color={accent} variant="h5" fontWeight="700">
                S$ {totalValueOfCart()?.toFixed(2)}
              </Typography>
            </Box>
            {activeStep === 1 && (
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "#3D246C", height: "80%", paddingY: "10px" }}
                onClick={handleNext}
                disabled={cartItemsToCheckOut.length === 0}
              >
                <b> Confirm Details</b>
              </Button>
            )}
            {activeStep > 1 && (
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "#3D246C", height: "80%", paddingY: "10px" }}
                onClick={handleCheckout}
                disabled={cartItemsToCheckOut.length === 0}
              >
                <b> Checkout</b>
              </Button>
            )}
          </Box>
        </Grid>
      )}
      {cartItemsToCheckOut.length === 0 && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            boxShadow={2}
            borderRadius={2}
            width="100%"
            bgcolor="white"
            p={3}
          >
            <Typography>No items to checkout. Shop for more!</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default CheckoutPage;
