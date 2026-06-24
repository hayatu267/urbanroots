import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setProduct(null);
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      })
      .catch(() => setError('We could not find that product.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pd-page"><p className="pd-loading">Loading product...</p></div>;
  if (error || !product) {
    return (
      <div className="pd-page">
        <p className="pd-error">{error || 'Product not found.'}</p>
        <Link to="/shop" className="pd-back-link">← Back to Shop</Link>
      </div>
    );
  }

  const discount = Number(product.discountPercent) || 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? product.price * (1 - discount / 100) : product.price;
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: selectedSize ? `${product.name} (Size ${selectedSize})` : product.name,
      price: finalPrice,
      img: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        buyNow: {
          id: product._id,
          name: selectedSize ? `${product.name} (Size ${selectedSize})` : product.name,
          price: finalPrice,
          img: product.image,
          quantity: 1,
        },
      },
    });
  };

  return (
    <div className="pd-page">
      <Link to="/shop" className="pd-back-link">← Back to Shop</Link>

      <div className="pd-layout">
        <div className="pd-image-wrap">
          {hasDiscount && !outOfStock && (
            <span className="pd-badge pd-badge-discount">-{discount}%</span>
          )}
          {outOfStock && <span className="pd-badge pd-badge-out">Out of Stock</span>}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="pd-info">
          {product.category && <span className="pd-category">{product.category}</span>}
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-price-row">
            {hasDiscount ? (
              <>
                <span className="pd-price-old">${Number(product.price).toFixed(2)}</span>
                <span className="pd-price-new">${finalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="pd-price-new">${Number(product.price).toFixed(2)}</span>
            )}
          </div>

          <p className="pd-description">
            {product.description || 'No description available for this product yet.'}
          </p>

          <div className="pd-stock-row">
            {outOfStock ? (
              <span className="pd-stock pd-stock-out">Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="pd-stock pd-stock-low">Only {product.stock} left in stock</span>
            ) : (
              <span className="pd-stock pd-stock-ok">In stock ({product.stock} available)</span>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="pd-sizes">
              <span className="pd-sizes-label">Select Size</span>
              <div className="pd-size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pd-size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-actions">
            <button
              className={`pd-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={outOfStock || added}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button className="pd-buy-btn" onClick={handleBuyNow} disabled={outOfStock}>
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
