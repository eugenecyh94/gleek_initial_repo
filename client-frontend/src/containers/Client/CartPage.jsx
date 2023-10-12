import React, { useState, useEffect } from "react";
import CartItem from "../../components/CartItem";
import useCartStore from "../../zustand/CartStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const CartPage = (props) => {
  const navigate = useNavigate();
  const {
    cartItems,
    getCartItems,
    deletedCartItem,
    deleteCartItem,
    setCartItemsToCheckout,
  } = useCartStore();
  const { openSnackbar } = useSnackbarStore();
  const [checkedItems, setCheckedItems] = useState({});
  const theme = useTheme();
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  const accent = theme.palette.accent.main;
  const primary = theme.palette.primary.main;
  const tertiary = theme.palette.tertiary.main;

  const handleCheckboxChange = (cartItemId) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [cartItemId]: !prevCheckedItems[cartItemId],
    }));
  };

  useEffect(() => {
    console.log(checkedItems);
  }, [checkedItems]);

  const fetchCart = async () => {
    try {
      const responseStatus = await getCartItems();
      const initialCheckedItems = {};
      for (const cartItem of cartItems) {
        initialCheckedItems[cartItem._id] = false;
      }
      setCheckedItems(initialCheckedItems);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const totalValueOfCart = () => {
    const totalCartCost = cartItems.reduce((total, cartItem) => {
      return total + (cartItem.totalCost || 0);
    }, 0);
    return totalCartCost;
  };

  const totalPaxOfCart = () => {
    const totalCartPax = cartItems.reduce((totalPax, cartItem) => {
      return totalPax + (cartItem.totalPax || 0);
    }, 0);
    return totalCartPax;
  };

  const handleDeleteCartItem = async (cartId) => {
    try {
      const responseStatus = await deleteCartItem(cartId);
      if (responseStatus) {
        fetchCart();
        openSnackbar("Booking deleted!", "success");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };

  const handleCheckout = () => {
    let isAllFalse = true;
    const cartItemIdsToCheckout = [];
    const cartItemsToCheckout = [];
    for (const [key, value] of Object.entries(checkedItems)) {
      if (value) {
        isAllFalse = false;
        cartItemIdsToCheckout.push(key);
      }
    }
    if (isAllFalse) {
      openSnackbar("No cart items selected!", "info");
      return;
    }
    for (const cartItemId of cartItemIdsToCheckout) {
      for (const cartItem of cartItems) {
        if (cartItemId === cartItem._id) {
          cartItemsToCheckout.push(cartItem);
        }
      }
    }
    setCartItemsToCheckout(cartItemsToCheckout);
    navigate(`/cart/checkout`);
  };

  return (
    <Grid container spacing={2} p={5}>
      {cartItems.length > 0 && (
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
              <Typography>Subtotal ({cartItems.length} items)</Typography>
              <Typography mb={1}>Total pax: {totalPaxOfCart()}</Typography>
              <Typography color={accent} variant="h5" fontWeight="700">
                S$ {totalValueOfCart()?.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "#3D246C", height: "80%", paddingY: "10px" }}
              onClick={handleCheckout}
            >
              <b> Check out</b>
            </Button>
          </Box>
        </Grid>
      )}
      {cartItems.map((cartItem, index) => (
        <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
          <Box display="flex" flexDirection="row" alignItems="center">
            {cartItem.isItemStillAvailable && (
              <Box mr={5}>
                <Checkbox
                  checked={checkedItems[cartItem._id] || false}
                  onChange={() => handleCheckboxChange(cartItem._id)}
                  color="primary"
                />
              </Box>
            )}
            <CartItem cartItem={cartItem} />
            <Box ml={5}>
              <IconButton
                onClick={() => handleDeleteCartItem(cartItem._id)}
                aria-label="delete"
                color="primary"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      ))}
      {cartItems.length === 0 && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            boxShadow={2}
            borderRadius={2}
            width="100%"
            bgcolor="white"
            p={3}
          >
            <Typography>No items in cart. Shop for more!</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default CartPage;
