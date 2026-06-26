import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { formatPKR } from '../utils/currency';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="confirm-page">
        <h2>No order found.</h2>
        <Link to="/" className="confirm-home-btn">Go Home</Link>
      </div>
    );
  }

  const statusLabel = {
    pending: '⏳ Pending',
    confirmed: '✅ Confirmed',
    processing: '🔧 Processing',
    shipped: '🚚 Shipped',
    delivered: '📦 Delivered',
    cancelled: '❌ Cancelled',
  };

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-checkmark">✅</div>
        <h2>Order Placed!</h2>
        <p className="confirm-subtitle">
          Thank you, <strong>{order.customer.name}</strong>! We'll send updates to <strong>{order.customer.email}</strong>.
        </p>

        <div className="confirm-id">
          Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span>
        </div>

        <div className="confirm-section">
          <h4>📦 Items Ordered</h4>
          {order.items.map((item, i) => (
            <div className="confirm-item" key={i}>
              {item.image && <img src={item.image} alt={item.name} />}
              <div className="confirm-item-info">
                <span>{item.name}</span>
                <span className="confirm-item-qty">x{item.quantity}</span>
              </div>
              <span className="confirm-item-price">{formatPKR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="confirm-section confirm-totals">
          <div className="confirm-row"><span>Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
          <div className="confirm-row"><span>Shipping</span><span>{formatPKR(order.shipping)}</span></div>
          <div className="confirm-row confirm-total-row"><span>Total</span><span>{formatPKR(order.total)}</span></div>
        </div>

        <div className="confirm-section">
          <h4>📍 Delivery Details</h4>
          <p>{order.customer.address}, {order.customer.city}</p>
          <p>📞 {order.customer.phone}</p>
        </div>

        <div className="confirm-section">
          <h4>💳 Payment</h4>
          <p>{order.paymentMethod === 'cod' ? '🚚 Cash on Delivery' : '💳 Card Payment'}</p>
          <p>Status: <span className="confirm-status">{statusLabel[order.status] || order.status}</span></p>
        </div>

        <Link to="/shop" className="confirm-continue-btn">Continue Shopping →</Link>
        <Link to="/" className="confirm-home-link">Back to Home</Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
