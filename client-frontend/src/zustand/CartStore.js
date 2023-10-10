import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useCartStore = create((set) => ({
  cartItems: [],
  setCartItems: (newCartItems) => set({ cartItems: newCartItems }),
  newCartItem: null,
  setNewCartItem: (newCartItem) => set({ newCartItem: newCartItem }),
  getCartItems: async () => {
    try {
      const response = await AxiosConnect.get(
        `/gleek/cart/getCartItemsByClientId`,
      );
      const data = response.data;
      const combinedDataArray = data.map((item) => ({
        ...item.cartItem,
        isItemStillAvailable: item.isItemStillAvailable,
      }));
      console.log(combinedDataArray);
      set({ cartItems: combinedDataArray });
    } catch (error) {
      console.error(error);
    }
  },
  addToCartLoading: false,
  setAddToCartLoading: (newSetAddToCartLoading) =>
    set({ addToCartLoading: newSetAddToCartLoading }),
  addToCart: async (cartItemData) => {
    try {
      set({ addToCartLoading: false });
      const response = await AxiosConnect.post(
        `/gleek/cart/addCartItem`,
        cartItemData,
      );
      console.log(response.data.data);
      set({ newCartItem: response.data.data });
      setTimeout(() => {
        set({ addToCartLoading: false });
      }, 500);
      return true;
    } catch (error) {
      throw error;
    }
  },
}));

export default useCartStore;
