Array.prototype.mapJoin = function (callback) {
  return this.map(callback).join("");
};

export const $ = (selector: string): HTMLElement => {
  return document.querySelector(selector);
};

export const $$ = (selector: string): NodeListOf<Element> => {
  return document.querySelectorAll(selector);
};

export const restrictToRange = (value: number, max: number): number => {
  return Math.max(Math.min(value, max), 0);
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

