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
  addBlockoutToActivities: async (
    blockedStartDateTime,
    blockedEndDateTime,
    activityIds,
  ) => {
    try {
      // Make the API call to add blockout timings
      const response = await AxiosConnect.post(
        `/gleekVendor/timeslot/blockout/activities`,
        {
          blockedStartDateTime,
          blockedEndDateTime,
          activityIds,
        },
      );

      const activities = response.data.activities;

      set({
        isLoadingactivitiesWithBlockouts: false,
        activitiesWithBlockouts: activities,
      });
    } catch (error) {
      throw error;
    }
  },
}));

export default useBlockoutStore;
