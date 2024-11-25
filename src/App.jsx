import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom"; // Import the useParams hook
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage"; // Frontend orders page for a specific table
import KitchenOrdersPage from "./pages/Kitchen";
import SignupPage from "./pages/SignUpPage";
import ReceptionPage from "./pages/ReceptionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/:tableNumber/menu" element={<MenuPage />} />
        <Route path="/:tableNumber/orders" element={<OrdersWithTable />} /> {/* Orders page for a specific table */}
        <Route path="/kitchen" element={<KitchenOrdersPage />} />  

        <Route path="/reception" element={<ReceptionPage />} />  
      </Routes>
    </Router>
  );
}

// A new wrapper component to extract the tableNumber from the URL and pass it as a prop to OrdersPage
function OrdersWithTable() {
  const { tableNumber } = useParams(); // Access tableNumber from the URL
  return <OrdersPage tableNumber={tableNumber} />; // Pass tableNumber as prop to OrdersPage
}

export default App;
