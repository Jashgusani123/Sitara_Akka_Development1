import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateResource, EditResource } from "../../APIs/PostAPIs";
import type { RootState } from "../../Redux/Store";

const CreateResourceDialog = ({
  resourceId,
  handleEditRequest,
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
  handleEditRequest?: boolean;
  resourceId?: string;
}) => {
  const dispatch = useDispatch();

  const [languageDialog, setLanguageDialog] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState<string>("");

  const languageList = useSelector(
    (state: RootState) => state.language.gottedLanguages
  );

  const classList = ["8", "9", "10", "11", "12"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let trimmedLang = languageDialog.trim();
    const trimmedClass = className.trim();
    let trimmedSubj = subject.trim();

    const validLanguage = /^[A-Za-z0-9\s\+\-]+$/;
    const validSubject = /^[A-Za-z0-9\s\+\-]+$/;

    if (
      !trimmedLang ||
      trimmedLang.length < 2 ||
      !validLanguage.test(trimmedLang)
    ) {
      setMessage("Please select or enter a valid language");
      return;
    }

    if (!trimmedClass) {
      setMessage("Please select a class");
      return;
    }

    if (
      !trimmedSubj ||
      trimmedSubj.length < 2 ||
      !validSubject.test(trimmedSubj)
    ) {
      setMessage("Please enter a valid subject name");
      return;
    }

    if (!handleEditRequest) {
      trimmedLang =
        trimmedLang.charAt(0).toUpperCase() +
        trimmedLang.slice(1).toLowerCase();
      trimmedSubj =
        trimmedSubj.charAt(0).toUpperCase() +
        trimmedSubj.slice(1).toLowerCase();
    }

    if (handleEditRequest && resourceId) {
      const res = await EditResource({
        id: resourceId,
        at: "resources",
        data: {
          lan: trimmedLang,
          class: trimmedClass,
          subj: trimmedSubj,
        },
        dispatch,
        setMessage,
      });
      if (res) onClose();
      return;
    }

    const res = await CreateResource({
      lan: trimmedLang,
      className: trimmedClass,
      subj: trimmedSubj,
      dispatch,
      setMessage,
    });

    if (res) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -30 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              backgroundColor: "#0E6BB0",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {handleEditRequest ? "Edit Resource" : "Create Resource"}
          </DialogTitle>

          <DialogContent
            sx={{
              backgroundColor: "#F9FAFB",
              display: "flex",
              justifyContent: "center",
              m: 2,
              p: 1,
            }}
            style={{ padding: "13px" }}
          >
            <Box display="flex" flexDirection="column" gap={1.5} width="100%">
              {/* Language Dropdown */}
              <Box>
                <label style={{ fontWeight: "500", display: "block" }}>
                  Language <span className="text-red-700">*</span>
                </label>
                <select
                  value={languageDialog}
                  onChange={(e) => setLanguageDialog(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Language
                  </option>
                  {languageList.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </Box>


              {/* Class Dropdown */}
              <Box>
                <label style={{ fontWeight: "500", marginBottom: "4px", display: "block" }}>
                  Class  <span className="text-red-700">*</span>
                </label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </Box>

              {/* Subject */}
              <Box>
                <label style={{ fontWeight: "500", marginBottom: "4px", display: "block" }}>
                  Subject  <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                />
              </Box>
            </Box>

          </DialogContent>

          <DialogActions sx={{ backgroundColor: "#F9FAFB", px: 3, py: 2 }}>
            <Button
              onClick={onClose}
              sx={{
                color: "#0E6BB0",
                borderRadius: 2,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#e6f0fa" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#FAC54D",
                color: "#000",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#fcd45d" },
              }}
            >
              {handleEditRequest ? "Update" : "Create"}
            </Button>
          </DialogActions>

          {message && (
            <Typography
              className="px-4 pb-4"
              variant="body2"
              sx={{ color: "red", fontWeight: 500 }}
            >
              {message}
            </Typography>
          )}
        </form>
      </motion.div>
    </Dialog>
  );
};

export default CreateResourceDialog;
