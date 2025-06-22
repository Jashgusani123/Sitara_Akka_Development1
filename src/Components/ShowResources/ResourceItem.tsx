import { useState } from "react";
import CreateResourceItemForm from "../CreateResourcesSteps/CreateResourceItemForm";



interface Props {
    id: string,
    isAdmin: boolean | undefined,
    name: string,
    type: string,
    parentId: string,
    handleDelete: ({ id, at, key }: { id: string, at: string, key?: string }) => void,
    link: string | undefined
}
const ResourceItem = ({ id, isAdmin, name, type, parentId, handleDelete, link }: Props) => {
    const [showFormForEdit, setshowFormForEdit] = useState(false);

    return (
        <>
                <li
                    key={id}
                    className="flex justify-between items-center bg-white rounded px-2 py-1 border text-gray-700"
                >
                    <div className={`flex ${isAdmin ? "flex-col" : "flex-row justify-between items-center"}`}>
                        {type === "link" ? <a href={link} target="_blank">{name}</a> :<span>{name}</span>}
                        <span className="text-xs text-gray-500">
                            {type.toUpperCase()}
                        </span>
                    </div>
                    {isAdmin && <div className="flex gap-2">
                        <button className="bg-green-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-green-300" onClick={() => setshowFormForEdit(true)}>
                            Edit
                        </button>
                        <button className="bg-red-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-red-300" onClick={() => { handleDelete({ id: id, at: "resource-items", key: parentId }) }}>
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

        </>
    )
}

export default ResourceItem