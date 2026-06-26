import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatPKR } from '../utils/currency';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const SHIPPING = cartItems.length > 0 ? 200 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING;

  const handleBuyNow = (item) => {
    navigate('/checkout', {
      state: {
        buyNow: { id: item.id, name: item.name, price: item.price, img: item.img, quantity: item.quantity },
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any shoes yet.</p>
        <Link to="/shop" className="cart-shop-btn">Browse Shoes</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h2>Your Cart</h2>
        <span className="cart-item-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-panel">
          {cartItems.map((item) => (
            <div className="cart-card" key={item.id}>
              <img src={item.img} alt={item.name} className="cart-card-img" />
              <div className="cart-card-info">
                <h4>{item.name}</h4>
                <p className="cart-card-price">{formatPKR(item.price)} each</p>
                <div className="cart-qty-row">
                  <div className="cart-qty-controls">
                    <button onClick={() => decrementQuantity(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.id)}>+</button>
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                    🗑 Remove
                  </button>
                  <button className="cart-buy-now-btn" onClick={() => handleBuyNow(item)}>
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
              <div className="cart-card-subtotal">
                {formatPKR(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary-panel">
          <h3>Order Summary</h3>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>{formatPKR(SHIPPING)}</span>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
          <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
            Checkout All Items →
          </button>
          <Link to="/shop" className="cart-continue-link">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
