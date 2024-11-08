import { noop } from "lodash";
import { fetchSet } from "./api";
import { getItemImage, formatImageSrc, getItemTitle } from "./helpers";
import { consoleLog } from "./logging";
import useStore from "./store";
import { ContainerSet } from "./types";

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

const BG_IMAGE_TYPES = ["hero_tile", "hero_collection", "background", "background_details", "tile", ];
const LOGO_IMAGE_TYPES = ["title_treatment_layer", "logo_layer", "logo" ]
const TILE_TYPES = ["tile" ]
const getFirstAvailableImageType = async (item, types) => {
  for (const type of types) {
    const masterId = getItemImage(item, type);
    if (!masterId) continue;
    const src = formatImageSrc(masterId);
    const isValid = await validateImageUrl(src);
    if (isValid) {
      // consoleLog("getFirstAvailableImageType", `${getItemTitle(item)}: ${type} - ${src}`);
      return { type, id: masterId };
    }
  }
  return null;
};

const removeMissingImages = async (items) => {
  const { setItem } = useStore.getState();

  const results = await Promise.all(items.map(async (item) => {
    const validTileAsset = await getFirstAvailableImageType(item, TILE_TYPES);
    const validBgAsset = await getFirstAvailableImageType(item, BG_IMAGE_TYPES);
    const validLogoAsset = await getFirstAvailableImageType(item, LOGO_IMAGE_TYPES);

    if (!validTileAsset) {
      consoleLog("removeMissingImages", `"${getItemTitle(item)}" image assets missing`, "warn");
      return null;
    }
    const assets = {
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

export const filterNormalizedData = async (container: ContainerSet): Promise<ContainerSet> => {
  if (!container?.items) {
    return null;
  }
  const validatedItems = await removeMissingImages(container.items);
  if (validatedItems.length > 0) {
    return {
      ...container,
      set: {
        ...container,
        items: validatedItems,
      },
    };
  }
  return null;
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
  const normalizedData = await filterNormalizedData(_container);
  callback(normalizedData);
};

export const fetchAndNormalizeData = async (data): Promise<{ sets: ContainerSet[], refs: ContainerSet[]}> => {
  const { sets, refs } = (await Promise.all(
    data.containers.map(async (_container) => {
      const isRef = _container?.set.refId;
      const result = isRef
        ? await _container
        : await filterNormalizedData(_container.set);

      return result ? { result, isRef } : null;
    })
  ))
  .reduce((acc, item) => {
    if (item) {      
      acc[item.isRef ? "refs" : "sets"].push(item.result);
    }
    return acc;
  }, { sets: [], refs: [] });
  return { sets, refs };
};

