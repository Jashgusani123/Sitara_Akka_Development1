import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CreateResource, EditResource } from "../../APIs/PostAPIs";
import { motion } from "framer-motion";

const CreateResourceDialog = ({
  resourceId,
  handleEditRequest,
  onClose,
  open, // ✅ Passed from parent
}: {
  onClose: () => void;
  open: boolean;
  handleEditRequest?: boolean;
  resourceId?: string;
}) => {
  const [languageDialog, setLanguageDialog] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let trimmedLang = languageDialog.trim();
    const trimmedClass = className.trim();
    let trimmedSubj = subject.trim();

    const validLanguage = /^[A-Za-z0-9\s\+\-]+$/; 

    const validSubject = /^[A-Za-z0-9\s\+\-]+$/; 

    if (!trimmedLang || trimmedLang.length < 2 || !validLanguage.test(trimmedLang)) {
      setMessage("Please enter a valid language name (letters, numbers, spaces allowed)");
      return;
    }

    if (!trimmedClass) {
      setMessage("Class field cannot be empty");
      return;
    }

    if (!trimmedSubj || trimmedSubj.length < 2 || !validSubject.test(trimmedSubj)) {
      setMessage("Please enter a valid subject name (letters, spaces or hyphens only)");
      return;
    }

    if (!handleEditRequest) {
      trimmedLang = trimmedLang.charAt(0).toUpperCase() + trimmedLang.slice(1).toLowerCase();
      trimmedSubj = trimmedSubj.charAt(0).toUpperCase() + trimmedSubj.slice(1).toLowerCase();
    }

    if (handleEditRequest && resourceId) {
      const res = await EditResource({
        id: resourceId,
        at: "resources",
        data: { lan: trimmedLang, class: trimmedClass, subj: trimmedSubj },
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
            <Box display="flex" flexDirection="column" gap={2} width="100%">
              <TextField
                label="Language"
                value={languageDialog}
                onChange={(e) => setLanguageDialog(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#0E6BB0" },
                    "&.Mui-focused fieldset": { borderColor: "#0E6BB0" },
                  },
                }}
              />
              <TextField
                label="Class"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#0E6BB0" },
                    "&.Mui-focused fieldset": { borderColor: "#0E6BB0" },
                  },
                }}
              />
              <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#0E6BB0" },
                    "&.Mui-focused fieldset": { borderColor: "#0E6BB0" },
                  },
                }}
              />
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
