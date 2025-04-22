import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../store";

// MUI Components
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser ,url} = useStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/Dashboard");
    }
  }, [user, navigate]);

  // Validation function
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!validateEmail(email)) return toast.error("Invalid email.");
      if (!password) return toast.error("Enter your password.");

      const response = await axios.post(`${url}/api/auth/login`, { email, password });

      console.log(response);

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const u=response.data.user;
        u.token=response.data.token;
        setUser(response.data.user);
        navigate("/Dashboard");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <Box className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <Box sx={{ width: 400, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>Log In</Typography>

        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email && !validateEmail(email)}
          helperText={email && !validateEmail(email) ? "Enter a valid email" : ""}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2, height: 45 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>

        <Typography textAlign="center" mt={2}>
          Don't have an account? <Link to="/Signup" style={{ color: "#1976d2" }}>Sign up</Link>
        </Typography>
      </Box>
      <Toaster />
    </Box>
  );
};

export default LoginForm;
