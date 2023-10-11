import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useThemeStore = create((set) => ({
  themes: [],
  isThemeLoading: false,
  getThemes: async () => {
    try {
      set({ isThemeLoading: true });
      const response = await AxiosConnect.get(
        "/gleekVendor/activity/getThemes",
      );
      set({ themes: response.data });
      set({ isThemeLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useThemeStore;
