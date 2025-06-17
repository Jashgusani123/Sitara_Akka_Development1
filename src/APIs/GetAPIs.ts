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