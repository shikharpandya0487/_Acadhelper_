import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Container,
  FormControl,
  FormGroup,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../store";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function KickUserModal({ open, setOpen, courseId }) {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { user,url } = useStore();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUserData(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${url}/api/user/find_user?username=${username}`,config);
      console.log(response);
      setUserData(response.data.user);
      setError(null);
      handleOpen();
    } catch (err) {
      setError("User not found");
      console.log(err);
      setUserData(null);
      handleOpen();
    }
  };
  console.log(username)

  const handleKickUser = async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user?.token}`, // Ensure token exists
            },
            data: {  // axios.delete expects data under 'data' field
                userId: userData?._id,
                courseId,
            },
        };

        console.log("Sending request:", config.data);

        const response = await axios.delete(`${url}/api/course/kick-user`, config);

        console.log("Response:", response.data);

        toast.success("User kicked successfully");

    } catch (error) {
        console.error("Error:", error);
        toast.error(error.response?.data?.message || "An error occurred");
    }
};

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              Search User to be Kicked Out
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl
            component="form"
            onSubmit={handleSubmit}
            sx={{ mb: 2, width: "100%" }}
          >
            <FormGroup>
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
              >
                Search
              </Button>
            </FormGroup>
          </FormControl>
          <Box sx={{ mt: 3 }}>
            {userData ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "start",
                  gap: 1,
                }}
              >
                <Typography variant="h6" component="h2">
                  User Details
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ mt: 2 }}>
                    <strong>Username:</strong>
                    <br />
                    {userData.username}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{
                      padding: "3px",
                      fontSize: "0.75rem",
                      minWidth: "auto",
                    }}
                    onClick={handleKickUser}
                  >
                    Kick User
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
      <Toaster />
    </>
  );
}

export default KickUserModal;
