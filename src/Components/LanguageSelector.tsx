import ClickAwayListener from "@mui/material/ClickAwayListener";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetLanguages } from "../APIs/GetAPIs";
import { setLanguage } from "../Redux/Slices/languageSlice";
import Loading from "./Loading";
import type { RootState } from "../Redux/Store";
import { Snackbar } from "@mui/material";

interface Props {
  onClose?: () => void;
  setOpenSnackbar: (open: boolean) => void;
}

const LanguageSelector = ({ onClose, setOpenSnackbar }: Props) => {
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [Error, setError] = useState('');
  const [showError, setshowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const Languages = useSelector((state: RootState) => state.language.gottedLanguages);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLang = async () => {
      if (Languages.length === 0) {
        setIsLoading(true);
        await GetLanguages({ dispatch });
        setIsLoading(false);
      }
    }
    fetchLang();
  }, []);

  const handleSelect = () => {
    if (selectedLang) {
      dispatch(setLanguage(selectedLang));
      setOpenSnackbar(true);
      setTimeout(() => setOpenSnackbar(false), 2000);
      if (onClose) onClose();
    } else {
      setError("Please Select Language !!");
      setshowError(true);
      setTimeout(() => setshowError(false), 2000);

    }
  };
  const handleCancle = () => {
    onClose?.();
  }

  return (
    <>
      <ClickAwayListener onClickAway={() => onClose?.()}>
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="absolute top-[210px] sm:top-[300px] md:top-32 lg:top-24 right-3 lg:right-4 gap-2 flex flex-col bg-zinc-300 text-blue-900 shadow-xl rounded-lg w-[90%] sm:w-[400px] max-w-full p-4 z-50 overflow-hidden"
        >
          <div className="options w-full justify-start items-center max-w-full flex gap-2 overflow-x-auto whitespace-nowrap px-2 scroll-smooth">
            {!isLoading ? <>{Languages.length !== 0 ? <>
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
            </> : <p className="text-zinc-500 text-sm">Not Available..</p>}</> : <Loading />}

          </div>
          <button
            className="bg-white p-2 rounded-2xl cursor-pointer"
            onClick={Languages.length !== 0 ? handleSelect : handleCancle}
          >
            {Languages.length !== 0 ? "Select" : "Cancle"}
          </button>
        </motion.div>
      </ClickAwayListener>
      <Snackbar
        open={showError}
        message={Error}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: {
            backgroundColor: "red",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
          },
        }}
      />
    </>
  );
};

export default LanguageSelector;
