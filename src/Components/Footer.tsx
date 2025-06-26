import { motion } from "framer-motion";
import { MdWhatsapp } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Footer = ({ onlyLast }: {  onlyLast?: boolean }) => {
  const navigate = useNavigate();

  const handleWhatsappChat = () => {
    window.open("https://wa.me/91XXXXXXXXXX", "_blank");
  };

  const handleResorcesShow = () => {
      navigate("/resources");
  };

  return (
    <>
      {!onlyLast && (
        <motion.div
          initial={{ x: -200, rotate: -10, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          exit={{ x: -200, rotate: -10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full p-4 flex justify-around"
        >
          <button
            className="bg-[#FAC54D] rounded-2xl lg:text-3xl text-2xl cursor-pointer p-2 w-fit hover:scale-105 transition-transform duration-200"
            onClick={handleResorcesShow}
          >
            To Access Resources Click Here ,<span className="text-[#0E6BB0]">Let's Go</span>
          </button>
        </motion.div>
      )}

      {/* Bottom Right Floating WhatsApp Button */}
      <motion.div
        initial={{ x: 200, rotate: 10, opacity: 0 }}
        animate={{ x: 0, rotate: 0, opacity: 1 }}
        exit={{ x: 200, rotate: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={handleWhatsappChat}
          className="group flex items-center bg-[#0E6BB0] text-white rounded-full px-4 py-2 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <MdWhatsapp className="text-4xl" />
          <span
            className="max-w-0 opacity-0 group-hover:max-w-[250px] group-hover:opacity-100 transition-all duration-300 ease-in-out text-lg text-[#FAC54D] whitespace-nowrap"
          >
            &nbsp; Speak with your Anna / Akka
          </span>
        </button>
      </motion.div>
    </>
  );
};

export default Footer;
