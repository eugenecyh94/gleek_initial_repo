import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBlockoutStore = create((set) => ({
  activityTitle: null,
  currentBlockout: null,
  blockoutsForActivity: null,
  isLoadingBlockoutsForActivity: true,
  activitiesWithBlockouts: [],
  isLoadingactivitiesWithBlockouts: true,
  // Note: Probably should move to an activity store
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
  getBlockoutsByActivityId: async (activityId) => {
    try {
      const response = await AxiosConnect.get(
        `/gleekVendor/timeslot/blockout/activity/${activityId}`,
      );
      const blockoutsForActivity = response.data;
      console.log(blockoutsForActivity);

      set({ isLoadingBlockoutsForActivity: false, blockoutsForActivity });
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
  deleteBlockouts: async (blockedTimingIds, activityId) => {
    try {
      set({ isLoadingBlockoutsForActivity: true });
      const response = await AxiosConnect.post(
        `/gleekVendor/timeslot/blockout/delete`,
        {
          blockedTimingIds,
          activityId,
        },
      );

      const blockoutsForActivity = response.data.blockedTimeslots;
      set({ isLoadingBlockoutsForActivity: false, blockoutsForActivity });
    } catch (error) {
      throw error;
    }
  },
  addBlockout: async (blockedStartDateTime, blockedEndDateTime, activityId) => {
    try {
      set({ isLoadingBlockoutsForActivity: true });
      const response = await AxiosConnect.post(
        `/gleekVendor/timeslot/blockout/activity`,
        {
          blockedStartDateTime,
          blockedEndDateTime,
          activityId,
        },
      );

      const blockoutsForActivity = response.data.blockedTimeslots;
      set({ isLoadingBlockoutsForActivity: false, blockoutsForActivity });
    } catch (error) {
      throw error;
    }
  },
  getActivityTitle: async (activityId) => {
    try {
      const response = await AxiosConnect.get(
        `/gleekVendor/activity/${activityId}/title`,
      );

      const activityTitle = response.data;
      console.log(activityTitle);
      set({ activityTitle });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));

export default useBlockoutStore;
