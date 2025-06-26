import axios from "axios";
import type { Dispatch as ReduxDispatch } from "redux";
import { setUser } from "../Redux/Slices/userSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

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
      return { success: true, isAlreadyPresent: false , number:user.phoneNumber};
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