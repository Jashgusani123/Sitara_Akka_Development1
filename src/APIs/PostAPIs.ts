import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { Dispatch as ReduxDispatch} from "redux";
import { setResources } from "../Redux/Slices/resourcesSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const CreateResource = async ({
    lan,
    className,
    subj,
    dispatch,
    setMessage
}: {
    lan: string,
    className: string,
    subj: string,
    dispatch:ReduxDispatch,
    setMessage: Dispatch<SetStateAction<string>>
}) => {
    try {
        const response = await axios(`${BASE_URL}/api/resources`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: { lan, class: className, subj }
        });

        if (response.statusText !== "OK") {
            console.log("Error in Create Resources");
            return false;
        }

        setMessage(response.data.message);
        dispatch(setResources(response.data.resource))

        return true;
    } catch (error) {
        return false;
    }
};
