import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import MenuCard from "../components/MenuCard";

const MenuPage = () => {
    const { tableNumber } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [customization, setCustomization] = useState("");
    const [customerName, setCustomerName] = useState(""); // Store customer name
    const containerRefs = useRef({});
    const [token, setToken] = useState("");
    const [openOrdersModal, setOpenOrdersModal] = useState(false); // State for showing orders modal
    const [orders, setOrders] = useState([]); // State to store orders for the table

    const getTotalPrice = () => {
        return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get("https://restaurant-management-backend-qgwe.onrender.com/menu");
                setMenuItems(response.data);
                const token = localStorage.getItem("token");
                setToken(token);
            } catch (err) {
                console.error("Error fetching menu:", err);
            }
        };
        fetchMenu();
    }, []);

    // Fetch orders for the current table
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://restaurant-management-backend-qgwe.onrender.com/orders/${tableNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setOrders(response.data.data); // Access orders from response
            setOpenOrdersModal(true);
        } catch (error) {
            console.error("Error fetching orders:", error.response ? error.response.data.message : error.message);
        }
    };
    

    const handlePlaceOrder = async () => {
        try {
            if (!customerName.trim()) {
                alert("Please enter your name.");
                return;
            }
    
            const orderData = {
                customer: customerName, // Dynamic customer name
                tableNumber: tableNumber,
                items: order.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    customizations: item.customizations || "",
                })),
                totalPrice: getTotalPrice(),
                customizations: customization,
            };
    
            // Sending the order data to the backend
            const response = await axios.post("https://restaurant-management-backend-qgwe.onrender.com/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log("Order placed successfully:", response.data);
    
            // Reset the orders state (clear the order state)
            setOrder([]); // This clears the order array (reset the state)
    
            // Close the modal after successful order
            setOpenModal(false);
        } catch (error) {
            console.error("Error placing order:", error.response ? error.response.data.message : error.message);
        }
    };
    
    

    const handleAddToOrder = (item) => {
        const updatedOrder = [...order];
        const existingItem = updatedOrder.find(
            (orderItem) => orderItem.name === item.name && orderItem.customizations === customization
        );
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            updatedOrder.push({
                name: item.name,
                price: item.price,
                quantity: 1,
                customizations: customization,
            });
        }
        setOrder(updatedOrder);
        setCustomization("");
    };

    const groupedMenuItems = menuItems.reduce((acc, item) => {
        const category = item.category || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <Box
            sx={{
                padding: 3,
                position: "relative",
                backgroundImage:
                    'url("https://png.pngtree.com/thumb_back/fw800/background/20231230/pngtree-illustrated-vector-background-restaurant-menu-design-with-paper-texture-food-and-image_13914730.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    zIndex: -1,
                }}
            />
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    background: "linear-gradient(to right, #FF9800, #FF5722)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    padding: "12px 0",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
            >
                Menu for Table {tableNumber}
            </Typography>

            {Object.keys(groupedMenuItems).map((category) => (
                <Box key={category} sx={{ mb: 6 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#222", textTransform: "uppercase" }}>
                        {category}
                    </Typography>
                    <Box
                        ref={(el) => (containerRefs.current[category] = el)}
                        sx={{
                            display: "flex",
                            overflowX: "auto",
                            gap: 3,
                            padding: "10px 0",
                            scrollBehavior: "smooth",
                        }}
                    >
                        {groupedMenuItems[category].map((item) => (
                            <Box
                                key={item._id}
                                sx={{
                                    flexShrink: 0,
                                    width: { xs: "calc(70% - 8px)", sm: "calc(33.33% - 16px)" },
                                }}
                            >
                                <MenuCard
                                    item={item}
                                    onAddToOrder={() => handleAddToOrder(item)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}

            {order.length > 0 && (
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                    sx={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        backgroundColor: "#FF5722",
                        "&:hover": {
                            backgroundColor: "#FF3D00",
                        },
                    }}
                >
                    Place Order ({getTotalPrice()} INR)
                </Button>
            )}

            {/* View Orders Button */}
            <Button
                variant="contained"
                onClick={fetchOrders}
                sx={{
                    position: "fixed",
                    bottom: 70,
                    right: 20,
                    backgroundColor: "#4CAF50",
                    "&:hover": {
                        backgroundColor: "#388E3C",
                    },
                }}
            >
                View Orders
            </Button>

            {/* Modal for confirmation */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Order Confirmation</DialogTitle>
                <DialogContent>
                    {/* Customer Name Field */}
                    <TextField
                        label="Your Name"
                        variant="outlined"
                        fullWidth
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Are you sure you want to place this order?
                    </Typography>
                    <Box>
                        {order.map((item, index) => (
                            <Box key={index}>
                                <Typography>
                                    {item.name} (x{item.quantity}) - {item.price * item.quantity} INR
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <TextField
                        label="Additional Customization"
                        variant="outlined"
                        fullWidth
                        value={customization}
                        onChange={(e) => setCustomization(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePlaceOrder} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal for viewing orders */}
            <Dialog open={openOrdersModal} onClose={() => setOpenOrdersModal(false)}>
                <DialogTitle>Orders for Table {tableNumber}</DialogTitle>
                <DialogContent>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="h6">{order.customer}</Typography>
                                <Typography>Items:</Typography>
                                {order.items.map((item, idx) => (
                                    <Typography key={idx}>
                                        {item.name} (x{item.quantity}) - {item.price * item.quantity} INR
                                    </Typography>
                                ))}
                                <Typography>Total: {order.totalPrice} INR</Typography>
                                <Typography>Customizations: {order.customizations}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No orders placed yet.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenOrdersModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MenuPage;
