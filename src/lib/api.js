import { config } from "../../config";
import { consoleLog } from "./logging";

export const fetchData = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok || response.status < 200 || response.status >= 300) {
      consoleLog("HTTP error", response.status, "error");
    }

    return await response.json();
  } catch (e) {
    consoleLog("Fetch error", e, "error");
    return false;
  }
};

export const fetchList = async () => {
  const response = await fetchData(`${config.API_DOMAIN}/home.json`);
  return response.data?.StandardCollection || response;
};

export const fetchSet = async (ref) => {
  const { data } = await fetchData(`${config.API_DOMAIN}/sets/${ref}.json`);
  return data;
};
