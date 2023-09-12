import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useShopStore = create((set) => ({
  activities: [],
  setActivities: (newActivities) => set({ activities: newActivities }),
  currentPage: 1,
  setCurrentPage: (newPage) => set({ currentPage: newPage }),
  sortBy: "Newest First",
  setSortBy: (newSortBy) => set({ sortBy: newSortBy }),
}));

export default useShopStore;
