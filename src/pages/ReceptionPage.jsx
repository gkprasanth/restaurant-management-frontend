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
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const ReceptionPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false); // State to open/close the modal
  const [paymentAmount, setPaymentAmount] = useState(0); // Store the payment amount

  const totalTables = 20; // Total number of tables

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://restaurant-management-backend-qgwe.onrender.com/orders");
        setOrders(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await axios.put(
        `https://restaurant-management-backend-qgwe.onrender.com/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.data.status }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleClearTableOrders = async (tableNumber) => {
    try {
      await axios.delete(
        `https://restaurant-management-backend-qgwe.onrender.com/orders/table/clear/${tableNumber}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.tableNumber !== tableNumber)
      );
    } catch (error) {
      console.error("Error clearing table orders:", error);
    }
  };

  const handleClearAllTables = async () => {
    try {
      await axios.delete("https://restaurant-management-backend-qgwe.onrender.com/orders/clear-all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders([]);
      setSelectedTable(null);
    } catch (error) {
      console.error("Error clearing all table orders:", error);
    }
  };

  const handleGenerateBill = () => {
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    setPaymentAmount(totalAmount);
    setOpenPaymentModal(true); // Open the payment modal
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false); // Close the payment modal
  };

  const handlePaymentSubmit = () => {
    // Logic for handling payment submission can be added here.
    console.log("Payment submitted for amount:", paymentAmount);
    handleClosePaymentModal(); // Close the modal after payment
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredOrders = selectedTable
    ? orders.filter((order) => order.tableNumber === selectedTable)
    : [];

  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginBottom: 3,
          textAlign: "center",
          color: "#1976D2", // Add a color for the title
          fontFamily: "Roboto, sans-serif", // Apply a modern font
          letterSpacing: 1, // Add some spacing between the letters
          textTransform: "uppercase", // Make the text uppercase for emphasis
          boxShadow: 1, // Add subtle shadow to make the title stand out
          padding: 1, // Add padding for spacing around the text
          borderRadius: 1, // Round the corners for a softer look
          backgroundColor: "#f0f4f8", // Light background color to contrast the title
        }}
      >
        Reception Page
      </Typography>

      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          {/* Table Buttons */}
          <Grid item xs={12} md={4}>
            <Box>
              <Grid container spacing={2}>
                {Array.from({ length: totalTables }, (_, index) => index + 1).map(
                  (table) => (
                    <Grid item xs={6} sm={4} key={table}>
                      <Button
                        fullWidth
                        variant={selectedTable === table ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setSelectedTable(table)}
                      >
                        Table {table}
                      </Button>
                    </Grid>
                  )
                )}
              </Grid>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleClearAllTables}
              >
                Clear All Tables
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleGenerateBill} // Trigger the generate bill modal
              >
                Generate Bill
              </Button>
            </Box>
          </Grid>

          {/* Orders for Selected Table */}
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                {selectedTable ? `Orders for Table ${selectedTable}` : "Select a Table"}
              </Typography>
              {selectedTable ? (
                filteredOrders.length > 0 ? (
                  <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
                    <CardHeader
                      title={`Table ${selectedTable}`}
                      subheader={`Total Orders: ${filteredOrders.length}`}
                      titleTypographyProps={{ fontWeight: "bold" }}
                      sx={{ backgroundColor: "#1976D2", color: "#fff", padding: 2 }}
                    />
                    <CardContent>
                      <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        <strong>Order Items:</strong>
                        <ul style={{ marginLeft: "20px" }}>
                          {filteredOrders.map((order) =>
                            order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
                              </li>
                            ))
                          )}
                        </ul>
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "right",
                          marginTop: 2,
                        }}
                      >
                        Total Amount: ₹{totalAmount}
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
                          label="In Progress"
                          color="warning"
                          sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                        />
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleClearTableOrders(selectedTable)}
                        >
                          Clear Table Orders
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Typography variant="h6" sx={{ color: "gray" }}>
                    No Orders for Table {selectedTable}
                  </Typography>
                )
              ) : (
                <Typography variant="h6" sx={{ color: "gray" }}>
                  Please select a table to view its orders.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Payment Modal */}
      <Dialog open={openPaymentModal} onClose={handleClosePaymentModal}>
        <DialogTitle>Payment for Table {selectedTable}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Total Amount: ₹{paymentAmount}
          </Typography>
          <TextField
            label="Payment Amount"
            variant="outlined"
            fullWidth
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            sx={{ marginBottom: 2 }}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handlePaymentSubmit}
            color="success"
            variant="contained"
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceptionPage;
