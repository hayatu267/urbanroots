import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';
import '../styles/Checkout.css';

const emptyForm = {
  name: '', email: '', phone: '', address: '', city: '', notes: '',
};

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // If user clicked "Buy Now", a single item is passed via router state
  const buyNowItem = location.state?.buyNow || null;

  // The items we're actually checking out
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const SHIPPING = 5;
  const subtotal = checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + SHIPPING;

  if (checkoutItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCard = (e) => setCard({ ...card, [e.target.name]: e.target.value });

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Basic card validation if card selected
    if (paymentMethod === 'card') {
      if (card.number.replace(/\s/g, '').length < 16) {
        setError('Enter a valid 16-digit card number.');
        setSubmitting(false);
        return;
      }
      if (card.cvv.length < 3) {
        setError('Enter a valid CVV.');
        setSubmitting(false);
        return;
      }
    }

    const orderData = {
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
      },
      items: checkoutItems.map((i) => ({
        productId: i.id,
        name: i.name,
        image: i.img,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      shipping: SHIPPING,
      total,
      paymentMethod,
      notes: form.notes,
    };

    try {
      const { data } = await api.post('/orders', orderData);
      if (!buyNowItem) clearCart(); // only clear cart for normal checkout
      navigate('/order-confirmation', { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      {error && <p className="checkout-error">{error}</p>}

      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* Left: Form */}
        <div className="checkout-form-panel">

          {/* Contact */}
          <div className="checkout-section">
            <h3>📋 Contact Information</h3>
            <div className="checkout-grid-2">
              <label>
                Full Name
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Ahmed Ali" />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
              </label>
              <label>
                Phone Number
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+92 3XX XXXXXXX" />
              </label>
              <label>
                City
                <input name="city" value={form.city} onChange={handleChange} required placeholder="Lahore" />
              </label>
            </div>
            <label className="checkout-full">
              Street Address
              <input name="address" value={form.address} onChange={handleChange} required placeholder="House #, Street, Area" />
            </label>
            <label className="checkout-full">
              Order Notes (optional)
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Any special instructions..." />
            </label>
          </div>

          {/* Payment */}
          <div className="checkout-section">
            <h3>💳 Payment Method</h3>
            <div className="checkout-payment-options">
              <label className={`checkout-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span className="payment-icon">🚚</span>
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay when your order arrives</p>
                </div>
              </label>
              <label className={`checkout-payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span className="payment-icon">💳</span>
                <div>
                  <strong>Credit / Debit Card</strong>
                  <p>Visa, Mastercard, etc.</p>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="checkout-card-form">
                <div className="card-preview">
                  <div className="card-preview-top">
                    <span className="card-chip">▣</span>
                    <span className="card-brand">CARD</span>
                  </div>
                  <div className="card-number-display">
                    {card.number || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-preview-bottom">
                    <div>
                      <div className="card-label">Card Holder</div>
                      <div>{card.holder || 'YOUR NAME'}</div>
                    </div>
                    <div>
                      <div className="card-label">Expires</div>
                      <div>{card.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div className="checkout-grid-2">
                  <label className="checkout-full">
                    Card Number
                    <input
                      name="number"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </label>
                  <label className="checkout-full">
                    Cardholder Name
                    <input name="holder" value={card.holder} onChange={handleCard} placeholder="Ahmed Ali" />
                  </label>
                  <label>
                    Expiry Date
                    <input
                      name="expiry"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </label>
                  <label>
                    CVV
                    <input name="cvv" value={card.cvv} onChange={handleCard} type="password" maxLength={4} placeholder="•••" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary-panel">
          <h3>🧾 Order Summary</h3>
          <div className="checkout-summary-items">
            {checkoutItems.map((item) => (
              <div className="checkout-summary-item" key={item.id}>
                <img src={item.img} alt={item.name} />
                <div className="checkout-summary-item-info">
                  <span>{item.name}</span>
                  <span className="checkout-qty">x{item.quantity}</span>
                </div>
                <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-summary-row">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Shipping</span><span>${SHIPPING.toFixed(2)}</span>
          </div>
          <div className="checkout-summary-divider" />
          <div className="checkout-summary-row checkout-summary-total">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>

          <button type="submit" className="checkout-place-order-btn" disabled={submitting}>
            {submitting ? 'Placing Order...' : `Place Order · $${total.toFixed(2)}`}
          </button>
          <p className="checkout-secure-note">🔒 Your information is kept private and secure.</p>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
