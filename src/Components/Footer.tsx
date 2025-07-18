import { motion } from "framer-motion";
import whatsappIcon from "./../assets/whatsappIcon.webp";

const Footer = ({ onlyLast }: { onlyLast?: boolean }) => {

  const handleWhatsappChat = () => {
    window.open("https://wa.me/91XXXXXXXXXX", "_blank");
  };

  return (
    <>
      {onlyLast && (
        <motion.div
          initial={{ x: 200, rotate: 10, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          exit={{ x: 200, rotate: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed bottom-4  right-4 z-50"
        >
          <button
            onClick={handleWhatsappChat}
            className="group flex items-center h-[60px] bg-[#1c1c51] text-white rounded-full px-2 py-2 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden max-w-[90vw] sm:max-w-full"
          >
            <img src={whatsappIcon} alt="whatsapp Icon" className="ml-2 w-14 h-14" />
            <span
              className="ml-2 text-lg text-[#FAC54D] whitespace-normal opacity-0 max-w-0 group-hover:max-w-[300px] sm:group-hover:max-w-[900px] group-hover:opacity-100 transition-all duration-300 ease-in-out"
            >
              Got a Math or Science Doubt? Don’t Stay Stuck — Message Us Anytime! Click here to chat with your akka/anna
            </span>
          </button>
        </motion.div>
      )}
    </>
  );
};

export default Footer;
