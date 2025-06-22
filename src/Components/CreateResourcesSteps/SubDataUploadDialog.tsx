import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  Box
} from "@mui/material";
import { useState } from "react";
import { createSubData, EditResource } from "../../APIs/PostAPIs";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FaFileUpload } from "react-icons/fa";

export const SubDataUploadDialog = ({
  resourceDataEntryId,
  onClose,
  handleEditRequest,
  subId,
}: {
  resourceDataEntryId: string;
  onClose: () => void;
  handleEditRequest?: boolean;
  subId?: string;
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [name, setName] = useState("");
  const [datatype, setDatatype] = useState("file");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (datatype === "file" && !file) {
      setMessage("Please upload a file.");
      return;
    }

    if (datatype === "link" && !link.trim()) {
      setMessage("Please provide a valid link.");
      return;
    }

    setLoading(true);

    if (handleEditRequest && subId) {
      const res = await EditResource({
        id: subId,
        at: "subdata",
        data: { name, datatype, resourceDataEntryId, link },
        dispatch,
        key: resourceDataEntryId,
      });

      if (res === "Cannot update: linked ResourceItem still exists.") {
        alert(res);
      }

      onClose();
      return;
    }

    await createSubData({
      file: datatype === "file" ? file : undefined,
      name,
      datatype,
      link: datatype === "link" ? link : undefined,
      resourceDataEntryId,
      setMessage,
      dispatch,
    });

    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
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
            {handleEditRequest ? "Edit Sub Data" : "Add Sub Data"}
          </DialogTitle>

          <DialogContent sx={{ backgroundColor: "#F9FAFB",display:"flex" , justifyContent:"center" ,margin:"20px" }} style={{padding:"10px"}}>
            <Box display="flex" flexDirection="column" gap={2} width={"100%"}>
              <TextField
                label="Datatype"
                select
                variant="outlined"
                value={datatype}
                onChange={(e) => setDatatype(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  },
                }}
              >
                <MenuItem value="file">File</MenuItem>
                <MenuItem value="link">Link</MenuItem>
                <MenuItem value="array">Array</MenuItem>
              </TextField>


              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  },
                }}
              />

              {datatype === "file" && (
                <>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<FaFileUpload />}
                    sx={{
                      color: "#0E6BB0",
                      borderColor: "#0E6BB0",
                      fontWeight: "bold",
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: "#e6f0fa",
                        borderColor: "#0E6BB0",
                      },
                    }}
                  >
                    {file ? "Change File" : "Upload File"}
                    <input
                      hidden
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0])}
                    />
                  </Button>
                  {file && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Uploaded: <strong>{file.name}</strong>
                    </Typography>
                  )}
                </>
              )}

              {datatype === "link" && (
                <TextField
                  label="Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: "#0E6BB0" },
                      '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                    },
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
                fontWeight: "bold",
                borderRadius: 2,
                '&:hover': { backgroundColor: "#e6f0fa" },
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
                '&:hover': { backgroundColor: "#fcd45d" },
              }}
            >
              {loading ? "Saving..." : handleEditRequest ? "Update" : "Add Subdata"}
            </Button>
          </DialogActions>

          {message && (
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "red", mt: 1, fontWeight: 500 }}
            >
              {message}
            </Typography>
          )}
        </form>
      </motion.div>
    </Dialog>
  );
};
