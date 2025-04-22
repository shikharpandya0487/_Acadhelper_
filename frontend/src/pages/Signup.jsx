import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { institutes } from './SampleData/Sample.js';

// MUI Components
import { TextField, Button, MenuItem, InputLabel, Select, FormControl, CircularProgress, Box, Typography } from '@mui/material';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [institute, setInstitute] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, url } = useStore();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateUsername = (username) => /^[a-zA-Z0-9_]{3,15}$/.test(username);
  console.log(url);
  const handleSignup = async () => {
    setLoading(true);
    try {
      if (!validateEmail(email)) return toast.error("Invalid email.");
      if (!validateUsername(username)) return toast.error("Invalid username.");
      if (!validatePassword(password)) return toast.error("Password must be 8+ chars, contain letters, numbers & special chars.");
      if (!institute) return toast.error("Select an institute.");
     
      const response = await axios.post(`${url}/api/auth/signup`, { email, password, username, institute });
      console.log("Signup",response,url)
      if (response.status === 200) {
        setUser(response.data.savedUser);
        toast.success("Check your email to verify your account.");
      } else {
        toast.error("Signup failed.");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Signup error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${url}/api/user?Id=${user._id}`);
        if (response.data.data.isEmailVerified) navigate('/Dashboard');
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, [user, navigate]);

  return (
    <Box className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <Box sx={{ width: 400, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>Sign Up</Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email && !validateEmail(email)}
          helperText={email && !validateEmail(email) ? "Enter a valid email" : ""}
        />

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={username && !validateUsername(username)}
          helperText={username && !validateUsername(username) ? "3-15 characters, letters, numbers, or _" : ""}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Institute</InputLabel>
          <Select value={institute} onChange={(e) => setInstitute(e.target.value)}>
            {institutes.map((uni, index) => (
              <MenuItem key={index} value={uni}>{uni}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password && !validatePassword(password)}
          helperText={password && !validatePassword(password) ? "Min 8 chars, 1 letter, 1 number, 1 special" : ""}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignup}
          sx={{ mt: 2, height: 45 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>

        <Typography textAlign="center" mt={2}>
          Already have an account? <Link to="/Login" style={{ color: '#1976d2' }}>Login</Link>
        </Typography>
      </Box>
      <Toaster />
    </Box>
  );
};

export default SignupForm;
