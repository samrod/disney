import { createStore } from "zustand/vanilla";
import { StoreState } from "./types";
import { fetchList } from "./api";

const useStore = createStore<StoreState>((set, get) => ({
  containers: [],
  sets: [],
  items: [],
  loading: false,
  error: null,

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
}));

export default useStore;
