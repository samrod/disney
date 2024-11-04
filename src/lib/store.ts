import { createStore } from "zustand/vanilla";
import { StoreState } from "./types";
import { fetchList } from "./api";
import { $, update } from "./utils";
import { updateSelectedItem } from "./events";

const useStore = createStore<StoreState>((set, get) => ({
  containers: [],
  sets: [],
  items: [],
  loading: false,
  error: null,
  activeCategoryIndex: 0,
  activeItemIndex: 0,
  trigger: null,

  fetchContainers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchList();
      console.log("Fetched containers: ", data.containers);
      set({ containers: data.containers, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  setActiveItemIndex: (index: number) => update(set, (state) => {
    state.activeItemIndex = index;
  }),

  setActiveCategoryIndex: (index: number) => update(set, (state) => {
    state.activeCategoryIndex = index;
  }),
}));

useStore.subscribe((state, preState) => {
  updateSelectedItem(state, preState);
});

export default useStore;
