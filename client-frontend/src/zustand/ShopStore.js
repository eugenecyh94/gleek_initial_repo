import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useShopStore = create((set) => ({
  activities: [],
  setActivities: (newActivities) => set({ activities: newActivities }),
  currentPage: 1,
  setCurrentPage: (newPage) => set({ currentPage: newPage }),
  sortBy: "Newest First",
  setSortBy: (newSortBy) => set({ sortBy: newSortBy }),
  currentActivity: null,
  setCurrentActivity: (newCurrentActivity) =>
    set({ currentActivity: newCurrentActivity }),
  themes: [],
  getThemes: async () => {
    try {
      set({ isLoadingThemes: true });
      const response = await AxiosConnect.get("/gleek/shop/getAllThemes");
      set({ themes: response.data.data.slice(1) });
      set({ isLoadingThemes: false });
    } catch (error) {
      console.error(error);
    }
  },
  filter: {
    themes: [],
    locations: [],
    sgs: [],
    daysAvailability: [],
    activityType: [],
    duration: [],
  },
  setFilter: (newFilter) => set({ filter: newFilter }),
  searchValue: "",
  setSearchValue: (newSearchValue) => set({ searchValue: newSearchValue }),
  getInitialSuggestions: async () => {
    try {
      const response = await AxiosConnect.get(
        "/gleek/shop/getAllActivitiesNames",
      );
      set({ suggestions: response.data.data });
    } catch (error) {
      console.error(error);
    }
  },
  suggestions: [],
  setSuggestions: (newSuggestions) => set({ suggestions: newSuggestions }),
}));

export default useShopStore;
