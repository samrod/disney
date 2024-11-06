import lodash from "lodash";
import { config } from "../../config";
import axios, { AxiosResponse } from "axios";

export const fetchData = async (uri: string) => {
  try {
    const response: AxiosResponse = await axios.get(uri);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.data;
  } catch (e) {
    console.error("Fetch error: ", e);
    return false;
  }
};

export const fetchList = async () => {
  const { data } = await fetchData(`${config.API_DOMAIN}/home.json`);
  return data?.StandardCollection || {};
};

export const fetchSet = async (ref: string) => {
  const { data } = await fetchData(`${config.API_DOMAIN}/sets/${ref}.json`);
  return data;
};
