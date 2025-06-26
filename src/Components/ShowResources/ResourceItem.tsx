import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import type { RootState } from "../../Redux/Store";

interface Props {
    id: string;
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
    name,
    type,
    parentId,
    link,
    entryId,
    resourceId,
    expandedItemId,
    setExpandedItemId
}: Props) => {
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [pendingLink, setPendingLink] = useState<string | null>(null);

    const isAuthenticated = useSelector((state: RootState) => state.user.user);
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
                setExpandedItemId(id); // still keep this for functionality
                window.open(link, "_blank");
            }
        } else {
            setPendingLink(link ?? "");
            setShowLoginWarning(true);
        }
    };

    return (
        <>
            <li
                key={id}
                id={`resource-item-${id}`}
                className={`flex justify-between items-center rounded px-2 py-1 border bg-white border-gray-300 text-gray-700 transition`}
            >
                <div className="flex flex-row flex-wrap w-full justify-between items-center">
                    {type === "link" ? (
                        <span className="cursor-pointer" onClick={handleLinkClick}>
                            {name}
                        </span>
                    ) : (
                        <span>{name}</span>
                    )}
                    <span className="text-xs text-gray-500">{type.toUpperCase()}</span>
                </div>
            </li>

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
                <div className="fixed top-0 left-0 w-full h-full text-black bg-black/40 flex items-center justify-center z-50">
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
                                            resourceItemId: id,
                                            subDataId: parentId,
                                            entryId: entryId,
                                            resourceId: resourceId
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

export default ResourceItem;
