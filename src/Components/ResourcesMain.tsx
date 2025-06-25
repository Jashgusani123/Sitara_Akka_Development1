import { Snackbar } from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GetSubjects } from "../APIs/GetAPIs";
import type { RootState } from "../Redux/Store";
import CreateResourceDialog from "./CreateResourcesSteps/CreateResourceDialog";
import LanguageSelector from "./LanguageSelector";
import Loading from "./Loading";
import Resource from "./ShowResources/Resource";

const ResourcesMain = ({ isAdmin }: { isAdmin?: boolean }) => {
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [expandedSubjectLoading, setExpandedSubjectLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [SelectLangDialog, setSelectLangDialog] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const language = useSelector((state: RootState) => state.language.selectedLanguage);
    const allSubjects = useSelector((state: RootState) => state.resources.resources);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchResources = async () => {
        if (language === "") {
            setExpandedSubjectLoading(false);
            setMessage("First, Please Select Language, ");
            return;
        }
        await GetSubjects({ lan: language, dispatch });
        setMessage("Language Selected !!");
        setExpandedSubjectLoading(false);
    };

    useEffect(() => {
        fetchResources();
    }, [language]);

    const handleCreateResourceBTN = () => {
        setIsDialogOpen(true);
    };

    useEffect(() => {
        const reset = location.state?.reset;
        const data = location.state?.data;

        if (reset && data) {
            setExpandedSubject(data.resourceId);
            setExpandedEntryId(data.entryId);
            setExpandedSubId(data.subdataId);
            setExpandedItemId(data.resourceItemId ?? null); // Optional, if you want to use this
        }

        // Clean up state
        if (reset) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    console.log(expandedSubject , expandedEntryId , expandedSubId , expandedItemId);
    


    return (
        <main className="w-full h-auto p-4 bg-[#FAC54D] rounded-2xl">
            <div className="resources_heading w-full flex bg-white mb-4 rounded-[10px] items-center justify-between">
                <h2 className="text-3xl font-bold flex-wrap text-gray-800 px-2">
                    Resources {language && <span className="text-zinc-400">({language})</span>}
                </h2>
                {isAdmin && (
                    <button
                        className={`bg-[#0e6bb0] border-2 border-white cursor-pointer text-white rounded-[10px] text-2xl p-2 `}
                        disabled={!language}
                        onClick={handleCreateResourceBTN}
                    >
                        Create Resource
                    </button>
                )}
            </div>

            <section className="bg-[#0E6BB0] h-auto rounded-2xl p-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y h-full flex justify-evenly flex-col divide-gray-200">
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
                                        isAdmin={isAdmin}
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
                            <p className="flex flex-wrap text-zinc-600 justify-center">
                                For this Language Resources not Available,
                                <span
                                    className="text-blue-800 underline cursor-pointer"
                                    onClick={() => setSelectLangDialog(true)}
                                >
                                    {" "}Select Language
                                </span>
                            </p>
                        ) : (
                            <p className="flex flex-wrap text-zinc-600 justify-center">
                                First, Please Select Language
                            </p>
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

            {isDialogOpen && (
                <CreateResourceDialog
                    open={isDialogOpen}
                    onClose={() => {
                        setIsDialogOpen(false);
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