import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useVendorStore = create((set) => ({
  vendorAuthenticated: false,
  vendor: null,
  setVendor: (vendor) => set({ vendor }),
  vendorTypes: {},
  setVendorTypes: (vendorTypes) => set({ vendorTypes }),
  vendorTypesFetcher: async () => {
    try {
      const response = await AxiosConnect.get(
        "/gleek/vendor/getAllVendorTypes",
      );
      const data = response.data;
      set({ vendorTypes: data });
    } catch (error) {
      console.error(error);
      alert(error.response.data);
    }
  },
  register: async (userData) => {
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
}));

export default useVendorStore;
