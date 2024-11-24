import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [tableNumber, setTableNumber] = useState("");  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Ensure table number is provided only for customers
    // if (!tableNumber) {
    //   setError("Table number is required for customers.");
    //   return;
    // }

    try {
      const response = await axios.post(
        "https://restaurant-management-backend-qgwe.onrender.com/api/users/register", 
        { name, email, password }  
      );
      
      setSuccess(response.data.message);
      setError(""); // Clear any previous error

      // Redirect to login or dashboard page
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds

    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>

      {error && <Typography color="error" align="center">{error}</Typography>}
      {success && <Typography color="success" align="center">{success}</Typography>}

      <form onSubmit={handleSignup}>
        <TextField
          label="Name"
          type="text"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Table Number - Only for customers */}
        {/* <TextField
          label="Table Number"
          type="number"
          fullWidth
          margin="normal"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        /> */}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>

      <Link to={'/'} style={{ textDecoration: 'none' }}>
        <p style={{ color: '#007BFF', cursor: 'pointer', fontWeight: 'bold' }}>
          Already have an account? Login Here
        </p>
      </Link>
    </Box>
  );
};

export default SignupPage;
