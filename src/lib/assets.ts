import { fetchSet } from "./api";
import { getItemImage, formatImageSrc, getItemTitle } from "./helpers";
import { consoleLog } from "./logging";
import useStore from "./store";
import { ContainerSet } from "./types";
import { noop } from "./utils";

const validateImageUrl = (url: string) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const BANNER_IMAGE_TYPE = ["hero_tile", "background", "hero_tile"];
const BG_IMAGE_TYPES = ["hero_tile", "hero_collection", "background", "background_details", "tile", ];
const LOGO_IMAGE_TYPES = ["title_treatment_layer", "logo_layer", "logo" ]
const TILE_TYPES = ["tile" ]
const getFirstAvailableImageType = async (item, types, aspect = "1.78") => {
  for (const type of types) {
    const masterId = getItemImage(item, type, aspect);
    if (!masterId) continue;
    const src = formatImageSrc(masterId, 200);
    const isValid = await validateImageUrl(src);
    if (isValid) {
      return { type, id: masterId };
    }
    // consoleLog("getFirstAvailableImageType", `${getItemTitle(item)}: ${type}, ${aspect} ${src}`);
  }
  return null;
};

const removeMissingImages = async (items) => {
  const { setItem } = useStore.getState();

  const results = await Promise.all(items.map(async (item) => {
    const validBanerAsset = await getFirstAvailableImageType(item, BANNER_IMAGE_TYPE, "3.00");
    const validTileAsset = await getFirstAvailableImageType(item, TILE_TYPES);
    const validBgAsset = await getFirstAvailableImageType(item, BG_IMAGE_TYPES);
    const validLogoAsset = await getFirstAvailableImageType(item, LOGO_IMAGE_TYPES);

    if (!validTileAsset) {
      consoleLog("removeMissingImages", `"${getItemTitle(item)}" tile missing`, "warn");
      return null;
    }

    if (getItemTitle(item.set) === "collections" && !validBanerAsset) {
      consoleLog("removeMissingImages", `"${getItemTitle(item)}" banner missing`, "warn");
      return null;
    }

    if (!validLogoAsset) {
      consoleLog("removeMissingImages", `"${getItemTitle(item)}" logo missing`, "warn");
      return null;
    }
    const assets = {
      banner: validBanerAsset,
      background: validBgAsset,
      logo: validLogoAsset,
      tile: validTileAsset,
    };
    setItem(item?.contentId || item?.collectionId, { ...item, assets });
    item.assets = assets;
    return item;
  }));
  return results.filter(Boolean);
};

const normalizeData = async (container: ContainerSet): Promise<ContainerSet> => {
  if (!container?.items) {
    return null;
  }
  const validatedItems = await removeMissingImages(container.items);
  if (validatedItems.length > 0) {
    return {
      ...container,
      items: validatedItems,
    };
  }
  return null;
};

export const getContainerTypes = async (data): Promise<{ collections: ContainerSet; sets: ContainerSet[]; refs: ContainerSet[] }> => {
  const collections: ContainerSet = {};
  const sets: ContainerSet[] = [];
  const refs: ContainerSet[] = [];

  for (const container of data.containers) {
    const isRef = !container?.set.items;
    const title = getItemTitle(container.set);

    if (isRef) {
      refs.push(container);
    } else {
      const result = await normalizeData(container.set);
      if (title === "Collections") {
        Object.assign(collections, result);
      } else {
        sets.push(result);
      }
    }
  }

  return { collections, sets, refs };
};

export const fetchRefData = async (container: ContainerSet, callback = noop): Promise<ContainerSet> => {
  if (!container) {
    return;
  }
  const response = await fetchSet(container.set.refId);
  const _container = (
    response.CuratedSet
    || response.TrendingSet
    || response.PersonalizedCuratedSet
  );
  const normalizedData = await normalizeData(_container);
  callback(normalizedData);
};

