Array.prototype.mapJoin = function (callback) {
  return this.map(callback).join("");
};

export const $ = (selector) => {
  return document.querySelector(selector);
};

export const $$ = (selector) => {
  return document.querySelectorAll(selector);
};

export const restrictToRange = (value, max) => {
  return Math.max(Math.min(value, max), 0);
};

export function throttle(fn, delay) {
  let timeout;

  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const noop = () => null;

export function bindEvent({ element, event, handler, options = {} }) {
  if (element instanceof HTMLElement || element instanceof Window) {
    element.addEventListener(event, handler, options);
    return;
  }
  if (element instanceof NodeList) {
    element.forEach((el) => el.addEventListener(event, handler, options));
  }
}

