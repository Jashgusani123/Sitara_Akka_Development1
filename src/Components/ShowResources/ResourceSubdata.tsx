import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetResourceItems } from "../../APIs/GetAPIs";
import type { RootState } from "../../Redux/Store";
import CreateResourceItemForm from "../CreateResourcesSteps/CreateResourceItemForm";
import Loding from "../Loding";
import ResourceItem from "./ResourceItem";
import { SubDataUploadDialog } from '../CreateResourcesSteps/SubDataUploadDialog';

interface Props {
    isArray?: boolean | undefined;
    isSubExpanded: boolean;
    setExpandedSubId: (id: string | null) => void;
    id: string;
    isAdmin?: boolean;
    subject: string;
    handleDelete: ({
        id,
        at,
        key,
    }: {
        id: string;
        at: string;
        key?: string;
    }) => void;
    parentId: string;
    type: string;
    link: string | undefined
}

const ResourceSubdata = ({
    isArray,
    isSubExpanded,
    setExpandedSubId,
    id,
    isAdmin,
    subject,
    handleDelete,
    type,
    parentId,
    link
}: Props) => {
    const [showForm, setShowForm] = useState(false);
    const [currentSubId, setCurrentSubId] = useState<string | null>(null);
    const [showFormForEdit, setshowFormForEdit] = useState(false);

    const resourceItemsMap = useSelector(
        (state: RootState) => state.resourceItems.resourceItemsMap
    );
    const dispatch = useDispatch();

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
            if (!isAvailable) {
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
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                    >
                        <span>{subject}</span>
                        <span>({type})</span>
                    </a>
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
                                handleDelete({ id: id, at: "subdata", key: parentId });
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
                                            key={item._id}
                                            id={item._id}
                                            name={item.name}
                                            link={item.link}
                                            isAdmin={isAdmin}
                                            type={item.type}
                                            handleDelete={handleDelete}
                                            parentId={id}
                                        />
                                    ))
                                ) : (
                                    <Loding />
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
        </>
    );
};

export default ResourceSubdata;
