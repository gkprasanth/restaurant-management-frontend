import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Tabs, Tab } from "@mui/material";

import bg from "../assets/main-bg.jpg"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://restaurant-management-backend-qgwe.onrender.com/api/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      const { role } = user;

      if (!token || !role) {
        setError("Invalid server response.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (activeTab === 0) {
        if (role === "customer" && tableNumber) {
          navigate(`/${tableNumber}/menu`);
        } else if (role !== "customer") {
          setError("Invalid credentials for customer login.");
        } else {
          setError("Please enter a valid table number.");
        }
      } else if (activeTab === 1) {
        if (role === "kitchen" && email === "kitchen.staff@example.com") {
          navigate("/kitchen");
        } else {
          setError("Invalid credentials for kitchen login.");
        }
      } else if (activeTab === 2) {
        if (role === "reception" && email === "reception.staff@example.com") {
          navigate("/reception");
        } else {
          setError("Invalid credentials for reception login.");
        }
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setEmail("");
    setPassword("");
    setTableNumber("");
  };

  const handleGuestLogin = async () => {
    setEmail("guest@guest.com");
    setPassword("guest123");
    setError("");

    try {
      const response = await axios.post("https://restaurant-management-backend-qgwe.onrender.com/api/users/login", {
        email: "guest@guest.com",
        password: "guest123",
      });

      const { token, user } = response.data;
      const { role } = user;

      if (!token || role !== "customer") {
        setError("Guest login failed.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (tableNumber) {
        navigate(`/${tableNumber}/menu`);
      } else {
        setError("Please enter a valid table number to proceed.");
      }
    } catch (err) {
      console.error("Guest login error:", err.response?.data || err.message);
      setError("Guest login failed. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3, backgroundImage:`${bg}` }}   >
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Customer" />
        <Tab label="Kitchen" />
        <Tab label="Reception" />
      </Tabs>
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
        {activeTab === 0 && (
          <TextField
            label="Table Number"
            type="number"
            fullWidth
            margin="normal"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      {activeTab === 0 && (
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleGuestLogin}
        >
          Login as Guest
        </Button>
      )}
      <Link to="/register" style={{ textDecoration: "none" }}>
        <p style={{ color: "#007BFF", cursor: "pointer", fontWeight: "bold" }}>
          No account? Register Here
        </p>
      </Link>
    </Box>
  );
};

export default LoginPage;
