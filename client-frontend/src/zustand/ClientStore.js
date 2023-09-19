import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useClientStore = create((set) => ({
  authenticated: false,
  client: null,
  clientError: null,
  isLoading: false,
  setClient: (client) => set({ client }),
  setAuthenticated: (authenticated) => set({ authenticated }), // Use the argument
  login: async (email, password) => {
    set({ isLoading: true, clientError: null });
    try {
      console.log("IS THIS RAN?");
      const response = await AxiosConnect.post("/gleek/auth/login", {
        email: email,
        password: password,
      });
      console.log(response);
      const data = response.data;
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
  logout: () => {
    // Implement your logout logic and update authenticated state
    set({
      client: null, // Clear client data
      authenticated: false, // Set authenticated to false
    });
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      await AxiosConnect.post("/gleek/client/changePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      alert("Password changed successfully.");
    } catch (error) {
      console.error(error);
      alert(error.response.data);
    }
  },

  register: async (userData) => {
    try {
      const response = await AxiosConnect.post(
        "/gleek/auth/register",
        userData
      );
      const data = response.data;
      console.log("CLIENT DATA AFTER REGISTER", data.client)
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
        userData
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
}));

export default useClientStore;
