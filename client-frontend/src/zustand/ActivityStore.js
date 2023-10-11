import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useActivityStore = create((set) => ({
  activities: [],
  isLoading: false,
  newActivity: null,
  activityDetails: {},
  selectedTab: "publishedTab",
  pendingApprovalActivities: [],
  selectedActivityTab: "publishedTab",
  setActivities: (activities) => {
    set({ activities });
  },
  setPendingApprovalActivities: (pendingApprovalActivities) => {
    set({ pendingApprovalActivities });
  },
  setSelectedTab: (thing) => {
    set({ selectedTab: thing });
  },
  setSelectedActivityTab: (thing) => {
    set({ selectedActivityTab: thing });
  },
  getActivity: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/activity/all");
      set({
        activities: response.data.publishedActivities,
        pendingApprovalActivities: response.data.pendingApprovalActivities,
      });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  getActivityForVendor: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/gleekVendor/activity/mine");
      set({ activities: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  getSingleActivity: async (activityId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/gleekVendor/activity/viewActivity/${activityId}`,
      );
      set({ activityDetails: response.data.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  saveActivity: async (activityDraftData) => {
    try {
      const response = await AxiosConnect.postMultiPart(
        "/gleekVendor/activity/saveActivity",
        activityDraftData,
      );
      set({ newActivity: response.data.activity });
    } catch (error) {
      throw new Error("Unexpected Server Error!");
    }
  },
  deleteActivity: async (activityId) => {
    try {
      const updatedActivities = await AxiosConnect.delete(
        `/gleekVendor/activity/deleteDraft/${activityId}`,
      );
      console.log("updated activities", updatedActivities.data.activity);
      set({ activities: updatedActivities.data.activity });
      set({ selectedTab: "draftTab" });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
    }
  },
  bulkDeleteActivity: async (activityIds) => {
    try {
      const updatedActivities = await AxiosConnect.delete(
        "/gleekVendor/activity/bulkDelete",
        activityIds,
      );
      set({
        activities: updatedActivities.data.activity,
        selectedTab: "draftTab",
      });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
    }
  },
  publishActivity: async (activityId) => {
    try {
      const response = await AxiosConnect.patch(
        `/gleekVendor/activity/publishActivity/${activityId}`,
      );
      set({
        selectedActivityTab: "readyToPublishTab",
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  rejectActivity: async (activityId, rejectionReason, adminId) => {
    try {
      const updatedActivities = await AxiosConnect.patch(
        "/activity/rejectActivity",
        activityId,
        { rejectionReason: rejectionReason, adminId: adminId },
      );
      set({
        selectedActivityTab: "pendingApprovalTab",
      });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
}));

export default useActivityStore;
