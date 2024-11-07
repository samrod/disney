import Handlebars from "handlebars";
import { consoleLog } from "./logging";
import { config } from "../../config";

export const compileTemplate = (template: HTMLElement, data: {}) => {
  if (!template) {
    return null;
  }
  const _template = Handlebars.compile(template.innerHTML)
  return _template(data);
};

export const getItemId = (item) => {
  if (!item) {
    return "";
  }
  return item.contentId || item.collectionId;
};

export const getItemTitle = (item: unknown) => {
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

export const getItemImage = (item: unknown, type: string, aspect = "1.78") => {
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

export const formatImageSrc = (masterId: string, width = 500, format = "jpeg"): string => {
  return `${config.API_ASSETS}/${masterId}/scale?format=${format}&width=${width}&quality=90&scalingAlgorithm=lanczos3`;
};
