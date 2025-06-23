import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Box
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createResourceItem, EditResource } from "../../APIs/PostAPIs";
import { motion } from "framer-motion";
import { FaFileUpload } from "react-icons/fa";

interface Props {
  subDataId: string;
  onClose: () => void;
  id?: string;
  handleEditRequest?: boolean;
}

const CreateResourceItemForm = ({ subDataId, onClose, id, handleEditRequest }: Props) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState<"file" | "link">("file");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (handleEditRequest && id) {
      const res = await EditResource({
        id,
        at: 'resource-items',
        data: { name, type, subDataId, link, icon },
        key: subDataId,
        dispatch,
        setMessage
      });
      if (res) {
        setName("");
        setType("file");
        setMessage("");
        setLoading(false);
        setFile(null);
        setIcon("");
        setLink("");
        onClose();
      }
      setName("");
      setType("file");
      setLoading(false);
      setFile(null);
      setIcon("");
      setLink("");
      return;
    }
    if (subDataId) {
      const result = await createResourceItem({
        name,
        icon,
        type,
        subDataId,
        file: file || undefined,
        link: link || undefined,
        setMessage,
        dispatch,
      });
      if (result) {
        setMessage(" Resource Item created!");
        setName("");
        setIcon("");
        setLink("");
        setFile(null);
        onClose();
      }
    } else {
      setMessage("Refresh the page and Try again...")
    }
    setLoading(false);
  };

  return (
    <Dialog open onClose={onClose} fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: "100%",
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -30 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{ backgroundColor: "#0E6BB0", color: "white", fontWeight: "bold" }}
          >
            {handleEditRequest ? "Edit Resource Item" : "Create Resource Item"}
          </DialogTitle>

          <DialogContent sx={{ backgroundColor: "#F9FAFB", display: "flex", justifyContent: "center", margin: "20px" }} style={{ padding: "10px" }}>
            <Box display="flex" flexDirection="column" width={"100%"} gap={2}>
              <TextField
                label="Name"
                fullWidth
                required
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  }
                }}
              />
              <TextField
                label="Icon"
                fullWidth
                required
                variant="outlined"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  }
                }}
              />
              <TextField
                label="Type"
                select
                fullWidth
                variant="outlined"
                value={type}
                onChange={(e) => setType(e.target.value as "file" | "link")}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  }
                }}
              >
                <MenuItem value="file">File</MenuItem>
                <MenuItem value="link">Link</MenuItem>
              </TextField>

              {type === "file" ? (
                <>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<FaFileUpload />}
                    sx={{
                      color: "#0E6BB0",
                      borderColor: "#0E6BB0",
                      borderRadius: 2,
                      fontWeight: "bold",
                      '&:hover': { backgroundColor: "#e6f0fa", borderColor: "#0E6BB0" }
                    }}
                  >
                    {file ? "Change File" : "Upload File"}
                    <input
                      hidden
                      type="file"
                      accept="*/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </Button>
                  {file && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Uploaded: <strong>{file.name}</strong>
                    </Typography>
                  )}
                </>
              ) : (
                <TextField
                  label="Link"
                  fullWidth
                  required
                  variant="outlined"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: "#0E6BB0" },
                      '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                    }
                  }}
                />
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#F9FAFB" }}>
            <Button
              onClick={onClose}
              sx={{
                color: "#0E6BB0",
                borderRadius: 2,
                fontWeight: "bold",
                '&:hover': { backgroundColor: "#e6f0fa" }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#FAC54D",
                color: "#000",
                fontWeight: "bold",
                borderRadius: 2,
                '&:hover': { backgroundColor: "#fcd45d" }
              }}
            >
              {loading ? "Saving..." : handleEditRequest ? "Update" : "Create"}
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

export default CreateResourceItemForm;
