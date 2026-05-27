import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import ShopPage from "./pages/ShopPage";
import ShopsList from "./pages/ShopsList";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Account from "./pages/Account";
import Favorites from "./pages/Favorites";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import OtpVerify from "./pages/auth/OtpVerify";
import Forgot from "./pages/auth/Forgot";
import SellerOnboarding from "./pages/seller/Onboarding";
import SellerDashboard from "./pages/seller/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <Routes>
      {/* Auth routes — no layout */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/otp" element={<OtpVerify />} />
      <Route path="/auth/forgot" element={<Forgot />} />
      <Route path="/seller/onboarding" element={<SellerOnboarding />} />

      {/* Layout-wrapped routes */}
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/shops" element={<ShopsList />} />
        <Route path="/shop/:slug" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderTracking />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/*" element={<Account />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="container-editorial py-32 text-center">
      <div className="font-display text-8xl gold-text font-bold mb-4">404</div>
      <h1 className="font-display text-3xl mb-2">الصفحة غير موجودة</h1>
      <p className="text-cocoa-400">عد إلى الصفحة الرئيسية واكتشف المزيد</p>
    </div>
  );
}
