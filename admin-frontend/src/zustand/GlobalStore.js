import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect.js";

export const useSelectedNavItemStore = create((set) => ({
  selectedItem: "Home",
  setSelectedItem: (item) => set({ selectedItem: item }),
}));

export const useAdminStore = create((set) => ({
  authenticated: false,
  admin: null,
  adminError: null,
  isLoading: false,
  token: null,
  setAdmin: (admin) => set({ admin }),
  setAuthenticated: (authenticated) => set({ authenticated }), // Use the argument
  login: async (email, password) => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.post("/gleekAdmin/login", {
        email: email,
        password: password,
      });
      const data = response.data;
      set({
        admin: data.admin,
        authenticated: true,
        token: data.token,
      });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          adminError: error,
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  logout: () => {
    // Implement your logout logic and update authenticated state
    set({
      admin: null, // Clear admin data
      authenticated: false, // Set authenticated to false
    });
  },
  changePassword: async (password) => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/changePassword", {
        password: password,
      });
      const data = response.data;
      set({ admin: data.admin, authenticated: true });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          adminError: error,
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
}));

export const useActivityStore = create((set) => ({
  activities: [],
  isLoading: false,
  getActivity: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("activity/all");
      set({ activities: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useVendorStore = create((set) => ({
  vendors: [],
  isLoading: false,
  getVendors: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("vendor/viewAllVendors");
      set({ vendors: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));
