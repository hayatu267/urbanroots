import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';
import { formatPKR } from '../utils/currency';

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

  const finalPrice = (product) => {
    const discount = Number(product.discountPercent) || 0;
    return discount > 0 ? product.price * (1 - discount / 100) : product.price;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: product._id, name: product.name, price: finalPrice(product), img: product.image });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/checkout', {
      state: {
        buyNow: { id: product._id, name: product.name, price: finalPrice(product), img: product.image, quantity: 1 },
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
          const hasDiscount = Number(product.discountPercent) > 0;
          return (
            <Link to={`/product/${product._id}`} className="product-card" key={product._id}>
              {/* Badge */}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="product-badge badge-low">Only {product.stock} left</span>
              )}
              {product.stock === 0 && (
                <span className="product-badge badge-out">Out of Stock</span>
              )}
              {hasDiscount && product.stock > 0 && (
                <span className="product-badge badge-discount">-{product.discountPercent}%</span>
              )}

              {/* Image */}
              <div className="product-img-wrap">
                <img src={product.image} alt={product.name} />
                <div className="product-img-overlay">
                  <button
                    className="overlay-buy-btn"
                    onClick={(e) => handleBuyNow(e, product)}
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

                {hasDiscount ? (
                  <p className="product-price">
                    <span className="price-new">{formatPKR(finalPrice(product))}</span>
                    <span className="price-old">{formatPKR(product.price)}</span>
                  </p>
                ) : (
                  <p className="product-price">{formatPKR(product.price)}</p>
                )}

                <button
                  className={`product-cart-btn ${isAdded ? 'added' : ''}`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock === 0 || isAdded}
                >
                  {isAdded ? (
                    <><span className="btn-icon">✓</span> Added to Cart!</>
                  ) : (
                    <><span className="btn-icon">🛒</span> Add to Cart</>
                  )}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Products;
