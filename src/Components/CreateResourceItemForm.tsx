import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createResourceItem } from "../APIs/PostAPIs"; // adjust path as needed

const CreateResourceItemForm = ({ subDataId, onClose }: { subDataId: string; onClose: (data?: any) => void }) => {
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

    setLoading(false);

    if (result) {
      setMessage("✅ Resource Item created!");
      setName("");
      setIcon("");
      setLink("");
      setFile(null);
      if (onClose) onClose(result); // Optionally pass resourceItem
    }
  };

  return (
    <Dialog open onClose={() => onClose?.()}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Resource Item</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField label="Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Icon" fullWidth required value={icon} onChange={(e) => setIcon(e.target.value)} />
          <TextField
            label="Type"
            select
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value as "file" | "link")}
          >
            <MenuItem value="file">File</MenuItem>
            <MenuItem value="link">Link</MenuItem>
          </TextField>

          {type === "file" ? (
            <Button component="label" variant="outlined">
              Upload File
              <input hidden type="file" accept="*/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </Button>
          ) : (
            <TextField label="Link" fullWidth required value={link} onChange={(e) => setLink(e.target.value)} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose?.()}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
        <p className="px-4 pb-4 text-sm">{message}</p>
      </form>
    </Dialog>
  );
};

export default CreateResourceItemForm;
