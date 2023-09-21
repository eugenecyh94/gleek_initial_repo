import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

// GlobalStore is used to configure the web settings
const useGlobalStore = create((set) => ({
  role: "Client",
  setRole: (newRole) => set({ role: newRole }),
}));

export default useGlobalStore;
