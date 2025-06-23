import { useEffect, useState } from "react";
import CreateResourceItemForm from "../CreateResourcesSteps/CreateResourceItemForm";
import { Snackbar } from "@mui/material";
import { deleteResource } from "../../APIs/PostAPIs";
import { useDispatch } from "react-redux";



interface Props {
    id: string,
    isAdmin: boolean | undefined,
    name: string,
    type: string,
    parentId: string,
    link: string | undefined
}
const ResourceItem = ({ id, isAdmin, name, type, parentId, link }: Props) => {
    const [showFormForEdit, setshowFormForEdit] = useState(false);
    const [Message, setMessage] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false);
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
    return (
        <>
            <li
                key={id}
                className="flex justify-between items-center bg-white rounded px-2 py-1 border text-gray-700"
            >
                <div className={`flex ${isAdmin ? "flex-col" : "flex-row justify-between items-center"}`}>
                    {type === "link" ? <a href={link} target="_blank">{name}</a> : <span>{name}</span>}
                    <span className="text-xs text-gray-500">
                        {type.toUpperCase()}
                    </span>
                </div>
                {isAdmin && <div className="flex gap-2">
                    <button className="bg-green-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-green-300" onClick={() => setshowFormForEdit(true)}>
                        Edit
                    </button>
                    <button className="bg-red-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-red-300" onClick={() => { deleteResource({ id: id, at: "resource-items", key: parentId, setMessage , dispatch }) }}>
                        Delete
                    </button>
                </div>}
            </li>

            {showFormForEdit && (
                <CreateResourceItemForm
                    subDataId={parentId}
                    id={id}
                    handleEditRequest={true}
                    onClose={() => {
                        setshowFormForEdit(false)
                    }}
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
        </>
    )
}

export default ResourceItem