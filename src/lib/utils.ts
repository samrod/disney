import Handlebars from "handlebars";

export const $ = (selector: string): HTMLElement => {
  return document.querySelector(selector);
};

export const compileTemplate = (templateId: string, data: {}) => {
  const templateSource = $(templateId).innerHTML;
  const template = Handlebars.compile(templateSource)
  return template(data);
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
