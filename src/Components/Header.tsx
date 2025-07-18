// import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import Logo from '../assets/Logo.png';
// import { MdLogin, MdLogout } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { clearUser } from "../Redux/Slices/userSlice";
// import type { RootState } from "../Redux/Store";

const Header = () => {
  const [clickAble, setClickAble] = useState(false);
  // const user = useSelector((state: RootState) => state.user.user);
 
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const handleLogoOut = ()=>{
  //   dispatch(clearUser());
  //   localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN)
  // }

   useEffect(() => {
    setClickAble(location.pathname !== "/");
  }, [location.pathname]);
  return (
    <header className="home_navbar flex justify-center md:justify-between lg:justify-between gap-3 flex-wrap w-full p-4">
      <motion.div
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onClick={() => clickAble && navigate("/")}
        className={`welcome bg-[#e4f9ff] ${clickAble ? "cursor-pointer" : ""} shadow-md flex justify-center items-center w-full text-white p-2 rounded-2xl`}
      >
        <div className="heading w-full flex justify-center items-center">
          <div className="logo w-fit">
            <img src={Logo} alt="Logo Not found" className="h-10 w-10" />
          </div>
          <div className="text flex items-center gap-0.5">
            <p className="fontfirst text-2xl">Sitara</p>
            <p className="fontsecond text-4xl mt-1.5">Akka</p>
          </div>
        </div>
      </motion.div>



      <div className="div flex justify-between items-center ">

        {/* {user && <Tooltip title="Logout">

          <motion.div
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={handleLogoOut}
            className="welcome bg-[#FAC54D] flex justify-center  items-center w-fit h-fit text-black p-4 text-2xl rounded-2xl cursor-pointer"
          >
            <MdLogout></MdLogout>
          </motion.div>
        </Tooltip>}

        {!user &&  <Tooltip title="Login">

          <motion.div
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={()=>navigate("/login")}
            className="welcome bg-[#FAC54D] flex justify-center  items-center w-fit h-fit text-black p-4 text-2xl rounded-2xl cursor-pointer"
          >
            <MdLogin></MdLogin>
          </motion.div>
        </Tooltip>} */}
      </div>


    </header>

  );
};

export default Header;
