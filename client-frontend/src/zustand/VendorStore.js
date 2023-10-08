import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";
import useClientStore from "./ClientStore";

const useVendorStore = create((set) => ({
  vendorAuthenticated: false,
  vendorError: null,
  isLoadingVendor: false,
  setVendorAuthenticated: (vendorAuthenticated) => set({ vendorAuthenticated }),
  vendor: null,
  setVendor: (vendor) => set({ vendor }),
  vendorTypes: {},
  setVendorTypes: (vendorTypes) => set({ vendorTypes }),
  // vendorTypesFetcher: async () => {
  //   try {
  //     const response = await AxiosConnect.get(
  //       "/gleek/vendor/getAllVendorTypes",
  //     );
  //     const data = response.data;
  //     set({ vendorTypes: data.VendorTypeEnum });
  //   } catch (error) {
  //     console.error(error);
  //     alert(error.response.data);
  //   }
  // },
  getVendorDetails: async (vendorId) => {
    try {
      set({ isLoading: true });

      const response = await AxiosConnect.get(
        `/gleek/vendor/viewVendor/${vendorId}`,
      );

      set({ vendor: response.data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  registerVendor: async (userData) => {
    try {
      const response = await AxiosConnect.post(
        "/gleek/vendor/register",
        userData,
      );
      const data = response.data;
      console.log("VENDOR DATA AFTER REGISTER", data.vendor);
      set({ vendor: data.vendor, vendorAuthenticated: true });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      throw error;
    }
  },
  loginVendor: async (email, password) => {
    const setAuthenticated = useClientStore.getState().setAuthenticated;
    set({ isLoadingVendor: true, vendorError: null });
    try {
      const response = await AxiosConnect.post("/gleek/vendor/login", {
        companyEmail: email,
        password: password,
      });
      const data = response.data;
      console.log(data);
      set({ vendor: data.vendor, vendorAuthenticated: true });
      setAuthenticated(false);
      setTimeout(() => {
        set({ isLoadingVendor: false });
      }, 500);
      return true;
    } catch (error) {
      setTimeout(() => {
        set({
          vendorError: error,
          isLoadingVendor: false,
        });
      }, 500);
      throw error;
    }
  },
  logoutVendor: async () => {
    try {
      await AxiosConnect.get("/gleek/vendor/logout");
      set({
        vendor: null, // Clear vendor data
        vendorAuthenticated: false, // Set authenticated to false
      });
    } catch (error) {
      console.error(error);
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      await AxiosConnect.post("/gleek/vendor/changePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateAccount: async (userData) => {
    try {
      const response = await AxiosConnect.patch(
        "/gleek/vendor/updateAccount",
        userData,
      );
      const data = response.data;
      set({ vendor: data.vendor });
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
        `/gleek/vendor/verifyEmail/${token}`,
      );

      if (response.data.status === "success") {
        set({ vendor: response.data.vendor });
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  sendRecoverPasswordEmail: async (companyEmail) => {
    try {
      const response = await AxiosConnect.post(
        "/gleek/vendor/recoverPasswordMail",
        {
          companyEmail: companyEmail,
        },
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  resetPassword: async (newPassword) => {
    try {
      const response = await AxiosConnect.post("/gleek/vendor/resetPassword", {
        newPassword: newPassword,
      });
      return response;
    } catch (error) {
      console.error(error);
      alert(error.response.data);
    }
  },
}));

export default useVendorStore;
