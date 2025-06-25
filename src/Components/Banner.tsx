import { motion } from "motion/react";
import Logo from '../assets/Logo.png';
import Image2 from '../assets/Image2.png';
const Banner = () => {
    return (
        <> 
        <div className="w-full flex justify-center">
            <motion.div
                initial={{ opacity: 0, filter: "blur(3px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="banner_container bg-yellow-100 border-1 border-yellow-300 rounded-4xl p-4 w-screen md:w-[40rem] lg:w-[80rem] flex-wrap flex items-center justify-center"
            >
                <motion.div
                    initial={{ x: -200, rotate: -10, opacity: 0 }}
                    animate={{ x: 0, rotate: 0, opacity: 1 }}
                    exit={{ x: -200, rotate: -10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-md p-4 bg-blue-50 border-1 border-yellow-300 rounded-2xl lg:w-[43rem]"
                >
                    <div className="heading w-full flex items-center">
                        <div className="logo w-fit">
                            <img src={Logo} alt="Logo Not found" className="h-20 w-20" />
                        </div>
                        <div className="text flex  w-full items-start gap-1.5">
                            <p className="fontfirst text-4xl">Sitara</p>
                            <p className="fontsecond text-5xl">Akka</p>
                        </div>
                    </div>
                    <div className="description">
                        <p className="">&nbsp;&nbsp;&nbsp;&nbsp;Learn with fun! Get notes, videos,  and chat with your Anna/Akka anytime. Everything you need to study, in one happy place. 😊📚</p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ x: 200, rotate: 10, opacity: 0 }}
                    animate={{ x: 0, rotate: 0, opacity: 1 }}
                    exit={{ x: 200, rotate: 10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-md p-4 flex items-center justify-center"
                >
                    <img src={Image2} alt="" className="rounded-2xl border-3 border-blue-900  w-96" />
                </motion.div>
            </motion.div>
        </div>
        </>
    )
}

export default Banner