import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { formatPKR } from '../utils/currency';
import '../styles/Admin.css';

const emptyForm = { name: '', price: '', image: '', description: '', category: '', stock: '', sizes: '', discountPercent: '' };

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('products');

  // --- Products state ---
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [prodError, setProdError] = useState('');
  const [prodLoading, setProdLoading] = useState(true);

  // --- Orders state ---
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // --- Messages state ---
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch { setProdError('Failed to load products'); }
    finally { setProdLoading(false); }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch { setOrdersError('Failed to load orders'); }
    finally { setOrdersLoading(false); }
  };

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch { setMessagesError('Failed to load messages'); }
    finally { setMessagesLoading(false); }
  };

  useEffect(() => { fetchProducts(); fetchOrders(); fetchMessages(); }, []);

  // Products form
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    const fileData = new FormData();
    fileData.append('image', file);

    try {
      const { data } = await api.post('/upload', fileData);
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setUploadingImage(false);
    }
  };
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProdError('');
    if (!form.image) {
      setProdError('Please upload a product photo before saving.');
      return;
    }
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: form.stock === '' ? 0 : parseInt(form.stock, 10),
      discountPercent: form.discountPercent === '' ? 0 : parseInt(form.discountPercent, 10),
      sizes: form.sizes
        ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      resetForm();
      fetchProducts();
    } catch (err) { setProdError(err.response?.data?.message || 'Failed to save product'); }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description || '',
      category: product.category || '',
      stock: product.stock ?? '',
      sizes: (product.sizes || []).join(', '),
      discountPercent: product.discountPercent || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); fetchProducts(); }
    catch { setProdError('Failed to delete product'); }
  };

  // Orders
  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch { setOrdersError('Failed to update status'); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try { await api.delete(`/orders/${id}`); fetchOrders(); }
    catch { setOrdersError('Failed to delete order'); }
  };

  // Messages
  const handleMarkRead = async (id) => {
    try {
      const { data } = await api.patch(`/contact/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? data : m)));
    } catch { setMessagesError('Failed to update message'); }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.delete(`/contact/${id}`); fetchMessages(); }
    catch { setMessagesError('Failed to delete message'); }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header-bar">
        <h2>Admin Dashboard</h2>
        <div>
          <span className="admin-user">👋 {user?.name}</span>
          <button className="admin-logout" onClick={logout}>Log Out</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
          👟 Products ({products.length})
        </button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          📦 Orders ({orders.length})
        </button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>
          ✉️ Messages ({messages.filter((m) => !m.read).length} new)
        </button>
      </div>

      {/* ===== PRODUCTS TAB ===== */}
      {tab === 'products' && (
        <>
          {prodError && <p className="admin-error">{prodError}</p>}
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <h3>{editingId ? '✏️ Edit Shoe' : '➕ Add a New Shoe'}</h3>
            <div className="admin-form-grid">
              <label>Name <input name="name" value={form.name} onChange={handleChange} required /></label>
              <label>Price (Rs) <input name="price" type="number" step="1" min="0" value={form.price} onChange={handleChange} required /></label>
              <label className="admin-full-width">
                Product Photo
                <div className="admin-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span className="admin-upload-status">Uploading...</span>}
                  {uploadError && <span className="admin-upload-error">{uploadError}</span>}
                  {form.image && (
                    <img src={form.image} alt="Preview" className="admin-image-preview" />
                  )}
                </div>
              </label>
              <label>Category <input name="category" value={form.category} onChange={handleChange} placeholder="Sneakers, Casual..." /></label>
              <label>Stock <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} /></label>
              <label>Sizes <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="e.g. 7, 8, 9, 10" /></label>
              <label>Discount % <input name="discountPercent" type="number" min="0" max="90" value={form.discountPercent} onChange={handleChange} placeholder="0" /></label>
            </div>
            <label className="admin-full-width">
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
            </label>
            <div className="admin-form-actions">
              <button type="submit">{editingId ? 'Save Changes' : 'Add Shoe'}</button>
              {editingId && <button type="button" className="admin-cancel" onClick={resetForm}>Cancel</button>}
            </div>
          </form>

          <h3>Current Inventory ({products.length})</h3>
          {prodLoading ? <p>Loading...</p> : (
            <table className="admin-product-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.image} alt={p.name} className="admin-thumb" /></td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{formatPKR(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button onClick={() => handleEdit(p)}>Edit</button>
                      <button className="admin-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ===== ORDERS TAB ===== */}
      {tab === 'orders' && (
        <>
          {ordersError && <p className="admin-error">{ordersError}</p>}
          <h3>All Orders ({orders.length})</h3>
          {ordersLoading ? <p>Loading...</p> : orders.length === 0 ? (
            <p style={{ color: '#aaa' }}>No orders yet.</p>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <div className="admin-order-card" key={order._id}>
                  <div className="admin-order-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                    <div className="admin-order-id">
                      <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                      <span className="admin-order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="admin-order-customer">{order.customer.name} — {order.customer.phone}</div>
                    <div className="admin-order-total">{formatPKR(order.total)}</div>
                    <div className="admin-order-payment">
                      {order.paymentMethod === 'cod' ? '🚚 COD' : '💳 Card'}
                    </div>
                    <select
                      className="admin-status-select"
                      value={order.status}
                      style={{ borderColor: STATUS_COLORS[order.status] }}
                      onChange={(e) => { e.stopPropagation(); handleStatusChange(order._id, e.target.value); }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      className="admin-delete"
                      onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order._id); }}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Delete
                    </button>
                    <span className="admin-order-toggle">{expandedOrder === order._id ? '▲' : '▼'}</span>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="admin-order-details">
                      <div className="admin-order-cols">
                        <div>
                          <h5>📍 Delivery</h5>
                          <p>{order.customer.address}, {order.customer.city}</p>
                          <p>📧 {order.customer.email}</p>
                          <p>📞 {order.customer.phone}</p>
                          {order.notes && <p>📝 {order.notes}</p>}
                        </div>
                        <div>
                          <h5>🛍 Items</h5>
                          {order.items.map((item, i) => (
                            <div className="admin-order-item" key={i}>
                              {item.image && <img src={item.image} alt={item.name} />}
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPKR(item.price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="admin-order-item-total">
                            Total: <strong>{formatPKR(order.total)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== MESSAGES TAB ===== */}
      {tab === 'messages' && (
        <>
          {messagesError && <p className="admin-error">{messagesError}</p>}
          <h3>Contact Messages ({messages.length})</h3>
          {messagesLoading ? <p>Loading...</p> : messages.length === 0 ? (
            <p style={{ color: '#aaa' }}>No messages yet.</p>
          ) : (
            <div className="admin-messages-list">
              {messages.map((m) => (
                <div className={`admin-message-card ${m.read ? '' : 'unread'}`} key={m._id}>
                  <div className="admin-message-top">
                    <div>
                      <strong>{m.name}</strong>
                      {!m.read && <span className="admin-message-badge">NEW</span>}
                      <div className="admin-message-email">{m.email}</div>
                    </div>
                    <span className="admin-message-date">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  {m.subject && <div className="admin-message-subject">{m.subject}</div>}
                  <p className="admin-message-body">{m.message}</p>
                  <div className="admin-message-actions">
                    {!m.read && (
                      <button onClick={() => handleMarkRead(m._id)}>Mark as Read</button>
                    )}
                    <a href={`mailto:${m.email}`} className="admin-message-reply">Reply by Email</a>
                    <button className="admin-delete" onClick={() => handleDeleteMessage(m._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
