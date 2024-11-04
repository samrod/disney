import { produce } from 'immer';
import Handlebars from "handlebars";
import { consoleLog } from './logging';
import { fetchSet } from './api';
import useStore from './store';

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
  element: HTMLElement | Window | NodeListOf<Element>;
  handler: (e: Event) => void;
  options?: AddEventListenerOptions
}
export function bindEvent({ element, event, handler, options = {} }: BindParams) {
  if (element instanceof HTMLElement || element instanceof Window) {
    element.addEventListener(event, handler, options);
    return;
  }
  if (element instanceof NodeList) {
    element.forEach((el) => el.addEventListener(event, handler, options));
  }
}

const validateImageUrl = (url: string) => {
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

const removeMissingImages = (items) => {
  const { setItem } = useStore.getState();
  return items.map(async (item) => {
    const imageSrc = getItemImage(item, "tile", "1.78");
    const isValid = await validateImageUrl(imageSrc);
    if (isValid) {
      setItem(item?.contentId || item?.collectionId, item);
      return item;
    }
    consoleLog("filterValidContainers", `Error validating image URL for ${getItemTitle(item)}: ${imageSrc}`, "warn");
    return null;
  })
};

const filterNormalizedData = async (container: any[]): Promise<any[]> => {
  const validatedItems = await Promise.all(removeMissingImages(container.set.items));
  container.set.items = validatedItems.filter(item => item !== null);
  return container.set.items.length > 0 ? container : null;
};

export const fetchAndNormalizeData = (data) => (
  Promise.all(
    data.containers.map(async (_container) => {
      let container;
      if (_container.set.refId) {
        const response = await fetchSet(_container.set.refId)
        container = {
          ..._container,
          set: response.CuratedSet
            || response.TrendingSet
            || response.PersonalizedCuratedSet
        };
      } else {
        container = _container;
      }
      return filterNormalizedData(container);
    })
  )
);
