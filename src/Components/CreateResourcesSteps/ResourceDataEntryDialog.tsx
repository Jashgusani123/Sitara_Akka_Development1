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
import { createResourceDataEntry, EditResource } from "../../APIs/PostAPIs";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

export const ResourceDataEntryDialog = ({
  resourceId,
  onClose,
  handleEditRequest,
  entryId,
}: {
  resourceId: string;
  onClose: () => void;
  handleEditRequest?: boolean;
  entryId?: string;
}) => {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (handleEditRequest && entryId) {
    const res = await EditResource({
        id: entryId,
        at: "resource-data-entries",
        data: { type, resourceId },
        dispatch,
        key: resourceId,
        setMessage
      });
      if(res){
        onClose();
      }
      return;
    }
    if(resourceId && type){
     const res = await createResourceDataEntry({ type, resourceId, setMessage, dispatch });
     if(res){
      onClose();
     }
    }else if(!type){
      setMessage("❌ Please Fill the type...")
    }else {
      setMessage("Refresh the Page and Try again ...")
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
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
            {handleEditRequest ? "Edit Resource Entry" : "Create Resource Data Entry"}
          </DialogTitle>

          <DialogContent sx={{ backgroundColor: "#F9FAFB",display:"flex" , justifyContent:"center" ,margin:"20px" }} style={{padding:"10px"}}>
            <Box display="flex" flexDirection="column" width={"100%"} gap={2}>
              <TextField
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: "#0E6BB0" },
                    '&.Mui-focused fieldset': { borderColor: "#0E6BB0" },
                  }
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
                '&:hover': { backgroundColor: "#e6f0fa" }
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
                '&:hover': { backgroundColor: "#fcd45d" }
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
