import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import AdminRoute from '@/routes/AdminRoute'

import Home from '@/pages/customer/Home'
import Catalog from '@/pages/customer/Catalog'
import ProductDetail from '@/pages/customer/ProductDetail'
import Compare from '@/pages/customer/Compare'
import BudgetSearch from '@/pages/customer/BudgetSearch'
import Cart from '@/pages/customer/Cart'
import Checkout from '@/pages/customer/Checkout'
import OrderHistory from '@/pages/customer/OrderHistory'
import OrderTracking from '@/pages/customer/OrderTracking'

import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'

import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import AdminCategories from '@/pages/admin/Categories'
import AdminOrders from '@/pages/admin/Orders'

import NotFound from '@/pages/NotFound'

export default function App() {
  const { initialize, session, isInitialized } = useAuthStore()
  const loadCart = useCartStore((s) => s.load)
  const resetCart = useCartStore((s) => s.reset)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (session) loadCart(session.user.id)
    else resetCart()
  }, [session, loadCart, resetCart])

  if (!isInitialized) return null

  return (
    <Routes>
      {/* Public + customer routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalog />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/budget-search" element={<BudgetSearch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Authenticated customer routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account/orders" element={<OrderHistory />} />
          <Route path="/account/orders/:id" element={<OrderTracking />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>
    </Routes>
  )
}
