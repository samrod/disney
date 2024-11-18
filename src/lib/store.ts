import { fetchList } from "./api";
import { StoreState } from "./types";
import { createStore, set } from "./state";
import { getContainerTypes } from "./assets";
import { updateSelectedItem } from "./events";
import { consoleLog, objDiff } from "./logging";
import { config } from "../../config";
import { absoluteIndexFromVisible, scrollToGridx } from "./tile-navigation";

const states = {
  containers: [],
  sets: [],
  refs: [],
  collections: null,
  items: {},
  totalCategories: 0,
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
};

const actions = {
  fetchContainers: async () => {
    set((state) => ({ loading: true, error: null }));
    try {
      const response = await fetchList();
      if (!response) {
        set((state) => ({ loading: false, error: true, trigger: "fetchContainers" }));
        return;
      }
      // consoleLog("rawData", response);
      const { sets, refs, collections } = await getContainerTypes(response);
      const parsedCollections = {
        ...collections,
        items: collections?.items?.filter(i => i?.assets?.banner),
      };
      set((state) => ({
        sets,
        refs,
        collections: parsedCollections,
        totalCategories: sets.length,
        loading: false,
        trigger: "fetchContainers",
      }));
      consoleLog("sets, refs, collections", { sets, refs, collections });
    } catch (error) {
      set((state) => ({ loading: false, error: error.message, trigger: "fetchContainers" }));
      consoleLog("fetchContainers", `Unable to retrieve data from ${config.API_DOMAIN}, ${error.message}`, "error");
    }
  },

  setVideoPlaying: (playing) => set((state) => ({
    videoPlaying: typeof playing !== "undefined" ? playing : !state.videoPlaying,
    trigger: "setVideoPlaying",
  })),

  nextRefIndex: () => set((state) => ({
    refIndex: Number(state.refIndex) + 1,
    trigger: "setNextRef",
  })),

  setItem: (id, data) => set((state) => ({
    items: { ...state.items, [id]: data },
    trigger: "setItem",
  })),

  setCollection: (data) => set((state) => ({
    collections: data,
    trigger: "setCollection",
  })),

  setActiveItemIndex: (index) => set((state) => ({
    activeItemIndex: index,
    trigger: "setActiveItemIndex",
  })),

  setActiveCategoryIndex: (index, updateActiveItem = true) => set((state) => ({
    activeCategoryIndex: index,
    activeItemIndex: updateActiveItem ? absoluteIndexFromVisible(index) : state.activeItemIndex,
    trigger: "setActiveCategoryIndex",
  })),

  setModalActive: (active) => set((state) => ({
    modalActive: active,
    trigger: "setModalActive",
    videoPlaying: !active,
  })),

  setBannerActive: (active) => set((state) => ({
    bannerActive: active,
    trigger: "setBannerActive",
  })),

  setLoading: (active) => set((state) => ({
    loading: active,
    trigger: "setLoading",
  })),

  setKeyActive: (active) => set((state) => {
    scrollToGridx();
    return {
      keyActive: typeof active === "boolean",
      trigger: "setKeyActive",
    };
  }),

  bumpTotalCategories: () => set((state) => ({
    totalCategories: state.totalCategories + 1,
    trigger: "bumpTotalCategories",
  })),
};

const useStore = createStore<StoreState>({ ...states, ...actions });

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

  (state) => ({
    activeCategoryIndex: state.activeCategoryIndex,
    activeItemIndex: state.activeItemIndex,
    trigger: state.trigger,
  })
});

export default useStore;
