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
      const response = await AxiosConnect.get("/gleek/shop/getAllThemes");
      set({ themes: response.data.data.slice(1) });
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
    priceRange: [],
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
  minPriceValue: null,
  maxPriceValue: null,
  setMaxPriceValue: (newMaxPriceValue) =>
    set({ maxPriceValue: newMaxPriceValue }),
  setMinPriceValue: (newMinPriceValue) =>
    set({ minPriceValue: newMinPriceValue }),
  getPriceInterval: async () => {
    set({ priceFilterLoading: true });
    try {
      const response = await AxiosConnect.get(
        "/gleek/shop/getMinAndMaxPricePerPax",
      );
      console.log(response.data);
      set({ minPriceValue: response.data.minPrice });
      set({ maxPriceValue: response.data.maxPrice });
      set({ priceFilterLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  priceFilterLoading: true,
  setPriceFilterLoading: (newPriceFilterLoading) =>
    set({ priceFilterLoading: newPriceFilterLoading }),
}));

export default useShopStore;
