import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const Footer = ({admin , onlyLast}:{admin?:boolean , onlyLast?:boolean}) => {
    const navigate = useNavigate();
    const handleWhatsappChat = ()=>{};
    const handleResorcesShow = ()=>{
        if(admin){
            navigate("/admin/resources")
        }else{
            navigate("/resources")
        }
    };
    return (
        <>
            {!onlyLast && <motion.div
                initial={{ x: -200, rotate: -10, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                exit={{ x: -200, rotate: -10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full p-4 flex justify-around"
            >
                <button className="bg-[#FAC54D] rounded-2xl lg:text-3xl text-2xl cursor-pointer p-2 w-fit hover:scale-105 transition-transform duration-200" onClick={handleResorcesShow}>
                    To Access Resources Click Here ,<span className="text-[#0E6BB0]">Let's Go</span>
                </button>
            </motion.div>}
            <motion.div
                initial={{ x: 200, rotate: 10, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                exit={{ x: 200, rotate: 10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full flex justify-around "
            >
                <button className="bg-[#0E6BB0] rounded-2xl lg:text-3xl text-2xl cursor-pointer p-2 w-fit hover:scale-105 transition-transform duration-200" onClick={handleWhatsappChat}>
                    To Speak with your Anna / Akka, Click Here ,<span className="text-[#FAC54D]">Whatsapp</span>
                </button>
            </motion.div>
        </>
    )
}

export default Footer