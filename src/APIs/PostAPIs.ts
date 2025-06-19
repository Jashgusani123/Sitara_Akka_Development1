import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { Dispatch as ReduxDispatch } from "redux";
import { removeResourceById, setResources } from "../Redux/Slices/resourcesSlice";
import { setUser } from "../Redux/Slices/userSlice";
import { removeResourceItemById, setResourceItemsMap } from "../Redux/Slices/resourceItemsSlice";
import { removeEntryById, setEntries } from "../Redux/Slices/entriesSlice";
import { removeSubDataById, setSubDataMap } from "../Redux/Slices/subDataSlice";

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
    dispatch: ReduxDispatch,
    setMessage: Dispatch<SetStateAction<string>>
}) => {
    try {
        const token = localStorage.getItem("tabataToken");
        const response = await axios(`${BASE_URL}/api/resources`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            data: { lan, class: className, subj }
        });

        if (response.status !== 201) {
            console.log("Error in Create Resources");
            return false;
        }

        setMessage(response.data.message);
        dispatch(setResources(response.data.resource))

        return response.data.resource;
    } catch (error) {
        return false;
    }
};
export const createResourceDataEntry = async ({
    type,
    resourceId,
    setMessage,
    dispatch
}: {
    type: string;
    resourceId: string;
    setMessage: (msg: string) => void;
    dispatch: ReduxDispatch

}) => {
    try {
        const token = localStorage.getItem("tabataToken");
        const response = await axios.post(
            `${BASE_URL}/api/resource-data-entries`,
            { type, resourceId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setMessage(response.data.message);
        dispatch(setEntries(response.data.resourceEntry))
        return response.data.resourceEntry;
    } catch (err: any) {
        setMessage("❌ " + (err.response?.data?.message || "Failed to create entry"));
        return null;
    }
};
export const createSubData = async ({
    file,
    name,
    datatype,
    resourceDataEntryId,
    setMessage,
    dispatch,
}: {
    file?: File; // optional now
    name: string;
    datatype: string;
    resourceDataEntryId: string;
    setMessage: (msg: string) => void;
    dispatch: ReduxDispatch;
}) => {
    try {
        const token = localStorage.getItem("tabataToken");
        const formData = new FormData();

        formData.append("name", name);
        formData.append("datatype", datatype);
        formData.append("resourceDataEntryId", resourceDataEntryId);

        if (datatype === "file") {
            if (!file) {
                setMessage("❌ File is required for datatype 'file'");
                return null;
            }
            formData.append("file", file);
        }

        const response = await axios.post(`${BASE_URL}/api/subdata`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(response);


        setMessage(response.data.message);
        dispatch(setSubDataMap(response.data.subData));
        return response.data.subData;
    } catch (err: any) {
        console.log(err);

        setMessage(
            "❌ " + (err.response?.data?.message || "Failed to create SubData")
        );
        return null;
    }
};
export const createResourceItem = async ({
    name,
    icon,
    type,
    subDataId,
    file,
    link,
    setMessage,
    dispatch
}: {
    name: string;
    icon: string;
    type: "file" | "link";
    subDataId: string;
    file?: File;
    link?: string;
    setMessage: (msg: string) => void;
    dispatch: ReduxDispatch
}) => {
    try {
        const token = localStorage.getItem("tabataToken");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("icon", icon);
        formData.append("type", type);
        formData.append("subDataId", subDataId);
        if (type === "file" && file) formData.append("file", file);
        if (type === "link" && link) formData.append("link", link);

        const response = await axios.post(`${BASE_URL}/api/resource-items`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        setMessage(response.data.message);
        dispatch(setResourceItemsMap(response.data.resourceItem))
        return response.data.resourceItem;
    } catch (err: any) {
        setMessage("❌ " + (err.response?.data?.message || "Failed to create Resource Item"));
        return null;
    }
};
export const deleteResource = async({id , at ,dispatch ,key}:{id:string , at:string , dispatch:ReduxDispatch , key?:string})=>{
    const token = localStorage.getItem('tabataToken');
    const response = await axios.delete(`${BASE_URL}/api/${at}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    }); 
    if(response.status !== 200){
        console.log("Server error:", response.statusText);
        return false;
    }
    if(at === 'resources'){

        dispatch(removeResourceById(id));
    }else if(at === 'resource-data-entries'){
        dispatch(removeEntryById(id))
    }else if(at === 'subdata'){
        dispatch(removeSubDataById(id));
    }else if (at === 'resource-items'){
        dispatch(removeResourceItemById({key:key! ,id}));
    }
     
}


export const RegistrationUser = async ({
    phone,
    firstName,
    lastName,
    age,
    standard,
    gender,
    dispatch,
}: {
    phone: string;
    firstName: string;
    lastName: string;
    age: number;
    standard: string;
    gender: string;
    dispatch: ReduxDispatch;
}) => {
    try {
        const response = await axios.post(`https://backend.barabaricollective.org/sitara/api/register`, {
            phoneNumber: phone,
            firstName,
            lastName,
            age,
            std: standard,
            gender,
        });

        if (response.status !== 201) {
            console.log("Server error:", response.statusText);
            return false;
        }

        dispatch(setUser(response.data.user));
        return true;
    } catch (error: any) {
        console.error("Registration failed:", error?.response?.data || error.message);
        return false;
    }
};

export const LoginUser = async ({ phone }: { phone: string }) => {
    try {
        const response = await axios.post(`https://backend.barabaricollective.org/sitara/api/login`, {
            phoneNumber: phone,

        });

        if (response.status !== 200) {
            console.log("Server error:", response.statusText);
            return false;
        }

        const { token } = response.data;

        localStorage.setItem('tabataToken', token);

        return true;
    } catch (error: any) {
        console.error("Login failed:", error?.response?.data || error.message);
        return false;
    }
};
