import axios from "axios"
import type { Dispatch, SetStateAction } from "react";


const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const GetLanguages = async ({
  setLanguages,
}: {
  setLanguages: Dispatch<SetStateAction<string[]>>;
}) => {
  try {
    const response = await axios(`${BASE_URL}/api/resources/languages`);
    if (response.statusText !== "OK") {
      return console.log("Error in GetLanguage");
    }
    setLanguages(response.data.languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

export const GetSubjects = async ({lan , setAllSubjects}:{lan:string , setAllSubjects : Dispatch<SetStateAction<{
  "_id": string,
  "lan": string,
  "class": string,
  "subj": string
}[]>>}) => {
  try {
    const response = await axios(`${BASE_URL}/api/resources/subjects?lan=${lan}`);
    if (response.statusText !== "OK") {
      return console.log("Error in GetLanguage");
    }
    setAllSubjects(response.data.resources);
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
}

export const GetEntries = async({resourceId , setEntries}:{resourceId:string ,setEntries:Dispatch<SetStateAction<{
  _id: string;
  type: string;
}[]>> })=>{
  try {
    const response = await axios(`${BASE_URL}/api/resource-data-entries/${resourceId}`);
    if (response.statusText !== "OK") {
      return console.log("Error in GetLanguage");
    }
    setEntries(response.data.entries)
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
}

export const GetSubdata = async({resourceDataEntryId , setSubData}:{resourceDataEntryId:string , setSubData: Dispatch<SetStateAction<{
  _id: string,
  name: string,
  datatype: string
}[]>> })=>{
  try {
    const response = await axios(`${BASE_URL}/api/subdata/${resourceDataEntryId}`);
    if (response.statusText !== "OK") {
      return console.log("Error in GetLanguage");
    }
    setSubData(response.data.subData)
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
}

export const GetResourceItems = async({subDataId , setResourceItems}:{subDataId:string , setResourceItems: Dispatch<SetStateAction<{
  _id: string,
  name: string,
  type: string
}[]>> })=>{
  try {
    const response = await axios(`${BASE_URL}/api/resource-items/${subDataId}`);
    if (response.statusText !== "OK") {
      return console.log("Error in GetLanguage");
    }
    setResourceItems(response.data.items)
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
}