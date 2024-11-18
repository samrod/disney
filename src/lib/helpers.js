import { config } from "../../config";

export const getItemId = (item) => {
  if (!item) {
    return "";
  }
  return item.contentId || item.collectionId;
};

export const getItemTitle = (item) => {
  if (!item) {
    return null;
  }
  const { full } = item.text.title;
  return (
    full.series?.default.content ||
    full.program?.default.content ||
    full.collection?.default.content ||
    full.set.default.content
  );
};

export const getItemImage = (item, type, aspect = "1.78") => {
  if (!item) {
    return null;
  }
  const { image } = item;
  const collection = image[type];
  if (!collection) {
    // consoleLog("getItemImage", `${type} resource not available for ${getItemTitle(item)}`, "warn");
    return null;
  }
  const imageType = collection[aspect];
  if (!imageType) {
    return null;
  }
  const { masterId } = (
    imageType?.series?.default ||
    imageType?.program?.default ||
    imageType?.default?.default ||
    imageType?.collection?.default
  );
  return masterId;
};

export const formatImageSrc = (masterId, width = 500, format = "jpeg") => {
  return `${config.API_ASSETS}/${masterId}/scale?format=${format}&width=${width}&quality=90&scalingAlgorithm=lanczos3`;
};
