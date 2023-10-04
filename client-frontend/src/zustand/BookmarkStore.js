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
      const response = await AxiosConnect.post(`/gleek/bookmark/activity/${activityId}`, {
        activity: activityId,
        isBookmarked: !isBookmarked,
      });
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
      console.log("store", currentBookmark)
      set({ currentBookmark });
    } catch (error) {
      throw error;
    }
  },
}));

export default useBookmarkStore;
