import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useVendorStore = create((set) => ({
  vendorAuthenticated: false,
  vendor: null,
  setVendor: (vendor) => set({ vendor }),
}));

export default useVendorStore;
