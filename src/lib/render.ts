import Handlebars from "handlebars";
import { Container } from "./types";
import { $, compileTemplate, getItemImage, getItemTitle } from "./utils";
import "../styles.scss";

export const renderContainers = (containers: Container[]) => {
  const containerElement = $("#tmpl-containers");
  if (!containerElement) return;

  $("#root").innerHTML += compileTemplate("#tmpl-containers", containers);
};

export const registerHelpersAndPartials = () => {
  Handlebars.registerPartial('tile', $('#tmpl-tile').innerHTML);
  Handlebars.registerPartial('container', $('#tmpl-container').innerHTML);
  Handlebars.registerHelper("getItemTitle", getItemTitle);
  Handlebars.registerHelper("getItemImage", getItemImage);  
};
