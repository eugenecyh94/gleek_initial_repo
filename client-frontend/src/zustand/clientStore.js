import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";
import { changePassword } from "./clientActions.js";

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
      return false;
    }
  },
  logout: () => {
    // Implement your logout logic and update authenticated state
    set({
      client: null, // Clear client data
      authenticated: false, // Set authenticated to false
    });
  },
  changePassword: changePassword,
}));

export default useClientStore;
