import { useState } from 'react';
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';

const ResourcesHeading = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = window.location.pathname;
    const handleBackClick = ()=>{
        const isAdmin = location.split("/")[1]==="admin";
        if(isAdmin){
            navigate("/admin/dashbord");
        }else{
            navigate("/")
        }
    }
    return (
        <div className="w-full flex justify-between p-4 gap-4 items-center">
            <div className="left_options bg-[#FAC54D] cursor-pointer rounded-2xl p-4 hover:bg-[#0E6BB0] transition-colors duration-300 ease-in-out" onClick={handleBackClick}>
                <SlArrowLeft className="w-6 h-6 " />
            </div>
            <div className="right_options">
                <input
                    type="text"
                    placeholder="Search Here..."
                    className="rounded-2xl bg-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="rounded-2xl bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition">
                    Search
                </button>
            </div>

        </div>
    );
};

export default ResourcesHeading;
