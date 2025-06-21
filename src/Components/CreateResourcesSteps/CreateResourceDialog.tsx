import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CreateResource } from "../../APIs/PostAPIs";

const CreateResourceDialog = ({ onClose}:{ onClose: () => void;}) => {
  const [open, setOpen] = useState(true);
  const [languageDialog, setLanguageDialog] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await CreateResource({ lan: languageDialog, className, subj: subject, dispatch, setMessage })
    onClose()
  };

  return (
    <>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"

      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="responsive-dialog-title">Create Resource</DialogTitle>
          <DialogContent className="flex flex-col gap-4 mt-2">
            <TextField
              label="Language"
              value={languageDialog}
              onChange={(e) => setLanguageDialog(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
        <p>{message}</p>
      </Dialog>
    </>
  );
};

export default CreateResourceDialog;
