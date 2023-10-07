import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBlockoutStore = create((set) => ({
  currentBlockout: null,
  activitiesWithBlockouts: [],
  isLoadingactivitiesWithBlockouts: true,
  getActivitiesWithBlockouts: async () => {
    try {
      const response = await AxiosConnect.get(`/gleekVendor/activity/mine`);
      const activitiesWithBlockouts = response.data;
      console.log(activitiesWithBlockouts);

      set({ isLoadingactivitiesWithBlockouts: false, activitiesWithBlockouts });
    } catch (error) {
      throw error;
    }
  },
}));

export default useBlockoutStore;
