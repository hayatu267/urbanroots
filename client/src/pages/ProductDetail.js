import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';
import { formatPKR } from '../utils/currency';
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

  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const { data } = await api.post(`/products/${id}/reviews`, reviewForm);
      setProduct(data);
      setReviewForm({ name: '', rating: 5, comment: '' });
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit your review.');
    } finally {
      setReviewSubmitting(false);
    }
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

          {product.numReviews > 0 && (
            <div className="pd-rating-summary">
              <span className="pd-stars">{'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))}</span>
              <span className="pd-rating-text">{product.avgRating.toFixed(1)} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})</span>
            </div>
          )}

          <div className="pd-price-row">
            {hasDiscount ? (
              <>
                <span className="pd-price-old">{formatPKR(product.price)}</span>
                <span className="pd-price-new">{formatPKR(finalPrice)}</span>
              </>
            ) : (
              <span className="pd-price-new">{formatPKR(product.price)}</span>
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

      {/* ===== REVIEWS & FEEDBACK ===== */}
      <div className="pd-reviews-section">
        <h2 className="pd-reviews-title">Customer Feedback</h2>

        <form className="pd-review-form" onSubmit={handleReviewSubmit}>
          {reviewSuccess && <p className="pd-review-success">✓ Thanks for your feedback!</p>}
          {reviewError && <p className="pd-review-error">{reviewError}</p>}

          <div className="pd-review-form-row">
            <label>
              Your Name
              <input
                type="text"
                name="name"
                value={reviewForm.name}
                onChange={handleReviewChange}
                placeholder="e.g. Ali Raza"
                required
              />
            </label>

            <label>
              Your Rating
              <div className="pd-star-picker">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pd-star-btn ${n <= reviewForm.rating ? 'filled' : ''}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                    aria-label={`${n} star`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </label>
          </div>

          <label>
            Your Comment
            <textarea
              name="comment"
              value={reviewForm.comment}
              onChange={handleReviewChange}
              placeholder="What did you think of this product?"
              rows={3}
              required
            />
          </label>

          <button type="submit" disabled={reviewSubmitting}>
            {reviewSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="pd-review-list">
          {(!product.reviews || product.reviews.length === 0) ? (
            <p className="pd-no-reviews">No reviews yet — be the first to leave feedback!</p>
          ) : (
            product.reviews.map((r) => (
              <div className="pd-review-card" key={r._id}>
                <div className="pd-review-top">
                  <strong>{r.name}</strong>
                  <span className="pd-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="pd-review-comment">{r.comment}</p>
                <span className="pd-review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
