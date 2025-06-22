import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { SlArrowLeft } from "react-icons/sl";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../Redux/Store';
import { setResources } from '../Redux/Slices/resourcesSlice';

const ResourcesHeading = () => {
    const [search, setSearch] = useState("");
    const [originalResources, setOriginalResources] = useState<any[]>([]);
    const navigate = useNavigate();
    const location = window.location.pathname;
    const dispatch = useDispatch();
    const resources = useSelector((state: RootState) => state.resources.resources);

    const handleBackClick = () => {
        const isAdmin = location.split("/")[1] === "admin";
        if (isAdmin) {
            navigate("/admin/dashbord");
        } else {
            navigate("/");
        }
    };

    const handleSearch = useCallback(
        debounce((value: string) => {
            if (value.trim() === "") {
                dispatch(setResources(originalResources.length ? originalResources : resources)); // restore original
                return;
            }

            const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "");

            const filteredResources = (originalResources.length ? originalResources : resources).filter(r =>
                normalize(r.lan).includes(normalize(value)) ||
                normalize(r.subj).includes(normalize(value)) ||
                normalize(r.class).includes(normalize(value))
            );


            dispatch(setResources(filteredResources));
        }, 300),
        [resources, originalResources, dispatch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (!search && resources.length) {
            setOriginalResources(resources);
        }

        handleSearch(value);
    };

    const handleClear = () => {
        setSearch("");
        dispatch(setResources(originalResources.length ? originalResources : resources));
    };

    return (
        <div className="w-full flex justify-between p-4 gap-4 items-center">
            <div
                className="left_options bg-[#FAC54D] cursor-pointer rounded-2xl p-4 hover:bg-[#0E6BB0] transition-colors duration-300 ease-in-out"
                onClick={handleBackClick}
            >
                <SlArrowLeft className="w-6 h-6" />
            </div>

            <div className="right_options flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Search Here..."
                    className="rounded-2xl bg-blue-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={search}
                    onChange={handleChange}
                />


                <button
                    onClick={handleClear}
                    className="text-xl text-blue-700 cursor-pointer bg-amber-200 px-3 py-1 rounded hover:bg-gray-100 transition"
                    disabled={!search}
                >
                    Clear
                </button>

            </div>
        </div>
    );
};

export default ResourcesHeading;
