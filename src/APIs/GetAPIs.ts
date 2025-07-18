import axios from "axios";
import type { Dispatch as ReduxDispatch } from "redux";
import { setEntriesForResource } from "../Redux/Slices/entriesSlice";
import { setGottedLanguages } from "../Redux/Slices/languageSlice";
import { setResourceItemsMap } from "../Redux/Slices/resourceItemsSlice";
import { setResources } from "../Redux/Slices/resourcesSlice";
import { setSubDataMap } from "../Redux/Slices/subDataSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


export const GetLanguages = async ({
  dispatch,
}: {
  dispatch: ReduxDispatch;
}) => {
  try {
    const response = await axios(`${BASE_URL}/api/resources/languages`);
    if (response.statusText !== "OK") {
      return false;
    }
    dispatch(setGottedLanguages(response.data.languages));
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

export const GetSubjects = async ({
  lan,
  dispatch,
}: {
  lan: string;
  dispatch: ReduxDispatch;
}) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/resources/subjects/v1?lan=${lan}`);
    if (response.statusText !== "OK") {
      return false;
    }
    dispatch(setResources(response.data.resources));
    return true;
  } catch (error) {
    console.error("GetSubjects error:", error);
    return false;
  }
};

export const GetEntries = async ({
  resourceId,
  dispatch,
  type
}: {
  resourceId: string;
  type: string;
  dispatch: ReduxDispatch;
}) => {
  try {
     const response = await axios.get(`${BASE_URL}/api/resources/data/v1`, {
      params: {
        resourceId,
        type,
      },
    });
    if (response.statusText !== "OK") {
      return false;
    }
    dispatch(setEntriesForResource({ entries: response.data.data, resourceId }));
    return true;
  } catch (error) {
    console.error("GetEntries error:", error);
    return false;
  }
};

export const GetSubdata = async ({
  resourceDataEntryId,
  dispatch,
}: {
  resourceDataEntryId: string;
  dispatch: ReduxDispatch;
}) => {
  try {
    const response = await axios(`${BASE_URL}/api/subdata/${resourceDataEntryId}`);
    if (response.statusText !== "OK") {
      return false;
    }
    dispatch(setSubDataMap({ items: response.data.subData, entryId: resourceDataEntryId }));
    return true;
  } catch (error) {
    console.error("GetSubdata error:", error);
    return false;
  }
};

export const GetResourceItems = async ({
  subDataId,
  dispatch,
}: {
  subDataId: string;
  dispatch: ReduxDispatch;
}) => {
  try {
    const response = await axios(`${BASE_URL}/api/resource-items/${subDataId}`);
    if (response.statusText !== "OK") {
      return false;
    }
    if (response.data.items) {
      dispatch(setResourceItemsMap({ key: subDataId, items: response.data.items }));
    }
    return true;
  } catch (error) {
    console.error("GetResourceItems error:", error);
    return false;
  }
};