import axios from "axios";
import type { Dispatch as ReduxDispatch } from "redux";
import { setEntries } from "../Redux/Slices/entriesSlice";
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
    const response = await axios.get(`${BASE_URL}/api/resources/subjects?lan=${lan}`);
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
}: {
  resourceId: string;
  dispatch: ReduxDispatch;
}) => {
  try {
    const response = await axios(`${BASE_URL}/api/resource-data-entries/${resourceId}`);
    if (response.statusText !== "OK") {
      return false;
    }
    dispatch(setEntries(response.data.entries));
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
    dispatch(setSubDataMap(response.data.subData));
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
    dispatch(setResourceItemsMap({ key: subDataId, items: response.data.items }));
    return true;
  } catch (error) {
    console.error("GetResourceItems error:", error);
    return false;
  }
};