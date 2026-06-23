import React from 'react';
import Products from '../components/Products';

function Shop() {
  return (
    <section id="shop" style={{ paddingTop: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Our Products</h2>
      <p style={{ textAlign: 'center' }}>Browse our full collection of shoes.</p>
      <Products />
    </section>
  );
}

export default Shop;
