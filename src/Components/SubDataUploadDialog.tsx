import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem
  } from "@mui/material";
  import { useState } from "react";
  import { createSubData } from "../APIs/PostAPIs";
  import { useDispatch } from "react-redux";
  
  export const SubDataUploadDialog = ({
    resourceDataEntryId,
    onNext,
  }: {
    resourceDataEntryId: string;
    onNext: (data: any) => void;
  }) => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [name, setName] = useState("");
    const [datatype, setDatatype] = useState("file");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
  
    const dispatch = useDispatch();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (datatype === "file" && !file) {
        setMessage("Please upload a file.");
        return;
      }
  
      setLoading(true);
      const success = await createSubData({
        file ,
        name,
        datatype,
        resourceDataEntryId,
        setMessage,
        dispatch,
      });
  
      setLoading(false);
  
      if (success && onNext) {
        onNext(success);
      }
    };
  
    return (
      <Dialog open>
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
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Uploading..." : "Add Subdata"}
            </Button>
          </DialogActions>
          <p className="text-center text-sm text-red-600 mt-2">{message}</p>
        </form>
      </Dialog>
    );
  };
  