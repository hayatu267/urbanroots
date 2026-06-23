import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';

function Products() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Could not load products right now.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ id: product._id, name: product.name, price: product.price, img: product.image });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleBuyNow = (product) => {
    navigate('/checkout', {
      state: {
        buyNow: { id: product._id, name: product.name, price: product.price, img: product.image, quantity: 1 },
      },
    });
  };

  return (
    <section className="products" id="products">
      <div className="products-header">
        <h3>Featured Kicks</h3>
        <p className="products-subtitle">Handpicked styles for every stride</p>
      </div>

      {loading && <p className="products-loading">Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="products-empty">No products yet — check back soon!</p>
      )}

      <div className="product-grid">
        {products.map((product) => {
          const isAdded = addedId === product._id;
          return (
            <div className="product-card" key={product._id}>
              {/* Badge */}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="product-badge badge-low">Only {product.stock} left</span>
              )}
              {product.stock === 0 && (
                <span className="product-badge badge-out">Out of Stock</span>
              )}

              {/* Image */}
              <div className="product-img-wrap">
                <img src={product.image} alt={product.name} />
                <div className="product-img-overlay">
                  <button
                    className="overlay-buy-btn"
                    onClick={() => handleBuyNow(product)}
                    disabled={product.stock === 0}
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="product-body">
                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}
                <h4 className="product-name">{product.name}</h4>
                <p className="product-price">${Number(product.price).toFixed(2)}</p>

                <button
                  className={`product-cart-btn ${isAdded ? 'added' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0 || isAdded}
                >
                  {isAdded ? (
                    <><span className="btn-icon">✓</span> Added to Cart!</>
                  ) : (
                    <><span className="btn-icon">🛒</span> Add to Cart</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Products;
