import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Snackbar, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GetSubjects } from "../APIs/GetAPIs";
import { selectResourceById, selectUniqueClasses } from "../Redux/Slices/resourcesSlice";
import type { RootState } from "../Redux/Store";
import LanguageSelector from "./LanguageSelector";
import Loading from "./Loading";
import Resource from "./ShowResources/Resource";
const ResourcesMain = ({ search }: { search: string }) => {
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [expandedSubjectLoading, setExpandedSubjectLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const [SelectLangDialog, setSelectLangDialog] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const language = useSelector((state: RootState) => state.language.selectedLanguage);
    const allSubjects = useSelector((state: RootState) => state.resources.resources);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useSelector(selectUniqueClasses);
    const clickedResource = useSelector(selectResourceById(expandedSubject ? expandedSubject : ""));
    const fetchResources = async () => {
        if (language === "") {
            setExpandedSubjectLoading(false);
            setMessage("First, Please Select Language, ");
            return;
        }
        setExpandedSubjectLoading(true)
        await GetSubjects({ lan: language, dispatch });
        setMessage("Language Selected !!");
        setExpandedSubjectLoading(false);
    };

    useEffect(() => {
        fetchResources();
    }, [language]);

    useEffect(() => {
        const reset = location.state?.reset;
        const data = location.state?.data;

        if (reset || data) {

            setTimeout(() => {
                setExpandedSubject(data.resourceId);
                setExpandedEntryId(data.entryId);
                setExpandedSubId(data.subDataId);
                setExpandedItemId(data.resourceItemId ?? null);
                navigate(location.pathname, { replace: true, state: {} });
            }, 0);
        }
    }, [location]);

    return (
        <main className="w-full h-auto p-4">
            <div className="resources_heading w-full bg-[#FAC54D] flex rounded-2xl p-2 items-center justify-between">
                <h2 className="text-3xl font-bold flex-wrap text-gray-800 px-2">
                    Subjects
                </h2>
            </div>
            {language !== "" && (
                <div className="path_showing mt-3 flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-xl shadow-sm mb-4 border border-gray-300 overflow-x-auto whitespace-nowrap no-scrollbar w-fit text-[14px] sm:text-base">

                    <Tooltip title="Language">
                        <p className="font-semibold text-blue-800 text-xl">{language}</p>
                    </Tooltip>
                    <ArrowForwardIosIcon className="text-yellow-500" />

                    {classes.length > 0 && (
                        <Tooltip title="Class">
                            <p className={`text-xl font-semibold ${clickedResource ? "text-blue-800" : "text-gray-700"}`}>
                                {classes.slice(0, 3).join(", ")}
                                {classes.length > 3 && ", ..."}
                            </p>
                        </Tooltip>
                    )}

                    {clickedResource && (
                        <>
                            <ArrowForwardIosIcon className="text-yellow-500" />
                            <Tooltip title="Subject">
                                <p className="text-gray-700 font-extrabold text-xl">{clickedResource.subj}</p>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}


            <section className=" border-8 mt-3 border-[#0E6BB0] bg-yellow-50 h-auto rounded-xl p-4">
                <div className="bg-white border border-gray-400 rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y h-full flex justify-evenly flex-col divide-gray-400">
                        {allSubjects.length > 0 ? (
                            allSubjects.map((i) => (
                                <li key={i._id} className="p-4">
                                    <Resource
                                        expandedSubject={expandedSubject}
                                        setExpandedSubject={setExpandedSubject}
                                        setExpandedEntryId={setExpandedEntryId}
                                        setExpandedSubId={setExpandedSubId}
                                        setExpandedItemId={setExpandedItemId}
                                        id={i._id}
                                        subject={i.subj}
                                        expandedEntryId={expandedEntryId}
                                        expandedSubId={expandedSubId}
                                        expandedItemId={expandedItemId}
                                    />
                                </li>
                            ))
                        ) : expandedSubjectLoading ? (
                            <Loading />
                        ) : language !== "" ? (
                            <div className="w-full max-w-md mx-auto m-6 bg-[#f9dd6e7e] border-2 border-blue-900 rounded-xl p-5 flex flex-col items-center justify-center shadow-md">
                                <p className="text-center text-gray-700 text-lg ">
                                    For this Keyword ("{search}"), No subjects available for <span className="font-semibold text-blue-900">{language} </span>Language.
                                </p>
                            </div>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ x: 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 300, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="flex flex-col items-center justify-center border-2 border-blue-800 rounded-2xl p-6 max-w-md mx-auto bg-[#f9dd6e7e] flex-wrap shadow-md m-4 "
                                >
                                    <p className="text-center text-blue-800 font-medium text-lg">
                                        <span className='underline cursor-pointer' onClick={()=>setSelectLangDialog(true)}>Please select a <span className="font-semibold">language</span></span> to view available subjects. 
                                    </p>
                                </motion.div>
                            </>
                        )}
                    </ul>
                </div>
            </section>

            {SelectLangDialog && (
                <LanguageSelector
                    setOpenSnackbar={setOpenSnackbar}
                    onClose={() => {
                        setSelectLangDialog(false);
                        fetchResources();
                    }}
                />
            )}

            <Snackbar
                open={openSnackbar}
                message={message}
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
        </main>
    );
};

export default ResourcesMain;