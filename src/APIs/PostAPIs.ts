import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { Dispatch as ReduxDispatch } from "redux";
import { appendEntryToResource, removeEntryFromResource, updateEntryForResource } from "../Redux/Slices/entriesSlice";
import { appendResourceItem, removeResourceItemById, updateResourceItemById } from "../Redux/Slices/resourceItemsSlice";
import { appendResource, removeResourceById, updateResourceById } from "../Redux/Slices/resourcesSlice";
import { appendSubdata, removeSubDataById, updateSubDataById } from "../Redux/Slices/subDataSlice";
import { setUser } from "../Redux/Slices/userSlice";

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
        const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
        const response = await axios(`${BASE_URL}/api/resources`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            data: { lan, class: className, subj }
        });
        setMessage(response.data.message);
        dispatch(appendResource(response.data.resource))
        return true;
    } catch (error: any) {
        if (error.response.status == 409) {
            setMessage("❌ Resource with this same data already exists for this Language");
        }
        else {
            setMessage("❌ " + (error.response?.data?.message || "Failed to create Resource"));
        }
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
        const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
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
        dispatch(appendEntryToResource({ entry: response.data.resourceEntry, resourceId }))
        return true;
    } catch (error: any) {
        if (error.response?.status === 409) {
            setMessage("❌ For this type already exists in this Resource, Make with other type ...")
            return null;
        } else if (error.response.status === 404) {
            setMessage("Refresh the page and Try again...");
            return null
        } else {
            setMessage("❌ " + (error.response?.data?.message || "Failed to create entry"));
        }
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
    link
}: {
    file?: File; // optional now
    name: string;
    datatype: string;
    resourceDataEntryId: string;
    setMessage: (msg: string) => void;
    dispatch: ReduxDispatch;
    link: string | undefined
}) => {
    try {
        const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
        const formData = new FormData();

        if (resourceDataEntryId && name && (datatype && ["link", "array", "file"].includes(datatype))) {
            formData.append("name", name);
            formData.append("datatype", datatype);
            formData.append("resourceDataEntryId", resourceDataEntryId);
        } else {
            setMessage("❌ Data not provided Properly.. ")
        }


        if (datatype === "link") {
            if (!link) {
                setMessage("❌ Link is required for datatype 'link'");
                return null;
            }
            formData.append("link", link);
        }

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
        setMessage(response.data.message);
        dispatch(appendSubdata({ item: response.data.subData, entryId: resourceDataEntryId }));
        return response.data.subData;
    } catch (error: any) {
        if (error.response.status === 409) {
            setMessage("❌ SubData with this same Data already exists");
        } else if (error.response.status === 404) {
            setMessage("Refresh the page and Try again... ")
        } else {
            setMessage("❌ " + (error.response?.data?.message || "Failed to create SubData"));
        }
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
    dispatch,
}: {
    name: string;
    icon: string;
    type: "file" | "link";
    subDataId: string;
    file?: File;
    link?: string;
    setMessage: (msg: string) => void;
    dispatch: ReduxDispatch,
}) => {
    try {
        const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
        const formData = new FormData();
        if (name && icon && type && subDataId) {
            formData.append("name", name);
            formData.append("icon", icon);
            formData.append("type", type);
            formData.append("subDataId", subDataId);
        }

        if (type === "file" && file) formData.append("file", file);
        if (type === "link" && link) formData.append("link", link);

        const response = await axios.post(`${BASE_URL}/api/resource-items`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        setMessage(response.data.message);
        dispatch(appendResourceItem({ key: subDataId, item: response.data.resourceItem }));
        return response.data.resourceItem;
    } catch (error: any) {
        if (error.response.status === 404) {
            setMessage("Refresh the page and Try again... ")
        } else if (error.response.status === 409) {
            setMessage("❌ ResourceItem with this same Data already exists...")
        } else {
            setMessage("❌ " + (error.response?.data?.message || "Failed to create Resource Item"));
        }
        return null;
    }
};

export const deleteResource = async ({ id, at, dispatch, key, setMessage }: { id: string, at: string, dispatch: ReduxDispatch, key?: string, setMessage: (msg: string) => void; }) => {
    try {
        const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
        const response = await axios.delete(`${BASE_URL}/api/${at}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        setMessage(response.data.message)
        if (at === 'resources') {
            dispatch(removeResourceById(id));
        } else if (at === 'resource-data-entries' && key) {
            dispatch(removeEntryFromResource({ entryId: id, resourceId: key }))
        } else if (at === 'subdata' && key) {
            dispatch(removeSubDataById({ id, entryId: key }));
        } else if (at === 'resource-items') {
            dispatch(removeResourceItemById({ key: key!, id }));
        }
    } catch (error: any) {
        setMessage(error.response.data.message)
    }

};

export const EditResource = async ({ id, at, dispatch, key, data, setMessage }: { id: string, at: string, dispatch: ReduxDispatch, key?: string, data: any, setMessage: (msg: string) => void; }) => {
    try {
        const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);

        const response = await axios.put(`${BASE_URL}/api/${at}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        if (at === 'resources') {
            dispatch(updateResourceById(response.data.resource));
        } else if (at === 'resource-data-entries' && key) {
            dispatch(updateEntryForResource({ entry: response.data.entry, resourceId: key }))
        } else if (at === 'subdata' && key) {
            dispatch(updateSubDataById({ item: response.data.subData, entryId: key }));
        } else if (at === 'resource-items') {
            dispatch(updateResourceItemById({ key: key!, item: response.data.resourceItem }));
        }
        return true
    } catch (error: any) {
        switch (error.response.status) {
            case 404:
                setMessage("Refresh the page and Try again...")
                break;
            case 409:
                setMessage("❌ " + error.response.data.message)
                break;
            case 400:
                setMessage("❌ " + error.response.data.message)
                break;
        }

        return false;
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
    setMessage
}: {
    phone: string;
    firstName: string;
    lastName: string;
    age: number;
    standard: string;
    gender: string;
    dispatch: ReduxDispatch;
    setMessage: (msg: string) => void;
}) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/register`, {
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
        const { token } = response.data;

        localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN, token);
        dispatch(setUser(response.data.user));
        return true;
    } catch (error: any) {
        if (error.response.status === 409) {
            setMessage("User with this phone number already exists")
        }
        return false;
    }
};

export const LoginUser = async ({
  phone,
  dispatch,
  setMessage,
}: {
  phone: string;
  dispatch: ReduxDispatch;
  setMessage: (msg: string) => void;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login`, {
      phoneNumber: phone,
    });

    const { token, isAlreadyPresent, user } = response.data;

    if (isAlreadyPresent) {
      localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN, token);
      dispatch(setUser(user));
      return { success: true, isAlreadyPresent: true };
    } else {
      return { success: true, isAlreadyPresent: false };
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      setMessage("Account Not Available..");
    } else {
      setMessage("Login failed");
    }
    return { success: false };
  }
};