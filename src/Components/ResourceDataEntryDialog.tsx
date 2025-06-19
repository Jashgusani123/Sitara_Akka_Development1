import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { createResourceDataEntry } from "../APIs/PostAPIs";
import { useDispatch } from "react-redux";

export const ResourceDataEntryDialog = ({ resourceId, onNext }:{resourceId:string , onNext:(data: any) => void}) => {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await createResourceDataEntry({ type, resourceId, setMessage , dispatch});
      if (res) {
        onNext(res); // move to next step with the returned ID
      }
    };
  
    return (
      <Dialog open>
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
            <Button type="submit" variant="contained">Next</Button>
          </DialogActions>
          <p>{message}</p>
        </form>
      </Dialog>
    );
  };
  