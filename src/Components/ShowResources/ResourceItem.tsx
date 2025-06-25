import { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { deleteResource } from "../../APIs/PostAPIs";
import CreateResourceItemForm from "../CreateResourcesSteps/CreateResourceItemForm";
import type { RootState } from "../../Redux/Store";

interface Props {
    id: string;
    isAdmin: boolean | undefined;
    name: string;
    type: string;
    parentId: string;
    link: string | undefined;
    entryId: string;
    resourceId: string;
    expandedItemId: string | null;
    setExpandedItemId: (id: string | null) => void;
}

const ResourceItem = ({
    id,
    isAdmin,
    name,
    type,
    parentId,
    link,
    entryId,
    resourceId,
    expandedItemId,
    setExpandedItemId
}: Props) => {
    const [showFormForEdit, setshowFormForEdit] = useState(false);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [pendingLink, setPendingLink] = useState<string | null>(null);

    const isAuthenticated = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (message !== "") {
            setOpenSnackbar(true);
            const timer = setTimeout(() => {
                setOpenSnackbar(false);
                setMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (expandedItemId === id) {
            const item = document.getElementById(`resource-item-${id}`);
            if (item) item.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [expandedItemId, id]);

    const handleLinkClick = () => {
        if (isAuthenticated) {
            if (link) {
                setExpandedItemId(id); // highlight on click
                window.open(link, "_blank");
            }
        } else {
            setPendingLink(link ?? "");
            setShowLoginWarning(true);
        }
    };
   

    const isSelected = expandedItemId === id;

    return (
        <>
            <li
                key={id}
                id={`resource-item-${id}`}
                className={`flex justify-between items-center rounded px-2 py-1 border 
                    ${isSelected ? "bg-yellow-100 border-yellow-500" : "bg-white border-gray-300"}
                    text-gray-700 transition`}
            >
                <div className={`flex ${isAdmin ? "flex-col" : "flex-row w-full justify-between items-center"}`}>
                    {type === "link" ? (
                        <span className="cursor-pointer" onClick={handleLinkClick}>
                            {name}
                        </span>
                    ) : (
                        <span>{name}</span>
                    )}
                    <span className="text-xs text-gray-500">{type.toUpperCase()}</span>
                </div>

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
                            onClick={() =>
                                deleteResource({ id, at: "resource-items", key: parentId, setMessage, dispatch })
                            }
                        >
                            Delete
                        </button>
                    </div>
                )}
            </li>

            {showFormForEdit && (
                <CreateResourceItemForm
                    subDataId={parentId}
                    id={id}
                    handleEditRequest={true}
                    onClose={() => setshowFormForEdit(false)}
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

            {showLoginWarning && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-amber-100 rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-1">
                            <InfoOutlinedIcon fontSize='large' /> Login Required
                        </h2>
                        <p className="text-gray-600 mb-4">You need to log in to view this content.</p>
                        <button
                            onClick={() => {
                                navigate("/login", {
                                    state: {
                                        from: location,
                                        externalLink: pendingLink,
                                        resetOnReturn: true,
                                        data: {
                                            resourceItemId: id,
                                            subDataId: parentId,
                                            entryId: entryId,
                                            resourceId: resourceId
                                        }
                                    },
                                });
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

export default ResourceItem;