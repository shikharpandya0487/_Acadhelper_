import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store"; 

const LoginModal = ({ open, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const { user, setUser, url } = useStore();
  const [authType, setAuthType] = useState("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email) => emailRegex.test(email);

  const handleAuthTypeChange = (newAuthType) => {
    if (newAuthType) {
      setAuthType(newAuthType);
      setEmailError(null);
      toast.info("Authentication type changed");
    }
  };

  const handleSave = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format!");
      return;
    }
    setEmailError(null);

    if (authType === "login") {
      try {
        const response = await axios.post(`${url}/api/auth/login`, {
          email,
          password,
        });
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Logged in successfully!");
        navigate("/Leaderboard");
        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error while logging in.");
      }
    } else {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      try {
        const response = await axios.post(`${url}/api/auth/signup`, {
          username,
          email,
          password,
        });
        const userData = response.data;
        setUser(userData);
        toast.success("Signed up successfully!");
        localStorage.setItem("user", JSON.stringify(userData.savedUser));
        navigate("/Leaderboard");
        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error while signing up.");
      }
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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          px={2}
        >
          <Typography variant="h6" fontSize="2rem">
            {authType === "login" ? "Login" : "Sign Up"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <ToggleButtonGroup
          value={authType}
          exclusive
          onChange={handleAuthTypeChange}
          sx={{ marginBottom: 2 }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="signup">Sign Up</ToggleButton>
        </ToggleButtonGroup>

        {authType === "signup" && (
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />

        {authType === "signup" && (
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
          />
        )}

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleSave}
        >
          {authType === "login" ? "Login" : "Sign Up"}
        </Button>

        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          marginTop={2}
        >
          <Button variant="outlined" startIcon={<GoogleIcon />}>
            Google
          </Button>
          <Button variant="outlined" startIcon={<GitHubIcon />}>
            GitHub
          </Button>
          <Button variant="outlined" startIcon={<InstagramIcon />}>
            Instagram
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
