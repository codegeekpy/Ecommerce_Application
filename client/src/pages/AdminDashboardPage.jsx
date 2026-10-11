import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  Clock, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  Database,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AdminProductModal from '../components/AdminProductModal';
import { formatPrice } from '../utils/formatCurrency';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'users' | 'database'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // Modals & Edits
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Status Updater Dialog state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('Shipped');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get('/api/stats/dashboard'),
        axios.get('/api/orders'),
        axios.get('/api/products?limit=100'),
        axios.get('/api/auth/users')
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data.products || []);
      setUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
      addToast('Failed to load administrative dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          This portal is restricted to users with administrator credentials.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus} by Admin`,
        trackingNumber: trackingNumber || undefined
      });
      addToast(`Order status updated to ${newStatus}`, 'success');
      setUpdatingOrderId(null);
      loadData();
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  // Handle Product Create / Update
  const handleSaveProduct = async (productData) => {
    try {
      if (productToEdit) {
        await axios.put(`/api/products/${productToEdit._id}`, productData);
        addToast('Equipment updated successfully', 'success');
      } else {
        await axios.post('/api/products', productData);
        addToast('New product created and synced to catalog', 'success');
      }
      setIsModalOpen(false);
      setProductToEdit(null);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      return;
    }
    try {
      await axios.delete(`/api/products/${productId}`);
      addToast(`Deleted "${name}"`, 'info');
      loadData();
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Admin Console
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Store Management & Logistics Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Enterprise Operations</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh datasets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Equipment</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {formatPrice(stats?.totalRevenue || 0)}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium">All settled payments</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalOrders || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Customer checkouts</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Catalog Items</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalProducts || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Active SKU offerings</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalUsers || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Verified customer accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Fulfillment</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300">{stats?.pendingOrders || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Awaiting dispatch</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-brand-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-brand-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-brand-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Accounts ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'database'
              ? 'border-brand-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & Diagnostics</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search orders, customers, or emails..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Live Status</th>
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No orders match the current criteria
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-300">
                          #{order._id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</p>
                          <p className="text-[11px] text-slate-400">{order.user?.email || 'Guest'}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          {order.orderItems?.length || 0} items
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {formatPrice(order.totalPrice)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : order.status === 'Shipped'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                          {order.trackingNumber || 'Pending'}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setUpdatingOrderId(order._id);
                              setNewStatus(order.status);
                              setTrackingNumber(order.trackingNumber || '');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold"
                          >
                            Update Status
                          </button>
                          <Link
                            to={`/orders/${order._id}`}
                            className="inline-block p-1 text-slate-400 hover:text-white"
                            title="View Public Tracking Sheet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Status Modal if updating an order */}
          {updatingOrderId && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-400" />
                  <span>Update Order Logistics</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400">Order Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped (In Transit)</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Tracking Code</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. FEDEX-8902143"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Milestone Note (Optional)</label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Cleared export customs in Frankfurt"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setUpdatingOrderId(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(updatingOrderId)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-sm"
                  >
                    Save & Broadcast
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search catalog SKUs..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => {
                setProductToEdit(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800" />
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.brand}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-mono ${p.stock < 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-amber-400 font-bold">
                        ★ {p.rating} ({p.numReviews})
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setProductToEdit(p);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                        alt=""
                        className="w-8 h-8 rounded-full ring-1 ring-brand-500/50"
                      />
                      <span className="font-semibold text-white">{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-brand-500/20 text-brand-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{u._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE & DIAGNOSTICS */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Database Engine Status</h3>
                <p className="text-xs text-slate-400">Real-time persistence backend</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Storage:</span>
                <span className="font-bold text-emerald-400">
                  {stats?.databaseType || 'MongoDB / Local Store'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Backend Server Port:</span>
                <span className="font-mono text-white">5000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vite Frontend Port:</span>
                <span className="font-mono text-white">5173</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Server Health Check:</span>
                <span className="text-emerald-400 font-semibold">200 OK Live</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The application natively integrates with <strong>MongoDB</strong> via Mongoose schemas. If a local or MongoDB Atlas URI is provided in <code className="text-brand-300">server/.env</code>, the backend connects and synchronizes collections automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>MongoDB Integration Guide</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                To connect your dedicated MongoDB instance or free <strong>MongoDB Atlas</strong> cloud cluster:
              </p>
              <ol className="list-decimal list-inside space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                <li>Open <code className="text-brand-300">server/.env</code></li>
                <li>Set <code className="text-emerald-300">MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce</code></li>
                <li>Restart the server (<code className="text-brand-300">npm run dev</code>)</li>
              </ol>
              <p className="text-[11px] text-slate-400">
                All models, indexes, relations, and password salts will automatically configure upon connection!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Product Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={['All', 'Electronics', 'Smart Wearables', 'Home & Studio', 'Accessories']}
      />
    </div>
  );
}
