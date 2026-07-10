import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleRoute } from '@/app/routes/RoleRoute'
import { GuestRoute } from '@/app/routes/GuestRoute'
import { useAuthStore } from '@/store/authStore'
import { USER_ROLES } from '@/types/roles'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { BuyerLayout } from '@/layouts/BuyerLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { LandingPage } from '@/pages/marketing/LandingPage'
import { CollectionPage } from '@/pages/marketing/CollectionPage'
import { ProductPage } from '@/pages/marketing/ProductPage'
import { CartPage } from '@/pages/marketing/CartPage'
import { CheckoutPage } from '@/pages/marketing/CheckoutPage'
import { PaymentPage } from '@/pages/marketing/PaymentPage'
import { OrderSuccessPage } from '@/pages/marketing/OrderSuccessPage'
import { OrderTrackingPage } from '@/pages/marketing/OrderTrackingPage'
import { WishlistPage } from '@/pages/marketing/WishlistPage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { ForgotPasswordPage } from './ForgotPasswordPage'
import { ResetPasswordPage } from './ResetPasswordPage'
import { BuyerDashboard } from '@/pages/buyer/BuyerDashboard';
import Dashboard from '@/pages/admin/Dashboard'
import { NotFoundPage } from '@/pages/NotFoundPage'
import Products from '@/pages/admin/Products'
import Orders from '@/pages/admin/Orders'
import Customers from '@/pages/admin/Customers'
import Coupons from '@/pages/admin/Coupons'
import Settings from '@/pages/admin/Settings'
import AddProduct from '@/pages/admin/AddProduct'
import EditProduct from '@/pages/admin/EditProduct'
import AddCoupon from '@/pages/admin/AddCoupon'
import EditCoupon from '@/pages/admin/EditCoupon'
import ReturnsManagement from '@/pages/admin/ReturnsManagement'
import { CreateAdminPage } from './CreateAdminPage'

function NonAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuthStore()
  if (isAuthenticated && role === USER_ROLES.ADMIN) {
    return <Navigate to="/admin" replace />
  }
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Authentication Routes (Protected from logged-in users) */}
      <Route element={<GuestRoute><MarketingLayout /></GuestRoute>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>      

      <Route element={<NonAdminRoute><MarketingLayout /></NonAdminRoute>}>
        <Route index element={<LandingPage />} />
        <Route path="/jewels" element={<CollectionPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Route>

      {/* Public route for creating an admin account from an invitation */}
      <Route path="/create-admin" element={<CreateAdminPage />} />

      <Route
        path="/buyer"
        element={
          <RoleRoute allowedRoles={[USER_ROLES.BUYER]}>
            <BuyerLayout />
          </RoleRoute>
        }
      >
        <Route index element={<BuyerDashboard />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="coupons/add" element={<AddCoupon />} />
        <Route path="coupons/edit/:id" element={<EditCoupon />} />
        <Route path="returns" element={<ReturnsManagement />} />
        <Route path="settings" element={<Settings />} />
        {/* <Route path="invite" element={<InviteAdminPage />} /> You can uncomment this for a dedicated invite page */}
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
