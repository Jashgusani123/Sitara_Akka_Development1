import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { createResourceDataEntry } from "../../APIs/PostAPIs";
import { useDispatch } from "react-redux";

export const ResourceDataEntryDialog = ({
  resourceId,
  onClose,
}: {
  resourceId: string;
  onClose: () => void;
}) => {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createResourceDataEntry({ type, resourceId, setMessage, dispatch });
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Resource Data Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
        <p className="px-4 pb-4 text-sm text-red-600">{message}</p>
      </form>
    </Dialog>
  );
};
