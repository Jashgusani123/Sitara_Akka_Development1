import { motion } from "motion/react";
// import Logo from '../assets/Logo.png';
import youtube from '../assets/youtube.png';
import chapterNotes from '../assets/notes.avif';
import formula from '../assets/formula.jpg';
import test from '../assets/test.png';
import passingPackage from '../assets/passingPackage.png';
import { useNavigate } from "react-router-dom";
const Banner = () => {
    const navigate = useNavigate();
    const options = [{
        src: youtube,
        name: "Youtube",
    },
    {
        src: test,
        name: "Previous Year Question paper",
    },
    {
        src: chapterNotes,
        name: "Chapter Notes",
    },
    {
        src: formula,
        name: "Formula",
    },
    {
        src: passingPackage,
        name: "Passing Package",
    }
    ]
    const handleResorcesShow = () => {
      navigate("/language");
  };
    return (
        <>
        <motion.div
          initial={{ x: -200, rotate: -10, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          exit={{ x: -200, rotate: -10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full p-4 flex justify-around"
        >
          <button
            className="bg-[#1c1c51] text-white rounded-2xl lg:text-3xl text-2xl cursor-pointer p-2 w-fit hover:scale-105 transition-transform duration-200"
            onClick={handleResorcesShow}
          >
            Click here to access all 10th standard study material
          </button>
        </motion.div>
            <div className="w-full flex justify-center">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(3px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="p-4 w-screen md:w-[40rem] lg:w-[80rem]"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center items-center">
                        {options.map((option, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="flex flex-col items-center justify-center text-center"
                            >
                                <img
                                    src={option.src}
                                    alt={option.name}
                                    className="w-32 h-32 object-contain bg-zinc-200 p-2 rounded-lg shadow-md"
                                />
                                <p className="mt-2 text-sm font-medium">{option.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

        </>
    )
}

export default Banner