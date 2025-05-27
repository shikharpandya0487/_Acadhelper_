import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
// import { institutes } from "./SampleData/Sample.js";

const SignupModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [institute, setInstitute] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, setUser, url } = useStore();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateUsername = (username) =>
    /^[a-zA-Z0-9_]{3,15}$/.test(username);

  const handleSignup = async () => {
    setLoading(true);
    try {
      if (!validateEmail(email)) return toast.error("Invalid email.");
      if (!validateUsername(username)) return toast.error("Invalid username.");
      if (!validatePassword(password))
        return toast.error("Password must be 8+ chars, contain letters, numbers & special chars.");
      if (!institute) return toast.error("Select an institute.");

      const response = await axios.post(`${url}/api/auth/signup`, {
        email,
        password,
        username,
        institute,
      });

      if (response.status === 200) {
        setUser(response.data.savedUser);
        toast.success("Check your email to verify your account.");
        handleClose();
      } else {
        toast.error("Signup failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Signup error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${url}/api/user?Id=${user._id}`);
        if (res.data.data.isEmailVerified) navigate("/Dashboard");
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, [user, navigate]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Sign Up
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email && !validateEmail(email)}
          helperText={email && !validateEmail(email) ? "Enter a valid email" : ""}
        />

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={username && !validateUsername(username)}
          helperText={
            username && !validateUsername(username)
              ? "3-15 characters, letters, numbers, or _"
              : ""
          }
        />
{/* 
        <FormControl fullWidth margin="normal">
          <InputLabel>Institute</InputLabel>
          <Select
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            label="Institute"
          >
            {institutes.map((uni, i) => (
              <MenuItem key={i} value={uni}>
                {uni}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password && !validatePassword(password)}
          helperText={
            password && !validatePassword(password)
              ? "Min 8 chars, 1 letter, 1 number, 1 special"
              : ""
          }
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, height: 45 }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>

        <Typography textAlign="center" mt={2}>
          Already have an account?{" "}
          <Link to="/Login" style={{ color: "#1976d2" }}>
            Login
          </Link>
        </Typography>

        <Toaster position="top-right" />
      </Box>
    </Modal>
  );
};

export default SignupModal;
