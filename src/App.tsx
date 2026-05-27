import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { SellerLayout } from "./components/SellerLayout";
import { AdminLayout } from "./components/AdminLayout";

// Public landing
import Landing from "./pages/Landing";

// Lazy-loaded chunks to keep initial bundle small
const Browse = lazy(() => import("./pages/Browse"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ShopsList = lazy(() => import("./pages/ShopsList"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Account = lazy(() => import("./pages/Account"));
const Favorites = lazy(() => import("./pages/Favorites"));

const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const OtpVerify = lazy(() => import("./pages/auth/OtpVerify"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

const SellerOnboarding = lazy(() => import("./pages/seller/Onboarding"));
const SellerDashboard = lazy(() => import("./pages/seller/Dashboard"));
const SellerProducts = lazy(() => import("./pages/seller/Products"));
const SellerOrders = lazy(() => import("./pages/seller/Orders"));
const SellerEarnings = lazy(() => import("./pages/seller/Earnings"));
const SellerShopSettings = lazy(() => import("./pages/seller/ShopSettings"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSellers = lazy(() => import("./pages/admin/Sellers"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminCommissions = lazy(() => import("./pages/admin/Commissions"));
const AdminDisputes = lazy(() => import("./pages/admin/Disputes"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth & onboarding — full-page, no shell */}
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/otp" element={<OtpVerify />} />
        <Route path="/auth/forgot" element={<Forgot />} />
        <Route path="/seller/onboarding" element={<SellerOnboarding />} />

        {/* Seller back-office — sidebar shell */}
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/earnings" element={<SellerEarnings />} />
          <Route path="/seller/shop" element={<SellerShopSettings />} />
        </Route>

        {/* Admin back-office — sidebar shell */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/sellers" element={<AdminSellers />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/commissions" element={<AdminCommissions />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        {/* Public marketplace — header/footer shell */}
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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
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
