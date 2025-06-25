import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetResourceItems } from "../../APIs/GetAPIs";
import type { RootState } from "../../Redux/Store";
import CreateResourceItemForm from "../CreateResourcesSteps/CreateResourceItemForm";
import Loading from "../Loading";
import ResourceItem from "./ResourceItem";
import { SubDataUploadDialog } from '../CreateResourcesSteps/SubDataUploadDialog';
import { Snackbar } from '@mui/material';
import { deleteResource } from '../../APIs/PostAPIs';
import { useLocation, useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


interface Props {
    isArray?: boolean | undefined;
    isSubExpanded: boolean;
    setExpandedSubId: (id: string | null) => void;
    setExpandedItemId: (id: string | null) => void;
    id: string;
    isAdmin?: boolean;
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
    isAdmin,
    subject,
    type,
    parentId,
    link,
    outerParentId,
    expandedItemId
}: Props) => {
    const [showForm, setShowForm] = useState(false);
    const [currentSubId, setCurrentSubId] = useState<string | null>(null);
    const [showFormForEdit, setshowFormForEdit] = useState(false);
    const [Message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [pendingLink, setPendingLink] = useState<string | null>(null);

    // Access auth state
    const isAuthenticated = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();
    const location = useLocation();
    const resourceItemsMap = useSelector(
        (state: RootState) => state.resourceItems.resourceItemsMap
    );
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

    const handleAddEntry = (subDataId: string) => {
        setCurrentSubId(subDataId);
        setShowForm(true);
    };



    return (
        <>
            <div className="flex justify-between items-center">
                {type === "link" && link ? (
                    <div
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                        onClick={() => {
                            if (isAuthenticated) {
                                window.open(link, "_blank");
                            } else {
                                setPendingLink(link ?? "");
                                setShowLoginWarning(true);
                            }
                        }}
                    >
                        <span>{subject}</span>
                        <span>({type})</span>
                    </div>

                ) : (
                    <div
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                        onClick={() =>
                            handleResourceItemsRequest({
                                isArray,
                                isSubExpanded,
                                subDataId: id,
                            })
                        }
                    >
                        {isArray && (
                            <span className="text-xs">{isSubExpanded ? "▼" : "►"}</span>
                        )}
                        <span>{subject}</span>
                        <span>({type})</span>
                    </div>
                )}

                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            className="bg-green-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-green-300"
                            onClick={() => setshowFormForEdit(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-red-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteResource({ id: id, at: "subdata", key: parentId, setMessage, dispatch });
                            }}
                        >
                            Delete
                        </button>
                        {isArray && (
                            <button
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddEntry(id);
                                }}
                            >
                                <ControlPointIcon style={{ color: "black", cursor: "pointer" }} />
                            </button>
                        )}
                    </div>
                )}
            </div>


            <AnimatePresence>
                {isArray && isSubExpanded && resourceItemsMap[id] && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 bg-zinc-100 rounded p-2 text-sm text-gray-600"
                    >
                        <ul className="space-y-1">
                            {resourceItemsMap[id].length !== 0 ? <>
                                {resourceItemsMap[id].length > 0 ? (
                                    resourceItemsMap[id].map((item) => (
                                        <ResourceItem
                                            setExpandedItemId={setExpandedItemId}
                                            expandedItemId={expandedItemId}
                                            key={item._id}
                                            id={item._id}
                                            name={item.name}
                                            link={item.link}
                                            isAdmin={isAdmin}
                                            type={item.type}
                                            parentId={id}
                                            entryId={parentId}
                                            resourceId={outerParentId}
                                        />
                                    ))
                                ) : (
                                    <Loading />
                                )}

                            </> : <p className="text-zinc-500 text-sm">Not Added Yet.</p>}

                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {isArray && isSubExpanded && !resourceItemsMap[id] && (
                <p className="text-zinc-500 text-sm mt-2">Not Added Yet.</p>
            )}


            {showForm && currentSubId && (
                <CreateResourceItemForm
                    subDataId={currentSubId}
                    onClose={() => {
                        setShowForm(false)
                    }
                    }
                />
            )}

            {showFormForEdit && (
                <SubDataUploadDialog
                    handleEditRequest={true}
                    resourceDataEntryId={parentId}
                    subId={id}
                    onClose={() => setshowFormForEdit(false)}
                />
            )}
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
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-1">
                            <InfoOutlinedIcon fontSize='large' /> Login Required
                        </h2>
                        <p className="text-gray-600 mb-4">You need to log in to view this content.</p>
                        <button
                            onClick={() => {
                                navigate("/login", { state: { from: location, externalLink: pendingLink, data: { subDataId: id, entryId: parentId, resourceId: outerParentId } } });
                            }}
                            className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105"
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
            )}
        </>
    );
};

export default ResourceSubdata;