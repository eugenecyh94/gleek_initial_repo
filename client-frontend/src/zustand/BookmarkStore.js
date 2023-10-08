import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBookmarkStore = create((set) => ({
  currentBookmark: null,
  activityBookmarks: [],
  vendorBookmarks: [],
  isLoadingBookmarks: true,
  getBookmarks: async () => {
    try {
      const response = await AxiosConnect.get(`/gleek/bookmark`);
      const data = response.data;
      console.log(data);
      const activityBookmarks = data.filter(
        (bookmark) => bookmark.type === "ACTIVITY",
      );
      const vendorBookmarks = data.filter(
        (bookmark) => bookmark.type === "VENDOR",
      );

      set({ isLoadingBookmarks: false, activityBookmarks, vendorBookmarks });
    } catch (error) {
      throw error;
    }
  },
  toggleActivityBookmark: async (activityId, isBookmarked) => {
    try {
      const response = await AxiosConnect.post(
        `/gleek/bookmark/activity/${activityId}`,
        {
          isBookmarked: !isBookmarked,
        },
      );
      const currentBookmark = response.data;
      set({ currentBookmark });
    } catch (error) {
      throw error;
    }
  },
  getBookmarkForActivity: async (activityId) => {
    try {
      const response = await AxiosConnect.get(
        `/gleek/bookmark/activity/${activityId}`,
      );
      const currentBookmark = response.data;
      console.log("store", currentBookmark);
      set({ currentBookmark });
    } catch (error) {
      throw error;
    }
  },
  toggleVendorBookmark: async (vendorId, isBookmarked) => {
    try {
      const response = await AxiosConnect.post(
        `/gleek/bookmark/vendor/${vendorId}`,
        {
          isBookmarked: !isBookmarked,
        },
      );
      const currentBookmark = response.data;
      set({ currentBookmark });
    } catch (error) {
      throw error;
    }
  },
  getBookmarkForVendor: async (vendorId) => {
    try {
      const response = await AxiosConnect.get(
        `/gleek/bookmark/vendor/${vendorId}`,
      );
      const currentBookmark = response.data;
      set({ currentBookmark });
    } catch (error) {
      throw error;
    }
  },
  removeActivityBookmark: async (activityId, bm) => {
    try {
      const response = await AxiosConnect.post(
        `/gleek/bookmark/activity/${activityId}`,
        {
          isBookmarked: false,
        },
      );
      console.log(response);
      set((state) => ({
        activityBookmarks: state.activityBookmarks.filter(
          (bookmark) => bookmark._id !== bm._id,
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
  removeVendorBookmark: async (bm) => {
    try {
      console.log(bm.vendor._id)
      const response = await AxiosConnect.post(
        `/gleek/bookmark/vendor/${bm.vendor._id}`,
        {
          isBookmarked: false,
        },
      );
      console.log(response);
      set((state) => ({
        vendorBookmarks: state.vendorBookmarks.filter(
          (bookmark) => bookmark._id !== bm._id,
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));

export default useBookmarkStore;
