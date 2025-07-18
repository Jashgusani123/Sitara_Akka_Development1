import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import youtube from '../assets/youtube.png';
import chapterNotes from '../assets/notes.avif';
import formula from '../assets/formula.jpg';
import test from '../assets/test.png';
import passingPackage from '../assets/passingPackage.png';
import toppersscripts from '../assets/topperAns.png';
import { GetEntries, GetSubjects } from "../APIs/GetAPIs";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../Redux/Store";
import { useNavigate, useLocation } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const resourceIcons: { [key: string]: { src: string, name: string } } = {
    youtube: { src: youtube, name: "Youtube" },
    chapternotes: { src: chapterNotes, name: "Chapter Notes" },
    formula: { src: formula, name: "Formula" },
    chaptertests: { src: test, name: "Previous Year Question paper" },
    passingpackage: { src: passingPackage, name: "Passing Package" },
    previouspaper: { src: passingPackage, name: "Previous Year Question Paper" },
    toppersscripts: { src: toppersscripts, name: "Topper’s Answer Scripts" },
    diagram: { src: passingPackage, name: "Diagram List" },
};

const ResourcesMain = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [expandedEntry, setExpandedEntry] = useState<boolean>(false);
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [pendingLink, setPendingLink] = useState<string | null>(null);
    const [entryMeta, setEntryMeta] = useState<{ subDataId?: string, entryId?: string, resourceId?: string } | null>(null);

    const [loading, setLoading] = useState(true);

    const Resources = useSelector((state: RootState) => state.resources.resources);
    const entriesMap = useSelector((state: RootState) => state.entries.entriesMap);
    const lan = useSelector((state: RootState) => state.language.selectedLanguage);
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleExpand = (id: string) => {
        setExpandedSubject(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            await GetSubjects({ lan, dispatch });
            setLoading(false);
        };
        fetchSubjects();
    }, []);

    const entries = entriesMap[expandedSubject || ""] || [];

    return (
        <main className="w-full h-auto p-4">
            <div className="resources_heading w-fit flex rounded-2xl p-2 items-center justify-between">
                <h2 className="text-3xl font-bold flex-wrap text-gray-800 px-2">Subjects</h2>
            </div>

            {loading ? (
                <div className="text-center w-full py-10 text-xl text-gray-600 font-medium">
                    Loading resources...
                </div>
            ) : Resources.length === 0 ? (
                <div className="text-center w-full py-10 text-xl text-gray-600 font-medium">
                    Resources Not Available Yet
                </div>
            ) : (
                Resources.map((subject) => (
                    <div key={subject._id} className="mt-4">
                        <button
                            onClick={() => toggleExpand(subject._id)}
                            className="w-full text-left cursor-pointer bg-yellow-300 hover:bg-yellow-400 px-4 py-3 font-semibold text-xl rounded-lg shadow"
                        >
                            {subject.subj}
                        </button>

                        <AnimatePresence>
                            {expandedSubject === subject._id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-2 px-3"
                                >
                                    <div className="grid grid-cols-3 gap-3 bg-zinc-300 p-3 rounded-md shadow-sm">
                                        {subject.types.map((type) => {
                                            const icon = resourceIcons[type?.toLowerCase()];
                                            return icon ? (
                                                <div
                                                    key={type}
                                                    onClick={() => {
                                                        const willExpand = !expandedEntry;
                                                        setExpandedEntry(willExpand);

                                                        if (willExpand) {
                                                            setSelectedType(type);
                                                            GetEntries({ resourceId: subject._id, dispatch, type });
                                                        } else {
                                                            setSelectedType(null);
                                                        }
                                                    }}
                                                    className="flex flex-col items-center cursor-pointer"
                                                >
                                                    <img
                                                        src={icon.src}
                                                        alt={icon.name}
                                                        className="w-14 h-14 object-contain bg-white p-2 rounded-md"
                                                    />
                                                    <p className="text-xs font-semibold mt-1 text-black text-center">{icon.name}</p>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>

                                    {selectedType && selectedType === entries[0]?.type && entries.length > 0 && (
                                        <div className="mt-4 space-y-2 bg-zinc-300 p-4 rounded-md shadow-inner">
                                            {entries.map((entryItem) => (
                                                <div
                                                    key={entryItem._id}
                                                    className="bg-yellow-400 rounded-full px-4 py-2 text-start font-medium flex justify-between flex-wrap text-sm cursor-pointer hover:bg-yellow-200"
                                                >
                                                    <p>{entryItem.name}</p>
                                                    <p
                                                        onClick={() => {
                                                            if (user && entryItem.link) {
                                                                window.open(entryItem.link, "_blank");
                                                            } else {
                                                                setPendingLink(entryItem.link || null);
                                                                setEntryMeta({
                                                                    subDataId: entryItem._id,
                                                                    entryId: entryItem._id,
                                                                    resourceId: expandedSubject || ""
                                                                });
                                                                setShowLoginWarning(true);
                                                            }
                                                        }}
                                                        className="underline text-blue-700 cursor-pointer"
                                                    >
                                                        {entryItem.datatype.toLocaleUpperCase()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            )}

            {showLoginWarning && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-amber-100 rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2 flex flex-wrap justify-center items-center gap-1">
                            <InfoOutlinedIcon fontSize="large" /> Login Required
                        </h2>
                        <p className="text-gray-600 mb-4">You need to log in to view this content.</p>
                        <div className="loginFrom_buttons flex justify-center items-center">
                            <button
                                onClick={() => {
                                    navigate("/login", {
                                        state: {
                                            from: location,
                                            externalLink: pendingLink,
                                            resetOnReturn: true,
                                            data: {
                                                subDataId: entryMeta?.subDataId,
                                                entryId: entryMeta?.entryId,
                                                resourceId: entryMeta?.resourceId
                                            }
                                        },
                                    });
                                }}
                                className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:scale-105"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => setShowLoginWarning(false)}
                                className="ml-4 bg-zinc-700 px-4 py-2 rounded text-white cursor-pointer hover:scale-105"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ResourcesMain;
