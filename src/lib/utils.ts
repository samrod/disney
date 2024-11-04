import { produce } from 'immer';
import Handlebars from "handlebars";
import { consoleLog } from './logging';

export const $ = (selector: string): HTMLElement => {
  return document.querySelector(selector);
};

export const $$ = (selector: string): NodeListOf<Element> => {
  return document.querySelectorAll(selector);
};

type UpdateTypes = {
  [key: string]: boolean | string | {} | [];
}

export const update = (set, func: (state: UpdateTypes) => void) => set(produce(func));

export const compileTemplate = (template: HTMLElement, data: {}) => {
  const _template = Handlebars.compile(template.innerHTML)
  return _template(data);
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

export const getItemImage = (item, type, aspect) => {
  if (!item) {
    return null;
  }
  const { image } = item;
  const collection = image[type];
  if (!collection) {
    consoleLog("getItemImage", `${type} resource not available for ${getItemTitle(item.title)}`, "warn");
    return null;
  }
  const imageType = collection[aspect];
  if (!imageType) {
    return null;
  }
  return (
    imageType?.series?.default.url ||
    imageType?.program?.default.url ||
    imageType?.default?.default.url ||
    imageType?.collection?.default.url
  );
};

export const restrictToRange = (value: number, max: number): number => {
  return Math.max(Math.min(value, max - 1), 0);
};

interface BindParams {
  event: string;
  element: HTMLElement | Window;
  handler: (e: Event) => void;
  options?: AddEventListenerOptions
}
export function bindEvent({ element, event, handler, options = {} }: BindParams) {
  element.addEventListener(event, handler, options);
}

export const validateImageUrl = (url: string) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const filterValidContainers = async (containers: any[]): Promise<any[]> => {
  return Promise.all(containers.map(async (container) => {
    if (container.set?.items && Array.isArray(container.set.items)) {
      const validatedItems = await Promise.all(container.set.items.map(async (item) => {
        const imageSrc = getItemImage(item, "tile", "1.78");
        const isValid = await validateImageUrl(imageSrc);
        if (isValid) {
          return item;
        }
        consoleLog("filterValidContainers", `Error validating image URL for ${getItemTitle(item)}: ${imageSrc}`, "warn");
        return null;
      }));
      container.set.items = validatedItems.filter(item => item !== null);
      return container.set.items.length > 0 ? container : null;
    }
    return null;
  })).then(filteredContainers => filteredContainers.filter(container => container !== null)); // Filter out null containers
};
