import { useDispatch, useSelector } from 'react-redux';
import Header from '../Components/Header';
import { motion } from 'framer-motion';
import { setGottedLanguages, setLanguage } from '../Redux/Slices/languageSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { GetLanguages } from '../APIs/GetAPIs';
import type { RootState } from '../Redux/Store';

const LanguageSelect = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const lang = useSelector((state:RootState)=>state.language.gottedLanguages)

    useEffect(() => {
        const fetchLang = async () => {
            await GetLanguages({ dispatch });
        }

        fetchLang()
    }, [])

    const handleLanguageSelect = (languageName: string) => {
        dispatch(setLanguage(languageName));
        dispatch(setGottedLanguages([languageName]));
        navigate("/resources");
    };

    return (
        <>
            <Header />
            <div className="lang_main_container flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(3px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="language-select-container lg:w-full flex justify-center items-center flex-col"
                >
                    <p className='font-bold lg:text-6xl text-center'>Which medium are you studying in?</p>
                    <ul className='flex flex-col gap-4 mt-4 w-full lg:w-sm md:w-3/4'>
                        {lang.map((language, index) => (
                            <li
                                key={index}
                                onClick={() => handleLanguageSelect(language)}
                                className='bg-[#fec21a] rounded-2xl text-3xl h-10 w-full p-2 flex justify-center items-center hover:scale-105 transition-transform duration-200 cursor-pointer'
                            >
                                {language}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </>
    );
};

export default LanguageSelect;
