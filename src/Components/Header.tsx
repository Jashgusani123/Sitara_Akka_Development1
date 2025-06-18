import { Snackbar } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLanguages } from "../APIs/GetAPIs";
import LanguageSelector from "./LanguageSelector";
import type { RootState } from "../Redux/Store";

const Header = () => {
  const [selectLangBox, setSelectLangBox] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [Languages] = useSelector((state:RootState)=>state.language.selectedLanguage);
  const location = window.location.pathname;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClickSelectLanguage = async () => {
    setSelectLangBox(!selectLangBox);
    if (Languages.length === 0) {
      GetLanguages({ dispatch });
    }
  };


  return (
    <header className="home_navbar flex justify-center md:justify-between lg:justify-between gap-3 flex-wrap w-full p-4">
      <motion.div
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="welcome bg-[#0E6BB0] flex justify-center text-white p-4 text-2xl rounded-2xl"
        onClick={() => {
          const isAdmin = location.split("/")[1] === "admin";
          if (isAdmin) {
            navigate("/");
          } else {
            navigate("/admin/dashbord")
          }
        }}
      >
        <p>Welcome</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onClick={handleClickSelectLanguage}
        className="welcome bg-[#FAC54D] flex justify-center text-black p-4 text-2xl rounded-2xl cursor-pointer"
      >
        Select Language
      </motion.div>

      {selectLangBox && <LanguageSelector onClose={() => setSelectLangBox(false)} setOpenSnackbar={setOpenSnackbar} />}
      <Snackbar
        open={openSnackbar}
        message="Language Selected!"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: {
            backgroundColor: "#FFD004",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
          },
        }}
      />
    </header>

  );
};

export default Header;
