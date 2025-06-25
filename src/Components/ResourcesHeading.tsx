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
  const location = window.location.pathname;
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources.resources);
  const [selectLangBox, setSelectLangBox] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [gottedLanguages] = useSelector((state: RootState) => state.language.gottedLanguages);

  const handleBackClick = () => {
    const isAdmin = location.split("/")[1] === "admin";
    if (isAdmin) {
      navigate("/admin/dashbord");
    } else {
      navigate("/");
    }
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
    if (gottedLanguages.length === 0 || gottedLanguages === undefined) {
      GetLanguages({ dispatch });
    }
  };

  return (
    <>
      <div className="w-full flex flex-wrap justify-center gap-4 items-center p-4">
        {/* Back Button */}
        <div
          className="bg-[#FAC54D] cursor-pointer rounded-2xl p-4 hover:bg-[#0E6BB0] transition-colors duration-300"
          onClick={handleBackClick}
        >
          <SlArrowLeft className="w-6 h-6" />
        </div>

        {/* Search Bar */}
        <div className="flex flex-wrap gap-2 items-center flex-1 min-w-[250px] sm:min-w-[300px] md:min-w-[400px]">
          <input
            type="text"
            placeholder="Search Here..."
            className="rounded-2xl w-full bg-blue-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={search}
            onChange={handleChange}
          />
          {search && (
            <button
              onClick={handleClear}
              className="text-sm sm:text-base text-blue-700 bg-amber-200 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Select Language Button */}
        <Tooltip title="Select Language">
          <motion.div
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={handleClickSelectLanguage}
            className="bg-[#FAC54D] flex justify-center text-black p-4 text-sm sm:text-base rounded-2xl cursor-pointer"
          >
            Select Language
          </motion.div>
        </Tooltip>
      </div>

      {/* Language Box */}
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
