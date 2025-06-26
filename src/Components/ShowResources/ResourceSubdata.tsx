import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Snackbar } from '@mui/material';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { GetResourceItems } from "../../APIs/GetAPIs";
import type { RootState } from "../../Redux/Store";
import Loading from "../Loading";
import ResourceItem from "./ResourceItem";

interface Props {
    isArray?: boolean | undefined;
    isSubExpanded: boolean;
    setExpandedSubId: (id: string | null) => void;
    setExpandedItemId: (id: string | null) => void;
    id: string;
    subject: string;
    parentId: string;
    type: string;
    link: string | undefined;
    outerParentId: string;
    expandedItemId: string | null;
}

const ResourceSubdata = ({
    isArray,
    isSubExpanded,
    setExpandedSubId,
    setExpandedItemId,
    id,
    subject,
    type,
    link,
    parentId,
    outerParentId,
    expandedItemId
}: Props) => {
    const [Message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [pendingLink, setPendingLink] = useState<string | null>(null);

    const isAuthenticated = useSelector((state: RootState) => state.user.user);
    const resourceItemsMap = useSelector((state: RootState) => state.resourceItems.resourceItemsMap);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (Message !== "") {
            setOpenSnackbar(true);
            const timer = setTimeout(() => {
                setOpenSnackbar(false);
                setMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [Message]);

    const handleResourceItemsRequest = ({
        isArray,
        isSubExpanded,
        subDataId,
    }: {
        isArray: boolean | undefined;
        isSubExpanded: boolean;
        subDataId: string;
    }) => {
        if (!isArray) return;

        if (isSubExpanded) {
            setExpandedSubId("");
        } else {
            const isAvailable = resourceItemsMap[subDataId];
            if (!isAvailable && subDataId) {
                GetResourceItems({ subDataId, dispatch });
            }
            setExpandedSubId(subDataId);
        }
    };

    const containerClass = "bg-white border border-gray-300 hover:bg-gray-100";

    return (
        <>
            <div
                className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer transition ${containerClass}`}
                onClick={() => {
                    if (type === "link" && link) {
                        if (isAuthenticated) {
                            window.open(link, "_blank");
                        } else {
                            setPendingLink(link ?? "");
                            setShowLoginWarning(true);
                        }
                    } else {
                        handleResourceItemsRequest({
                            isArray,
                            isSubExpanded,
                            subDataId: id,
                        });
                    }
                }}
            >
                <div className="flex items-center flex-wrap gap-2 text-sm text-gray-700">
                    {isArray && (
                        <span className="text-xs">{isSubExpanded ? "▼" : "►"}</span>
                    )}
                    <span>{subject}</span>
                    <span>({type})</span>
                </div>
            </div>

            <AnimatePresence>
                {isArray && isSubExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 bg-zinc-100 rounded p-2 text-sm text-gray-600"
                    >
                        <ul className="space-y-1">
                            {!Object.prototype.hasOwnProperty.call(resourceItemsMap, id) ? (
                                <Loading />
                            ) : resourceItemsMap[id].length === 0 ? (
                                <p className="text-zinc-500 text-sm">Not Added Yet.</p>
                            ) : (
                                resourceItemsMap[id].map((item) => (
                                    <ResourceItem
                                        setExpandedItemId={setExpandedItemId}
                                        expandedItemId={expandedItemId}
                                        key={item._id}
                                        id={item._id}
                                        name={item.name}
                                        link={item.link}
                                        type={item.type}
                                        parentId={id}
                                        entryId={parentId}
                                        resourceId={outerParentId}
                                    />
                                ))
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <Snackbar
                open={openSnackbar}
                message={Message}
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

            {showLoginWarning && (
                 <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-amber-100 rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2 flex flex-wrap justify-center items-center gap-1">
                            <InfoOutlinedIcon fontSize='large' /> Login Required
                        </h2>
                        <p className="text-gray-600 mb-4">You need to log in to view this content.</p>
                        <div className="loginFrom_buttons flex justify-center items-center ">
                        <button
                            onClick={() => {
                                navigate("/login", {
                                    state: {
                                        from: location,
                                        externalLink: pendingLink,
                                        resetOnReturn: true,
                                        data: {
                                            subDataId: id,
                                            entryId: parentId,
                                            resourceId: outerParentId
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
        </>
    );
};

export default ResourceSubdata;
