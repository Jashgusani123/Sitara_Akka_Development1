import ClickAwayListener from "@mui/material/ClickAwayListener";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetLanguages } from "../APIs/GetAPIs";
import { setLanguage } from "../Redux/Slices/languageSlice";
import Loading from "./Loading";
import type { RootState } from "../Redux/Store";

interface Props {
  onClose?: () => void;
  setOpenSnackbar: (open: boolean) => void;
}

const LanguageSelector = ({ onClose, setOpenSnackbar }: Props) => {
  const [selectedLang, setSelectedLang] = useState<string>("");
  const Languages = useSelector((state: RootState) => state.language.gottedLanguages);

  const dispatch = useDispatch();

  useEffect(() => {
    if (Languages.length === 0) {
      GetLanguages({ dispatch });
    }
  }, []);

  const handleSelect = () => {
    if (selectedLang) {
      dispatch(setLanguage(selectedLang));
      setOpenSnackbar(true);
      setTimeout(() => setOpenSnackbar(false), 2000);
      if (onClose) onClose();
    }
  };
  const handleCancle = ()=>{
    onClose?.();
  }

  return (
    <ClickAwayListener onClickAway={() => onClose?.()}>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="absolute lg:top-24 lg:right-4 top-28 md:right-[-30px] gap-2 flex flex-col bg-zinc-300 text-blue-900 shadow-xl rounded-lg lg:w-96 p-4 z-50 w-fit right-3 overflow-hidden"
      >
        <div className="options w-full justify-center items-center max-w-full flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          {Languages.length !== 0 ? <>
            {Languages.length > 0 ? (
              Languages.map((lang) => (
                <p
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`p-2 rounded-2xl cursor-pointer ${selectedLang === lang ? "bg-blue-500 text-white" : "bg-white"
                    }`}
                >
                  {lang}
                </p>
              ))
            ) : (
              <Loading />
            )}
          </> : <p className="text-zinc-500 text-sm">Not Available..</p>}

        </div>
        <button
          className="bg-white p-2 rounded-2xl cursor-pointer"
          onClick={Languages.length !== 0 ? handleSelect : handleCancle}
        >
          {Languages.length !== 0 ? "Select" : "Cancle"}
        </button>
      </motion.div>
    </ClickAwayListener>
  );
};

export default LanguageSelector;
