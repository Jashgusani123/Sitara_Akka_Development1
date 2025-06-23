import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { MdLogin, MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../Redux/Slices/userSlice";
import type { RootState } from "../Redux/Store";

const Header = ({ IsAdmin }: { IsAdmin?: boolean }) => {

  const user = useSelector((state: RootState) => state.user.user);
  const location = window.location.pathname;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoOut = ()=>{
    dispatch(clearUser());
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN)
  }
  return (
    <header className="home_navbar flex justify-center md:justify-between lg:justify-between gap-3 flex-wrap w-full p-4">
      <motion.div
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="welcome bg-[#0E6BB0] flex justify-center text-white p-4 text-2xl rounded-2xl"
        onClick={() => {
          const isAdmin = location.split("/")[1] === "admin";
          if (isAdmin) {
            navigate("/");
          } else if (!IsAdmin) {
            navigate("/")
          } else {
            navigate("/admin/dashbord");
          }
        }}
      >
        <p>Welcome</p>
      </motion.div>



      <div className="div flex justify-between items-center ">

        {user && <Tooltip title="Logout">

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
        </Tooltip>}
      </div>


    </header>

  );
};

export default Header;
