import { motion } from "motion/react";

const Footer = () => {
    const handleWhatsappChat = ()=>{};
    const handleResorcesShow = ()=>{};
    return (
        <>
            <motion.div
                initial={{ x: -200, rotate: -10, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                exit={{ x: -200, rotate: -10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full p-4 flex justify-around"
            >
                <button className="bg-[#FAC54D] rounded-2xl text-3xl cursor-pointer p-2 w-fit hover:scale-105 transition-transform duration-200" onClick={handleResorcesShow}>
                    To Access Resources Click Here ,<span className="text-[#0E6BB0]">Let's Go</span>
                </button>
            </motion.div>
            <motion.div
                initial={{ x: 200, rotate: 10, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                exit={{ x: 200, rotate: 10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full flex justify-around "
            >
                <button className="bg-[#0E6BB0] rounded-2xl text-3xl cursor-pointer p-2 w-fit hover:scale-105 transition-transform duration-200" onClick={handleWhatsappChat}>
                    To Speak with your Anna / Akka, Click Here ,<span className="text-[#FAC54D]">Whatsapp</span>
                </button>
            </motion.div>
        </>
    )
}

export default Footer