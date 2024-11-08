import { createStore } from "zustand/vanilla";
import { StoreState } from "./types";
import { fetchList } from "./api";
import { update } from "./utils";
import { fetchAndNormalizeData } from "./assets";
import { fetchAndAddNewCategories, updateSelectedItem } from "./events";
import { consoleLog, objDiff } from "./logging";
import { config } from "../../config";
import { absoluteIndexFromVisible } from "./tile-navigation";

const useStore = createStore<StoreState>((set, get) => ({
  containers: [],
  sets: [],
  refs: [],
  collections: null,
  items: {},
  loading: false,
  error: null,
  videoPlaying: false,
  refIndex: 0,
  keyActive: false,
  activeCategoryIndex: 0,
  activeItemIndex: 0,
  modalActive: false,
  bannerActive: false,
  trigger: null,

  fetchContainers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchList();
      // consoleLog("rawData", response);
      const { sets, refs, collections } = await fetchAndNormalizeData(response);
      const parsedCollections = {
        ...collections,
        items: collections?.items?.filter(i => i?.assets?.banner),
      };
      set({
        sets,
        refs,
        collections: parsedCollections,
        loading: false,
        trigger: "fetchContainers",
      });
      consoleLog("sets, refs, collections", {sets, refs, collections});
    } catch (error) {
      set({ loading: false, error: error.message, trigger: "fetchContainers" });
      consoleLog("fetchContainers", `Unable to retrieve data from ${config.API_DOMAIN}, ${error.message}`, "error");
    }
  },

  setVideoPlaying: (playing) => update(set, (state) => {
    state.videoPlaying = typeof playing !== "undefined" ? playing : !state.videoPlaying;
    state.trigger = "setVideoPlaying";
  }),

  nextRefIndex: () => update(set, (state) => {
    state.refIndex = Number(state.refIndex) + 1;
    state.trigger = "setNextRef";
  }),

  setItem: (id, data) => update(set, (state) => {
    state.items[id] = data;
    state.trigger = "setItem";
  }),

  setCollection: (data) => update(set, (state) => {
    state.collections = data;
    state.trigger = "setCollection";
  }),

  setActiveItemIndex: (index) => update(set, (state) => {
    state.activeItemIndex = index;
    state.trigger = "setActiveItemIndex";
  }),

  setActiveCategoryIndex: (index, updateActiveItem = true) => update(set, (state) => {
    state.activeCategoryIndex = index;
    if (updateActiveItem) {
      state.activeItemIndex = absoluteIndexFromVisible(index);
    }
    state.trigger = "setActiveCategoryIndex";
  }),

  setModalActive: (active) => update(set, (state) => {
    state.modalActive = active;
    state.trigger = "setModalActive";
    if (!active) {
      state.videoPlaying = false;
    }
  }),

  setBannerActive: (active) => update( set, (state) => {
    state.bannerActive = active;
    state.trigger = "setBannerActive";
  }),

  setKeyActive: (active) => update( set, (state) => {
    state.keyActive = typeof active === "boolean";
    state.trigger = "setKeyActive";
  }),
}));

let __DEV__;
// __DEV__ = true;
useStore.subscribe(({ trigger, ...state }, { trigger: preTrigger, ...preState }) => {
  if (state.activeCategoryIndex !== preState.activeCategoryIndex
      || state.activeItemIndex !== preState.activeItemIndex) {
    updateSelectedItem();
  }
  if (__DEV__) {
    const diff = objDiff(preState, state);
    if (diff && trigger !== "setItem") {
      consoleLog(trigger, diff, "warn");
    }
  }
});

export default useStore;
