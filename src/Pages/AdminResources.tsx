import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { GetEntries, GetResourceItems, GetSubdata, GetSubjects } from "../APIs/GetAPIs";

const AdminResources: React.FC = () => {
    const [search, setSearch] = useState("");
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

    const [allSubjects, setAllSubjects] = useState<
        Array<{
            _id: string;
            lan: string;
            class: string;
            subj: string;
        }>
    >([]);
    const [entries, setEntries] = useState<
        Array<{
            _id: string;
            type: string;
        }>
    >([]);
    const [subDataMap, setSubDataMap] = useState<Array<{
        _id: string,
        name: string,
        datatype: string
    }>>([]);

    const [ResourceItems, setResourceItems] = useState<Array<{
        _id: string,
        name: string,
        type: string
    }>>([]);

    useEffect(() => {
        GetSubjects({ lan: "Gujarati", setAllSubjects });
    }, []);

    const handleEntriesRequest = (resourceId: string, subjectName: string) => {
        const isAlreadyExpanded = expandedSubject === subjectName;
        setExpandedSubject(isAlreadyExpanded ? null : subjectName);
        setExpandedEntryId(null);
        setExpandedSubId(null);
        setSubDataMap([]);
        if (!isAlreadyExpanded) {
            GetEntries({ resourceId, setEntries });
        }
    };

    const handleSubdataFetch = (entryId: string) => {
        const isExpanded = expandedEntryId === entryId;
        setExpandedEntryId(isExpanded ? null : entryId);
        setExpandedSubId(null);
        setSubDataMap([]);
        if (!isExpanded) {
            GetSubdata({ resourceDataEntryId: entryId, setSubData: setSubDataMap });
        }
    };

    return (
        <>
            {/* Top Search */}
            <div className="w-96 flex flex-wrap p-4 gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search Here..."
                    className="flex-1 rounded-2xl bg-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="rounded-2xl bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition">
                    Search
                </button>
            </div>

            <main className="w-full p-4 bg-[#FAC54D] rounded-2xl">
                <div className="resources_heading w-full flex bg-white mb-4 rounded-[10px] items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-800 px-2">Resources</h2>
                    <button className="bg-[#0e6bb0] border-2 border-white text-white rounded-[10px] text-2xl p-2">
                        Create Resource
                    </button>
                </div>

                <section className="bg-[#0E6BB0] rounded-2xl p-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                        <ul className="divide-y h-fit flex justify-evenly flex-col divide-gray-200">
                            {allSubjects.map((i) => (
                                <li key={i._id} className="p-4">
                                    {/* Subject Header */}
                                    <div className="flex justify-between items-center">
                                        <span
                                            onClick={() => handleEntriesRequest(i._id, i.subj)}
                                            className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer"
                                        >
                                            {i.subj}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="bg-green-400 text-white rounded-xl px-4 py-1 hover:bg-green-500 text-sm transition">
                                                Edit
                                            </button>
                                            <button className="bg-red-400 text-white rounded-xl px-4 py-1 hover:bg-red-500 text-sm transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Nested Entries (from API) */}
                                    <AnimatePresence>
                                        {expandedSubject === i.subj && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-4 space-y-3"
                                            >
                                                {entries.length > 0 ? (
                                                    entries.map((entry) => (
                                                        <div
                                                            key={entry._id}
                                                            className="flex flex-col gap-2 bg-zinc-100 px-4 py-3 rounded-lg shadow-sm"
                                                        >
                                                            <div className="flex justify-between items-center cursor-pointer"
                                                                onClick={() => handleSubdataFetch(entry._id)}
                                                            >
                                                                <span className="text-gray-700 font-medium">{entry.type}</span>
                                                                <div className="flex gap-2">
                                                                    <button className="bg-green-300 rounded-xl px-3 py-1 hover:bg-green-400 text-sm transition">
                                                                        Edit
                                                                    </button>
                                                                    <button className="bg-red-300 rounded-xl px-3 py-1 hover:bg-red-400 text-sm transition">
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Subdata Section */}
                                                            <AnimatePresence>
                                                                {expandedEntryId === entry._id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: "auto" }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="ml-4 space-y-2"
                                                                    >
                                                                        {subDataMap.length > 0 ? (
                                                                            subDataMap.map((sub) => {
                                                                                const isArray = sub.datatype === "array";
                                                                                const isSubExpanded = expandedSubId === sub._id;

                                                                                return (
                                                                                    <div
                                                                                        key={sub._id}
                                                                                        className="flex flex-col gap-1 bg-white px-3 py-2 rounded-md border border-gray-200"
                                                                                    >
                                                                                        <div
                                                                                            className="flex justify-between items-center cursor-pointer"
                                                                                            onClick={() =>
                                                                                                isArray &&
                                                                                                (isSubExpanded
                                                                                                    ? setExpandedSubId(null)
                                                                                                    : (() => {
                                                                                                        GetResourceItems({ subDataId: sub._id, setResourceItems });
                                                                                                        setExpandedSubId(sub._id);
                                                                                                    })())
                                                                                            }
                                                                                        >
                                                                                            <span className="text-sm text-gray-600">
                                                                                                {isArray ? `V ${sub.name}` : sub.name}
                                                                                            </span>
                                                                                            <div className="flex gap-2">
                                                                                                <button className="bg-green-200 rounded px-2 py-1 text-xs hover:bg-green-300">
                                                                                                    Edit
                                                                                                </button>
                                                                                                <button className="bg-red-200 rounded px-2 py-1 text-xs hover:bg-red-300">
                                                                                                    Delete
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Subdata Array Dropdown */}
                                                                                        <AnimatePresence>
                                                                                            {isArray && isSubExpanded && (
                                                                                                <motion.div
                                                                                                    initial={{ opacity: 0, height: 0 }}
                                                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                                                    exit={{ opacity: 0, height: 0 }}
                                                                                                    transition={{ duration: 0.3 }}
                                                                                                    className="mt-2 bg-zinc-100 rounded p-2 text-sm text-gray-600"
                                                                                                >
                                                                                                    {ResourceItems.length > 0 ? (
                                                                                                        <ul className="space-y-1">
                                                                                                            {ResourceItems.map((item) => (
                                                                                                                <li
                                                                                                                    key={item._id}
                                                                                                                    className="flex justify-between items-center bg-white rounded px-2 py-1 border text-gray-700"
                                                                                                                >
                                                                                                                    <div className="flex flex-col">
                                                                                                                        <span>{item.name}</span>
                                                                                                                        <span className="text-xs text-gray-500">
                                                                                                                            {item.type.toUpperCase()}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                    <div className="flex gap-2">
                                                                                                                        <button className="bg-green-200 rounded px-2 py-1 text-xs hover:bg-green-300">
                                                                                                                            Edit
                                                                                                                        </button>
                                                                                                                        <button className="bg-red-200 rounded px-2 py-1 text-xs hover:bg-red-300">
                                                                                                                            Delete
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                </li>
                                                                                                            ))}
                                                                                                        </ul>
                                                                                                    ) : (
                                                                                                        <div className="italic text-gray-400">No items found.</div>
                                                                                                    )}
                                                                                                </motion.div>
                                                                                            )}
                                                                                        </AnimatePresence>


                                                                                    </div>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <div className="text-sm italic text-gray-500">
                                                                                No subdata found.
                                                                            </div>
                                                                        )}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm italic text-gray-500">No entries found.</div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>

            <div className="footer_container p-4">
                <Footer admin={true} onlyLast={true} />
            </div>
        </>
    );
};

export default AdminResources;
