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
}: {
  onClose: () => void;
  handleEditRequest?: boolean;
  resourceId?: string;
}) => {
  const [open, setOpen] = useState(true);
  const [languageDialog, setLanguageDialog] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let trimmedLang = languageDialog.trim();
    const trimmedClass = className.trim();
    let trimmedSubj = subject.trim();

    const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;
    const validSubject = /^[A-Za-z\s\-]+$/;
    const validClass = /^[0-9]{1,2}(th|st|nd|rd)?$/i;

    // Validations
    if (!trimmedLang || trimmedLang.length < 2 || !onlyLettersAndSpaces.test(trimmedLang)) {
      setMessage("Please enter a valid language name (letters only, min 2 characters)");
      return;
    }

    if (!trimmedClass || !validClass.test(trimmedClass)) {
      setMessage("Please enter a valid class (e.g., 10, 12th)");
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
      await EditResource({
        id: resourceId,
        at: "resources",
        data: { lan: trimmedLang, class: trimmedClass, subj: trimmedSubj },
        dispatch,
      });
      onClose();
      return;
    }

    await CreateResource({
      lan: trimmedLang,
      className: trimmedClass,
      subj: trimmedSubj,
      dispatch,
      setMessage,
    });

    onClose();
  };



  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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

          <DialogContent sx={{ backgroundColor: "#F9FAFB", display: "flex", justifyContent: "center", margin: "20px" }} style={{ padding: "10px" }}>
            <Box display="flex" flexDirection="column" gap={2} width={"100%"}>
              <TextField
                label="Language"
                value={languageDialog}
                onChange={(e) => setLanguageDialog(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
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
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
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
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ backgroundColor: "#F9FAFB", px: 3, py: 2 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: "#0E6BB0",
                borderRadius: 2,
                fontWeight: "bold",
                '&:hover': { backgroundColor: "#e6f0fa" },
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
                '&:hover': { backgroundColor: "#fcd45d" },
              }}
            >
              {handleEditRequest ? "Update" : "Create"}
            </Button>
          </DialogActions>

          {message && (
            <Typography
              className="px-4 pb-4"
              variant="body2"
              sx={{ color: "green", fontWeight: 500 }}
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
