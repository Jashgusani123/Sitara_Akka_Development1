import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { createSubData } from "../../APIs/PostAPIs";
import { useDispatch } from "react-redux";

export const SubDataUploadDialog = ({
  resourceDataEntryId,
  onClose,
}: {
  resourceDataEntryId: string;
  onClose: () => void; 
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
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Sub Data</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            label="Datatype"
            select
            value={datatype}
            onChange={(e) => setDatatype(e.target.value)}
            fullWidth
            required
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
          />

          {datatype === "file" && (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || undefined)}
              required
            />
          )}

          {datatype === "link" && (
            <TextField
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              fullWidth
              required
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Uploading..." : "Add Subdata"}
          </Button>
        </DialogActions>

        <p className="text-center text-sm text-red-600 mt-2">{message}</p>
      </form>
    </Dialog>
  );
};
