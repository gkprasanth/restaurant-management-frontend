import { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = ({ tableNumber }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/table/${tableNumber}`);
                setOrders(response.data.data); // Assuming the API returns the orders in the `data` property
                setLoading(false);
            } catch (err) {
                setError('Error fetching orders');
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [tableNumber]); // This will re-fetch when tableNumber changes

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Orders for Table {tableNumber}</h1>
            {orders.length === 0 ? (
                <p>No orders found for this table.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>
                            Order ID: {order._id} - Status: {order.status}
                            {/* Add more order details here */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrdersPage;
