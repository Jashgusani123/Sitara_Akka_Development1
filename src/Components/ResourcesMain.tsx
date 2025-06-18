import { Snackbar } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { GetEntries, GetResourceItems, GetSubdata, GetSubjects } from "../APIs/GetAPIs";
import type { RootState } from "../Redux/Store";
import CreateResourceDialog from "./CreateResourceDialog";
import LanguageSelector from "./LanguageSelector";
import Loding from "./Loding";
import { setSubDataMap } from "../Redux/Slices/subDataSlice";



const ResourcesMain = ({ isAdmin }: { isAdmin?: boolean }) => {
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
    const [expandedSubjectLoding, setExpandedSubjectLoding] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [SelectLangDialog, setSelectLangDialog] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const language = useSelector((state: RootState) => state.language.selectedLanguage);
    const allSubjects = useSelector((state: RootState) => state.resources.resources);
    const entries = useSelector((state: RootState) => state.entries.entries);
    const subDataMap = useSelector((state: RootState) => state.subData.subDataMap);
    const resourceItemsMap = useSelector((state: RootState) => state.resourceItems.resourceItemsMap);

    const dispatch = useDispatch();


    const handleEntriesRequest = (resourceId: string, subjectName: string) => {
        const isAlreadyExpanded = expandedSubject === subjectName;
        setExpandedSubject(isAlreadyExpanded ? null : subjectName);
        setExpandedEntryId(null);
        setExpandedSubId(null);
        dispatch(setSubDataMap([]));
        if (!isAlreadyExpanded) {
            GetEntries({ resourceId, dispatch });
        }
    };

    const handleSubdataFetch = (entryId: string) => {
        const isExpanded = expandedEntryId === entryId;
        setExpandedEntryId(isExpanded ? null : entryId);
        setExpandedSubId(null);
        dispatch(setSubDataMap([]));
        if (!isExpanded) {
            GetSubdata({ resourceDataEntryId: entryId, dispatch });
        }
    };

    const handleResourceItemsRequest = ({
        isArray,
        isSubExpanded,
        subDataId,
    }: {
        isArray: boolean;
        isSubExpanded: boolean;
        subDataId: string;
    }) => {
        if (!isArray) return;

        if (isSubExpanded) {
            setExpandedSubId("");
        } else {
            const isAvailable = resourceItemsMap[subDataId];
            if (!isAvailable) {
                GetResourceItems({ subDataId, dispatch });
            }
            setExpandedSubId(subDataId);
        }
    };

    const fetchResources = async () => {
        if (language === "") {
            setExpandedSubjectLoding(false);
            setMessage("First, Please Select Language, ")
            return;
        }
        await GetSubjects({ lan: language, dispatch });
        setExpandedSubjectLoding(false);
        if (allSubjects.length === 0) {
            setMessage("For This Language Resources not Avaiable....")
        }
    }
    useEffect(() => {
        fetchResources()
    }, [language]);

    const handleCreateResourceBTN = () => {
        setIsDialogOpen(true)
    }
    return (
        <main className="w-full h-auto p-4 bg-[#FAC54D] rounded-2xl">
            <div className="resources_heading w-full flex bg-white mb-4 rounded-[10px] items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 px-2">Resources</h2>
                {isAdmin && <button className="bg-[#0e6bb0] border-2 border-white text-white rounded-[10px] text-2xl p-2" onClick={handleCreateResourceBTN}>
                    Create Resource
                </button>}
            </div>

            <section className="bg-[#0E6BB0] h-auto rounded-2xl p-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y h-full flex justify-evenly flex-col divide-gray-200">
                        {allSubjects.length > 0 ? allSubjects.map((i) => (
                            <li key={i._id} className="p-4">
                                {/* Subject Header */}
                                <div className="flex justify-between items-center">
                                    <span
                                        onClick={() => handleEntriesRequest(i._id, i.subj)}
                                        className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer"
                                    >
                                        {i.subj}
                                    </span>
                                    {isAdmin && <div className="flex gap-2">
                                        <button className="bg-green-400 text-white rounded-xl px-4 py-1 hover:bg-green-500 text-sm transition">
                                            Edit
                                        </button>
                                        <button className="bg-red-400 text-white rounded-xl px-4 py-1 hover:bg-red-500 text-sm transition">
                                            Delete
                                        </button>
                                    </div>}
                                </div>

                                {/* Nested Entries (from API) */}
                                <AnimatePresence>
                                    {expandedSubject === i.subj && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-4 space-y-3"
                                        >
                                            {entries.length > 0 ? (
                                                entries.map((entry) => (
                                                    <div
                                                        key={entry._id}
                                                        className="flex flex-col gap-2 bg-zinc-100 px-4 py-3 rounded-lg shadow-sm"
                                                    >
                                                        <div className="flex justify-between items-center cursor-pointer"
                                                            onClick={() => handleSubdataFetch(entry._id)}
                                                        >
                                                            <span className="text-gray-700 font-medium">{entry.type}</span>
                                                            {isAdmin && <div className="flex gap-2">
                                                                <button className="bg-green-300 rounded-xl px-3 py-1 hover:bg-green-400 text-sm transition">
                                                                    Edit
                                                                </button>
                                                                <button className="bg-red-300 rounded-xl px-3 py-1 hover:bg-red-400 text-sm transition">
                                                                    Delete
                                                                </button>
                                                            </div>}
                                                        </div>

                                                        {/* Subdata Section */}
                                                        <AnimatePresence>
                                                            {expandedEntryId === entry._id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="ml-4 space-y-2"
                                                                >
                                                                    {subDataMap.length > 0 ? (
                                                                        subDataMap.map((sub) => {
                                                                            const isArray = sub.datatype === "array";
                                                                            const isSubExpanded = expandedSubId === sub._id;

                                                                            return (
                                                                                <div
                                                                                    key={sub._id}
                                                                                    className="flex flex-col gap-1 bg-white px-3 py-2 rounded-md border border-gray-200"
                                                                                >
                                                                                    <div
                                                                                        className="flex justify-between items-center cursor-pointer"
                                                                                        onClick={() => handleResourceItemsRequest({ isArray, isSubExpanded, subDataId: sub._id })}
                                                                                    >
                                                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                            {isArray && (
                                                                                                <span className="text-xs">
                                                                                                    {isSubExpanded ? "▼" : "►"}
                                                                                                </span>
                                                                                            )}
                                                                                            <span>{sub.name}</span>
                                                                                        </div>
                                                                                        {isAdmin && <div className="flex gap-2">
                                                                                            <button className="bg-green-200 rounded px-2 py-1 text-xs hover:bg-green-300">
                                                                                                Edit
                                                                                            </button>
                                                                                            <button className="bg-red-200 rounded px-2 py-1 text-xs hover:bg-red-300">
                                                                                                Delete
                                                                                            </button>
                                                                                        </div>}
                                                                                    </div>

                                                                                    {/* Subdata Array Dropdown */}
                                                                                    <AnimatePresence>
                                                                                        {isArray && isSubExpanded && (
                                                                                            <motion.div
                                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                                animate={{ opacity: 1, height: "auto" }}
                                                                                                exit={{ opacity: 0, height: 0 }}
                                                                                                transition={{ duration: 0.3 }}
                                                                                                className="mt-2 bg-zinc-100 rounded p-2 text-sm text-gray-600"
                                                                                            >
                                                                                                {resourceItemsMap && (
                                                                                                    <ul className="space-y-1">
                                                                                                        {resourceItemsMap[sub._id] ? resourceItemsMap[sub._id].map(item => (
                                                                                                            <li
                                                                                                                key={item._id}
                                                                                                                className="flex justify-between items-center bg-white rounded px-2 py-1 border text-gray-700"
                                                                                                            >
                                                                                                                <div className={`flex ${isAdmin ? "flex-col" : "flex-row justify-between w-full items-center"}`}>
                                                                                                                    <span>{item.name}</span>
                                                                                                                    <span className="text-xs text-gray-500">
                                                                                                                        {item.type.toUpperCase()}
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                {isAdmin && <div className="flex gap-2">
                                                                                                                    <button className="bg-green-200 rounded px-2 py-1 text-xs hover:bg-green-300">
                                                                                                                        Edit
                                                                                                                    </button>
                                                                                                                    <button className="bg-red-200 rounded px-2 py-1 text-xs hover:bg-red-300">
                                                                                                                        Delete
                                                                                                                    </button>
                                                                                                                </div>}
                                                                                                            </li>
                                                                                                        )) : <Loding />}
                                                                                                    </ul>
                                                                                                )}
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </AnimatePresence>
                                                                                </div>

                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <Loding />
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ))
                                            ) : (
                                                <Loding />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        )) : expandedSubjectLoding ? <Loding /> : <p className="flex  flex-wrap text-zinc-600 justify-center">{message}{message === "First, Please Select Language, " ? <span className="text-blue-800 underline cursor-pointer" onClick={() => setSelectLangDialog(true)}> Select Language </span> : <p>Try again</p>}</p>}
                    </ul>
                </div>
            </section>

            {SelectLangDialog && <LanguageSelector setOpenSnackbar={setOpenSnackbar} onClose={() => {
                setSelectLangDialog(false);
                fetchResources()
            }} />}

            {isDialogOpen && <CreateResourceDialog />}

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
        </main>
    )
}

export default ResourcesMain