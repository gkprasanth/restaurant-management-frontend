import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tableNumber, setTableNumber] = useState(""); // New state for table number
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://restaurant-management-backend-qgwe.onrender.com/api/users/login", {
        email,
        password,
      });
      console.log("Response Data:", response.data);

      // Extract the token and role from response
      const { token, user } = response.data;
      const { role } = user;

      // Validate token and role
      if (!token || !role) {
        setError("Invalid server response.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      console.log("Navigating to:", role);

      // Redirect based on role
      if (role === "customer") {
        // Redirect to table-specific menu route
        if (tableNumber) {
          navigate(`/${tableNumber}/menu`);
        } else {
          setError("Please enter a valid table number.");
        }
      } else if (role === "kitchen") navigate("/kitchen");
      else if (role === "reception") navigate("/reception");
      else setError("Invalid role received.");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleLogin}>
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
        <TextField
          label="Table Number" // New field for table number
          type="number"
          fullWidth
          margin="normal"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>


      <Link to={'/register'} style={{ textDecoration: 'none' }}>
        <p style={{ color: '#007BFF', cursor: 'pointer', fontWeight: 'bold' }}>
          No account? Register Here
        </p>
      </Link>
    </Box>
  );
};

export default LoginPage;
