import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  MessageSquare, 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useStore, type Product } from '../context/StoreContext';
import { supabase, handleImageError } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { products, setProducts, refreshProducts } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'overview'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category_id: 'men',
    price: '',
    original_price: '',
    stock: '20',
    image_url: '',
  });

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image_url) {
      alert('Product Name, Price aur Image URL bharna zaroori hai!');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProductPayload = {
        name: formData.name,
        category_id: formData.category_id,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        stock: Number(formData.stock) || 10,
        rating: 4.8,
        reviews_count: 24,
        image_url: formData.image_url,
        is_featured: true
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProductPayload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts((prev) => [data[0] as Product, ...prev]);
      } else {
        await refreshProducts();
      }

      setSuccessMsg('Product added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        category_id: 'men',
        price: '',
        original_price: '',
        stock: '20',
        image_url: ''
      });
    } catch (err: any) {
      alert('Error adding: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Kya aap "${name}" ko delete karna chahte hain?`);
    if (!confirmDelete) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSuccessMsg(`"${name}" deleted!`);
    setTimeout(() => setSuccessMsg(''), 3000);

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Server delete failed: ' + error.message);
        await refreshProducts();
      }
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
      await refreshProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    try {
      await supabase.from('orders').update({ status: nextStatus }).eq('id', orderId);
    } catch (err) {
      console.error('Status update failed:', err);
      fetchOrders();
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 bg-[#111827] border-b border-gray-800 px-6 py-4 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-[#C59B27]">Bhart Mart</span> Admin Dashboard
            </h1>
            <p className="text-[11px] text-gray-400">Inventory & Realtime Orders</p>
          </div>
        </div>

        <button onClick={onClose} className="text-gray-400 hover:text-white p-1 cursor-pointer">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 space-y-6 flex-1">
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] text-gray-400 font-semibold">Total Revenue</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-black text-emerald-400">₹{totalRevenue}</span>
              <TrendingUp className="w-5 h-5 text-emerald-500/30" />
            </div>
            <span className="text-[10px] text-gray-500 mt-2">From {orders.length} orders</span>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] text-gray-400 font-semibold">Live Orders</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-black text-blue-400">{orders.length}</span>
              <ShoppingBag className="w-5 h-5 text-blue-500/30" />
            </div>
            <span className="text-[10px] text-gray-500 mt-2">COD Deliveries</span>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] text-gray-400 font-semibold">Catalog Items</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-black text-[#D4AF37]">{products.length}</span>
              <Package className="w-5 h-5 text-amber-500/30" />
            </div>
            <span className="text-[10px] text-gray-500 mt-2">Active items</span>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] text-gray-400 font-semibold">Out of Stock</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-black text-rose-400">{outOfStockCount}</span>
              <AlertTriangle className="w-5 h-5 text-rose-500/30" />
            </div>
            <span className="text-[10px] text-gray-500 mt-2">Stock status</span>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between col-span-2 md:col-span-1">
            <span className="text-[11px] text-gray-400 font-semibold">Support Inbox</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-black text-purple-400">0</span>
              <MessageSquare className="w-5 h-5 text-purple-500/30" />
            </div>
            <span className="text-[10px] text-gray-500 mt-2">Clean inbox</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('orders');
                fetchOrders();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#C59B27] text-white shadow'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Customer Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#C59B27] text-white shadow'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" /> Products List ({products.length})
            </button>

            <button
              onClick={() => fetchOrders()}
              className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg transition"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          )}
        </div>

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-900/80 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Phone & Address</th>
                    <th className="p-3.5">Ordered Items</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Delivery Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        {loadingOrders ? 'Loading orders...' : 'Abhi koi order nahi aaya hai. Cart me jaakar test order place karein.'}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-900/40 transition">
                        <td className="p-3.5 font-bold text-white whitespace-nowrap">
                          {order.customer_name}
                        </td>
                        <td className="p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{order.phone}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-gray-400 max-w-xs">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-500" />
                            <span>{order.address} {order.pincode ? `(${order.pincode})` : ''}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-1">
                            {Array.isArray(order.items) &&
                              order.items.map((it: any, idx: number) => (
                                <div key={idx} className="text-gray-300 flex items-center gap-2">
                                  <span>• {it.name}</span>
                                  <span className="text-[#D4AF37] font-bold">x{it.quantity}</span>
                                </div>
                              ))}
                          </div>
                        </td>
                        <td className="p-3.5 font-black text-emerald-400 text-sm whitespace-nowrap">
                          ₹{order.total_amount} <span className="text-[10px] text-gray-500 font-normal">({order.payment_method || 'COD'})</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, order.status)}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md text-[11px] font-semibold transition cursor-pointer"
                          >
                            Mark {order.status === 'Pending' ? 'Delivered' : 'Pending'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Table */}
        {activeTab === 'products' && (
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-900/80 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Original</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Koi products nahi hain.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-900/40 transition">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            onError={handleImageError}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-950 border border-gray-800 shrink-0"
                          />
                          <span className="font-semibold text-white line-clamp-1 max-w-xs">
                            {prod.name}
                          </span>
                        </td>
                        <td className="p-3.5 uppercase tracking-wide text-[11px] font-medium text-gray-400">
                          {prod.category_id || 'General'}
                        </td>
                        <td className="p-3.5 font-bold text-[#D4AF37]">
                          ₹{prod.price}
                        </td>
                        <td className="p-3.5 text-gray-500 line-through">
                          {prod.original_price ? `₹${prod.original_price}` : '-'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stock > 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Catalog Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Luxury Perfume"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="men">Men's Wear</option>
                    <option value="women">Women's Wear</option>
                    <option value="tshirts">T-Shirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                    <option value="home">Home & Living</option>
                    <option value="beauty">Beauty & Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="499"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="999"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Image URL</label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 pr-9 focus:border-[#D4AF37] focus:outline-none"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#C59B27] hover:bg-[#B0881E] text-white rounded-lg font-bold shadow disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};