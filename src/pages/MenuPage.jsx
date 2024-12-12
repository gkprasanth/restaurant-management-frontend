import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import MenuCard from "../components/MenuCard";

const MenuPage = () => {
    const { tableNumber } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [customization, setCustomization] = useState("");
    const [customerName, setCustomerName] = useState("");
    const containerRefs = useRef({});
    const [token, setToken] = useState("");
    const [openOrdersModal, setOpenOrdersModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [splitCount, setSplitCount] = React.useState(1);


    const getTotalPrice = () => {
        return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(
                    "https://restaurant-management-backend-qgwe.onrender.com/menu"
                );
                setMenuItems(response.data);
                const token = localStorage.getItem("token");
                setToken(token);
            } catch (err) {
                console.error("Error fetching menu:", err);
            }
        };
        fetchMenu();
    }, []);

    const fetchOrders = async () => {
        setOpenOrdersModal(false); // Ensure modal is closed before fetching orders
        try {
            console.log("Fetching orders for table:", tableNumber); // Debug log
            const response = await axios.get(
                `https://restaurant-management-backend-qgwe.onrender.com/orders/${tableNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrders(response.data.data); // Assuming response data structure
            setOpenOrdersModal(true); // Open orders modal
        } catch (error) {
            console.error(
                "Error fetching orders:",
                error.response ? error.response.data.message : error.message
            );
            alert("Error fetching orders. Please try again.");
        }
    };

    const handlePlaceOrder = async () => {
        if (!customerName.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (order.length === 0) {
            alert("Your order is empty.");
            return;
        }

        try {
            const orderData = {
                customer: customerName,
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

            console.log("Placing order with data:", orderData);

            const response = await axios.post(
                "https://restaurant-management-backend-qgwe.onrender.com/orders",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Order placed successfully:", response.data);
            setOrder([]); // Clear the order
            setOpenModal(false); // Close the modal
        } catch (error) {
            console.error(
                "Error placing order:",
                error.response ? error.response.data.message : error.message
            );
            alert("Error placing order. Please try again.");
            setOpenModal(false);
        }
    };

    const handleAddToOrder = (item) => {
        const updatedOrder = [...order];
        const existingItem = updatedOrder.find(
            (orderItem) =>
                orderItem.name === item.name && orderItem.customizations === customization
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

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token
        navigate("/"); // Redirect to the home route
    };

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

            {/* Logout Button */}
            <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "#FF1744",
                    "&:hover": {
                        backgroundColor: "#D50000",
                    },
                }}
            >
                Logout
            </Button>

            {Object.keys(groupedMenuItems).map((category) => (
                <Box key={category} sx={{ mb: 6 }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#222", textTransform: "uppercase" }}
                    >
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

            {/* Place Order and View Orders Buttons */}
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

            {/* Modal for placing an order */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Place Your Order</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Customer Name"
                        fullWidth
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Customization"
                        fullWidth
                        value={customization}
                        onChange={(e) => setCustomization(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePlaceOrder} color="primary">
                        Place Order
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal for viewing orders */}
            <Dialog open={openOrdersModal} onClose={() => setOpenOrdersModal(false)} maxWidth="md" fullWidth>
    <DialogTitle>Orders for Table {tableNumber}</DialogTitle>
    <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {orders.length > 0 ? (
            <>
                {orders.map((order, index) => (
                    <Box key={index} sx={{ mb: 3, p: 2, borderBottom: '1px solid #ccc' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Order {index + 1}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Customer:</strong> {order.customer}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Items:</strong>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        {item.name} (x{item.quantity})
                                    </li>
                                ))}
                            </ul>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Customizations:</strong> {order.customizations || 'None'}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Total: {order.totalPrice} INR
                        </Typography>
                    </Box>
                ))}

                {/* Calculate and display the total combined bill */}
                <Box sx={{ mt: 3, padding: '10px 0', borderTop: '1px solid #ccc' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Total Combined Bill: {orders.reduce((total, order) => total + parseFloat(order.totalPrice), 0).toFixed(2)} INR
                    </Typography>
                </Box>

                {/* Bill Split Option */}
                <Box sx={{ mt: 3, padding: '10px 0', borderTop: '1px solid #ccc' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Split Bill
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            type="number"
                            label="Number of People"
                            variant="outlined"
                            size="small"
                            value={splitCount}
                            onChange={(e) => setSplitCount(e.target.value)}
                            inputProps={{ min: 1 }}
                        />
                        <Typography variant="body1">
                            Per Person: {splitCount > 0 ? (orders.reduce((total, order) => total + parseFloat(order.totalPrice), 0) / splitCount).toFixed(2) : '0.00'} INR
                        </Typography>
                    </Box>
                </Box>
            </>
        ) : (
            <Typography>No orders available.</Typography>
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
