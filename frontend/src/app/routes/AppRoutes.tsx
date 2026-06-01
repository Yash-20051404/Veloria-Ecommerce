import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleRoute } from '@/app/routes/RoleRoute'
import { GuestRoute } from '@/app/routes/GuestRoute'
import { USER_ROLES } from '@/types/roles'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { BuyerLayout } from '@/layouts/BuyerLayout'
import { SellerLayout } from '@/layouts/SellerLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
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
import { SellerDashboardPage } from '@/pages/seller/SellerDashboardPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

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

      <Route element={<MarketingLayout />}>
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
        path="/seller"
        element={
          <RoleRoute allowedRoles={[USER_ROLES.SELLER]}>
            <SellerLayout />
          </RoleRoute>
        }
      >
        <Route index element={<SellerDashboardPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
