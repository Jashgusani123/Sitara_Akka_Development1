import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { SlArrowLeft } from "react-icons/sl";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../Redux/Store';
import { setResources } from '../Redux/Slices/resourcesSlice';
import { Snackbar, Tooltip } from '@mui/material';
import { motion } from "framer-motion";
import { GetLanguages } from '../APIs/GetAPIs';
import LanguageSelector from './LanguageSelector';

const ResourcesHeading = () => {
  const [search, setSearch] = useState("");
  const [originalResources, setOriginalResources] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources.resources);
  const [selectLangBox, setSelectLangBox] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [gottedLanguages] = useSelector((state: RootState) => state.language.gottedLanguages);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSearch = useCallback(
    debounce((value: string) => {
      if (value.trim() === "") {
        dispatch(setResources(originalResources.length ? originalResources : resources));
        return;
      }

      const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "");
      const filteredResources = (originalResources.length ? originalResources : resources).filter(r =>
        normalize(r.lan).includes(normalize(value)) ||
        normalize(r.subj).includes(normalize(value)) ||
        normalize(r.class).includes(normalize(value))
      );

      dispatch(setResources(filteredResources));
    }, 300),
    [resources, originalResources, dispatch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (!search && resources.length) {
      setOriginalResources(resources);
    }

    handleSearch(value);
  };

  const handleClear = () => {
    setSearch("");
    dispatch(setResources(originalResources.length ? originalResources : resources));
  };

  const handleClickSelectLanguage = async () => {
    setSelectLangBox(!selectLangBox);
    if (!gottedLanguages || gottedLanguages.length === 0) {
      GetLanguages({ dispatch });
    }
  };

  return (
    <>
      <div className="w-full flex p-4 flex-col sm:flex-row md:flex-row md:items-center md:justify-between gap-2">
        {/* Row with Back + Search + Clear */}
        <div className="w-full flex items-center justify-center md:justify-start gap-2">
          {/* Back Button */}
          <div
            className="bg-[#FAC54D] rounded-xl p-2 hover:bg-[#0E6BB0] transition-colors duration-300 cursor-pointer flex-shrink-0"
            onClick={handleBackClick}
          >
            <SlArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full sm:w-[180px] md:w-[350px] lg:w-[400px] bg-blue-300 px-4 py-2 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={search}
            onChange={handleChange}
          />

          {/* Clear Button */}
          {search && (
            <button
              onClick={handleClear}
              className="text-sm text-blue-700 bg-amber-200 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Select Language Button (goes below on md+) */}
        <div className="flex justify-center sm:justify-end md:justify-end w-full">
          <Tooltip title="Select Language">
            <motion.div
              initial={{ opacity: 0, filter: "blur(3px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleClickSelectLanguage}
              className="bg-[#FAC54D] text-black px-5 py-2 text-sm sm:text-base rounded-2xl cursor-pointer"
            >
              Select Language
            </motion.div>
          </Tooltip>
        </div>
      </div>

      {/* Language Selector */}
      {selectLangBox && <LanguageSelector onClose={() => setSelectLangBox(false)} setOpenSnackbar={setOpenSnackbar} />}

      {/* Snackbar */}
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
    </>
  );
};

export default ResourcesHeading;