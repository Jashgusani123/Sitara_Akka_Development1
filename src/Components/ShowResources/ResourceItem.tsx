


interface Props {
    id:string,
    isAdmin:boolean | undefined,
    name:string,
    type:string,
    subjectId:string
    handleDelete:({id , at , key}:{id:string ,at:string ,key?:string})=>void
}
const ResourceItem = ({id , isAdmin , name , type , subjectId , handleDelete}:Props) => {
    
    return (
        <>
            <li
                key={id}
                className="flex justify-between items-center bg-white rounded px-2 py-1 border text-gray-700"
            >
                <div className={`flex ${isAdmin ? "flex-col" : "flex-row justify-between w-full items-center"}`}>
                    <span>{name}</span>
                    <span className="text-xs text-gray-500">
                        {type.toUpperCase()}
                    </span>
                </div>
                {isAdmin && <div className="flex gap-2">
                    <button className="bg-green-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-green-300">
                        Edit
                    </button>
                    <button className="bg-red-200 rounded px-2 py-1 text-xs cursor-pointer hover:bg-red-300" onClick={() => { handleDelete({ id: id, at: "resource-items", key:subjectId }) }}>
                        Delete
                    </button>
                </div>}
            </li>
        </>
    )
}

export default ResourceItem