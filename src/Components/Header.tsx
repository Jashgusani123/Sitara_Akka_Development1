import { motion } from "framer-motion";
import { useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { GetLanguages } from "../APIs/GetAPIs";

const Header = () => {
  const [selectLangBox, setSelectLangBox] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [Languages, setLanguages] = useState<Array<string>>([]);

  const handleClickSelectLanguage = async () => {
    setSelectLangBox(!selectLangBox);
    if (Languages.length === 0) {
      GetLanguages({ setLanguages });
    }
  }
  return (
    <header className="home_navbar flex justify-center md:justify-between lg:justify-between gap-3 flex-wrap w-full p-4">
      <motion.div
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="welcome bg-[#0E6BB0] flex justify-center text-white p-4 text-2xl rounded-2xl"
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

      {selectLangBox && (
        <ClickAwayListener onClickAway={() => setSelectLangBox(false)}>
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute lg:top-24 lg:right-4 top-28 right-[-30px] gap-2 flex flex-col bg-zinc-300 text-blue-900 shadow-xl rounded-lg lg:w-96 p-4 z-50   w-full max-w-full overflow-hidden"
          >
            <div className="options w-full justify-center items-center max-w-full flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
              {Languages.length > 0 ? Languages.map(
                (lang) => (
                  <p
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`p-2 rounded-2xl cursor-pointer ${selectedLang === lang
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                      }`}
                  >
                    {lang}
                  </p>
                )
              ):<div
              className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
            ></div>}
            </div>
            <button className="bg-white p-2 rounded-2xl cursor-pointer">
              Select
            </button>
          </motion.div>
        </ClickAwayListener>
      )}
    </header>
  );
};

export default Header;
