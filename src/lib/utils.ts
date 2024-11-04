import { produce } from 'immer';
import Handlebars from "handlebars";

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

export const getItemTitle = ({ title }) => {
  const { full } = title;
  return (
    full.series?.default.content ||
    full.program?.default.content ||
    full.collection?.default.content ||
    full.set.default.content
  );
};

export const getItemImage = (image, type, aspect) => {
  const collection = image[type];
  const imageType = collection[aspect];
  if (!collection && imageType) {
    return;
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
