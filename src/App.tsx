import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';

import ProductList from './pages/admin/products/ProductList';
import ProductForm from './pages/admin/products/ProductForm';
import ProductEdit from './pages/admin/products/ProductEdit';
import ProductDetail from './pages/admin/products/ProductDetail';

import CategoryList from './pages/admin/categories/CategoryList';
import CategoryForm from './pages/admin/categories/CategoryForm';
import CategoryDetail from './pages/admin/categories/CategoryDetail';
import CategoryEdit from './pages/admin/categories/CategoryEdit';

import EntityList from './pages/admin/entities/EntityList';
import EntityForm from './pages/admin/entities/EntityForm';

import Dashboard from './pages/admin/Dashboard';
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Library from './pages/user/Library';
import Checkout from './pages/user/Checkout';
import UserProductDetail from './pages/user/ProductDetail';
import OrderList from './pages/admin/orders/OrderList';
import Store from './pages/user/Store';
import Register from './pages/auth/Register';
import Profile from './pages/user/Profile';
import UserList from './pages/admin/users/UserList';

// Guard: chưa đăng nhập → về /login
function RequireAuth() {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Guard: đã đăng nhập → không vào lại /login
function GuestOnly() {
  const user = localStorage.getItem("user");
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  return (
    <Routes>

      {/* ==================== GUEST ONLY ==================== */}
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ==================== CLIENT ==================== */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<UserProductDetail />} />
      <Route path="/checkout/:productId" element={<Checkout />} />
      <Route path="/library" element={<Library />} />
      <Route path="/store" element={<Store />} />
      <Route path="/profile" element={<Profile />} />
      {/* ==================== ADMIN (cần đăng nhập) ==================== */}
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* Products */}
          <Route path="products">
            <Route index element={<ProductList />} />
            <Route path="add" element={<ProductForm />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path="edit/:id" element={<ProductEdit />} />

          </Route>

          {/* Categories */}
          <Route path="categories">
            <Route index element={<CategoryList />} />
            <Route path="add" element={<CategoryForm />} />
            <Route path=":id" element={<CategoryDetail />} />
            <Route path="edit/:id" element={<CategoryEdit />} />
          </Route>

          {/* Developers — BỎ /admin/ prefix vì đã nằm trong /admin */}
          <Route path="developers">
            <Route index element={<EntityList type="developer" />} />
            <Route path="add" element={<EntityForm type="developer" />} />
            <Route path="edit/:id" element={<EntityForm type="developer" />} />
          </Route>

          {/* Publishers */}
          <Route path="publishers">
            <Route index element={<EntityList type="publisher" />} />
            <Route path="add" element={<EntityForm type="publisher" />} />
            <Route path="edit/:id" element={<EntityForm type="publisher" />} />
          </Route>
          <Route path="orders" element={<OrderList />} />
          <Route path="users" element={<UserList />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;