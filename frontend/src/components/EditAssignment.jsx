import * as React from "react";
import { Box, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';

export default function EditAssignmentModal({
  open,
  handleClose,
  assignmentData,
  // onSave,
}) {
  const [dueDate, setDueDate] = React.useState(assignmentData.dueDate || null);
  const [fileName, setFileName] = React.useState(assignmentData.fileName || "");
  const [points, setPoints] = React.useState(assignmentData.points || 0);
  const [file, setFile] = React.useState(null);
  const [status, setStatus] = React.useState(assignmentData.status || "Open");

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-assignment-modal">
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="edit-assignment-modal" variant="h6" component="h2">
            Edit Assignment
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Due Date Selector */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newDate) => setDueDate(newDate)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>

        {/* File Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Name of the File"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        {/* Completion Points */}
        <TextField
          fullWidth
          margin="normal"
          label="Completion Points"
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />

        {/* File Upload */}
        <TextField
          fullWidth
          margin="normal"
          type="file"
          onChange={handleFileUpload}
        />

        {/* Status Selector */}
        <FormControl fullWidth margin="normal" display="flex" flexDirection="column" gap="2">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Graded">Graded</MenuItem>
          </Select>
        </FormControl>

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          // onClick={() => onSave({ dueDate, fileName, points, file, status })}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}
