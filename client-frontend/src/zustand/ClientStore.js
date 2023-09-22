import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";
import useVendorStore from "./VendorStore";
const useClientStore = create((set) => ({
  authenticated: false,
  client: null,
  clientError: null,
  isLoading: false,
  setClient: (client) => set({ client }),
  setAuthenticated: (authenticated) => set({ authenticated }), // Use the argument
  login: async (email, password) => {
    const setVendorAuthenticated =
      useVendorStore.getState().setVendorAuthenticated;
    set({ isLoading: true, clientError: null });
    try {
      const response = await AxiosConnect.post("/gleek/auth/login", {
        email: email,
        password: password,
      });
      const data = response.data;
      setVendorAuthenticated(false);
      set({ client: data.client, authenticated: true });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      setTimeout(() => {
        set({
          clientError: error,
          isLoading: false,
        });
      }, 500);
      throw error;
    }
  },
  logoutClient: async () => {
    try {
      await AxiosConnect.get("/gleek/auth/logout");
      set({
        client: null, // Clear client data
        authenticated: false, // Set authenticated to false
      });
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      await AxiosConnect.post("/gleek/client/changePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await AxiosConnect.post(
        "/gleek/auth/register",
        userData,
      );
      const data = response.data;
      console.log("CLIENT DATA AFTER REGISTER", data.client);
      set({ client: data.client, authenticated: true });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateAccount: async (userData) => {
    try {
      const response = await AxiosConnect.patch(
        "/gleek/client/updateAccount",
        userData,
      );
      const data = response.data;
      set({ client: data.client });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      throw error;
    }
  },
  verifyEmail: async (token) => {
    try {
      const response = await AxiosConnect.get(
        `/gleek/client/verifyEmail/${token}`,
      );

      if (response.data.status === "success") {
        set({ client: response.data.client });
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));

export default useClientStore;
