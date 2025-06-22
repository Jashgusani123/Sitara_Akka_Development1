import { Snackbar, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdLogin, MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLanguages } from "../APIs/GetAPIs";
import type { RootState } from "../Redux/Store";
import LanguageSelector from "./LanguageSelector";
import { clearUser } from "../Redux/Slices/userSlice";

const Header = ({ IsAdmin }: { IsAdmin?: boolean }) => {
  const [selectLangBox, setSelectLangBox] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [gottedLanguages] = useSelector((state: RootState) => state.language.selectedLanguage);
  const user = useSelector((state: RootState) => state.user.user);
  const location = window.location.pathname;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClickSelectLanguage = async () => {
    setSelectLangBox(!selectLangBox);
    if (gottedLanguages.length === 0 || gottedLanguages === undefined) {
      GetLanguages({ dispatch });
    }
  };

  const handleLogoOut = ()=>{
    dispatch(clearUser());
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN)
  }
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
          } else if (!IsAdmin) {
            navigate("/")
          } else {
            navigate("/admin/dashbord");
          }
        }}
      >
        <p>Welcome</p>
      </motion.div>



      <div className="div flex justify-between items-center w-70">
        <Tooltip title="Select Language">
          <motion.div
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={handleClickSelectLanguage}
            className="welcome bg-[#FAC54D] flex justify-center text-black p-4 text-2xl rounded-2xl cursor-pointer"
          >
            Select Language
          </motion.div>

        </Tooltip>

        {user && <Tooltip title="Logout">

          <motion.div
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={handleLogoOut}
            className="welcome bg-[#FAC54D] flex justify-center  items-center w-fit h-fit text-black p-4 text-2xl rounded-2xl cursor-pointer"
          >
            <MdLogout></MdLogout>
          </motion.div>
        </Tooltip>}

        {!user &&  <Tooltip title="Login">

          <motion.div
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={()=>navigate("/login")}
            className="welcome bg-[#FAC54D] flex justify-center  items-center w-fit h-fit text-black p-4 text-2xl rounded-2xl cursor-pointer"
          >
            <MdLogin></MdLogin>
          </motion.div>
        </Tooltip>}
      </div>


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
