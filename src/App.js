import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Reset from "./Reset";
import Shop from "./Shop";
import ShopDetails from "./ShopDetails";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderTracking from "./OrderTracking";
import AddProduct from "./AddProduct";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";
import ServicePackages from "./ServicePackages";
import ServiceCheckout from "./ServiceCheckout";
import AssetInventory from "./AssetInventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />

        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/shop-details" element={<Layout><ShopDetails /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/order-tracking" element={<Layout><OrderTracking /></Layout>} />
        <Route path="/service-packages" element={<Layout><ServicePackages /></Layout>} />
        <Route path="/asset-inventory" element={<Layout><AssetInventory /></Layout>} />
        <Route path="/service-checkout" element={<Layout><ServiceCheckout /></Layout>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/shop-details.html" element={<Navigate to="/shop-details" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
