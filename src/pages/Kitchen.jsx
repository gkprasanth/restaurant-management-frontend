import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";

const KitchenOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null); // Track selected table

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://restaurant-management-backend-qgwe.onrender.com/orders");
        setOrders(response.data.data); // Fetch all orders
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Group orders by table number
  const groupedOrders = orders.reduce((acc, order) => {
    const { tableNumber } = order;
    if (!acc[tableNumber]) {
      acc[tableNumber] = [];
    }
    acc[tableNumber].push(order);
    return acc;
  }, {});

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await axios.put(
        `https://restaurant-management-backend-qgwe.onrender.com/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.data.status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", padding: 3 }}>
      {/* Table Buttons Section */}
      <Box
        sx={{
          width: "25%",
          paddingRight: 2,
          borderRight: "2px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3 }}>
          Tables
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {Object.keys(groupedOrders).map((tableNumber) => (
            <Button
              key={tableNumber}
              variant="outlined"
              color={selectedTable === tableNumber ? "primary" : "default"}
              onClick={() => setSelectedTable(tableNumber)}
              sx={{ marginBottom: 2, textTransform: "none" }}
            >
              Table {tableNumber}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Orders Section */}
      <Box sx={{ width: "75%", paddingLeft: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            padding: 2,
            backgroundColor: "#1976D2",  // Background color
            color: "#fff",  // Text color
            borderRadius: 1,  // Rounded corners
            textAlign: "center",  // Center align text
            boxShadow: 2,  // Box shadow for depth
            fontSize: "2rem",  // Larger font size for emphasis
          }}
        >
          Kitchen Orders
        </Typography>

        {selectedTable ? (
          groupedOrders[selectedTable].length === 0 ? (
            <Typography>No orders available for preparation on this table.</Typography>
          ) : (
            groupedOrders[selectedTable].map((order, index) => (
              <Card
                key={index}
                sx={{
                  marginBottom: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <CardHeader
                  title={`Customer: ${order.customer}`}
                  subheader={`Order Total: ₹${order.totalPrice}`}
                  titleTypographyProps={{ fontWeight: "bold" }}
                  sx={{ backgroundColor: "#1976D2", color: "#fff", padding: 2 }}
                />
                <CardContent>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Customizations:</strong> {order.customizations || "None"}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    <strong>Order Items:</strong>
                    <ul style={{ marginLeft: "20px" }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Chip
                      label={order.status === "completed" ? "Completed" : "In Progress"}
                      color={order.status === "completed" ? "success" : "warning"}
                      sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStatusUpdate(order._id, "completed")}
                      disabled={order.status === "completed"}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )
        ) : (
          <Typography>Select a table to view its orders.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default KitchenOrdersPage;
