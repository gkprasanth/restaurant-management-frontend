import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

const KitchenOrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("https://restaurant-management-backend-qgwe.onrender.com/orders");
                setOrders(response.data.data); // Fetch all orders
            } catch (error) {
                console.error("Error fetching orders:", error);
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
                `https://restaurant-management-backend-qgwe.onrender.com/api/orders/${orderId}/status`,
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

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Kitchen Orders
            </Typography>
            {Object.keys(groupedOrders).length === 0 ? (
                <Typography>No orders available for preparation.</Typography>
            ) : (
                Object.keys(groupedOrders).map((tableNumber) => (
                    <Box key={tableNumber} sx={{ marginBottom: 4 }}>
                        <Typography variant="h5">Table {tableNumber}</Typography>
                        {groupedOrders[tableNumber].map((order, index) => (
                            <Card key={index} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">Customer: {order.customer}</Typography>
                                    <Typography variant="body1">Total: ₹{order.totalPrice}</Typography>
                                    <Typography variant="body2">
                                        Customizations: {order.customizations || "None"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Order Items:
                                        <ul>
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.name} (x{item.quantity}) - ${item.price * item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </Typography>
                                    <Typography variant="body2">Status: {order.status}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleStatusUpdate(order._id, "completed")}
                                        disabled={order.status === "completed"}
                                    >
                                        Mark as Completed
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ))
            )}
        </Box>
    );
};

export default KitchenOrdersPage;
