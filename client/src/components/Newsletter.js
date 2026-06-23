// client/src/components/Newsletter.js
import React, { useState } from 'react';
import api from '../api';
import '../styles/main.css'; // Make sure this line exists to apply your CSS

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubscribe = async () => {
    try {
      await api.post('/newsletter', { email });
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="newsletter">
      <h2>Subscribe to Our Newsletter</h2>
      <p>Get the latest updates and offers.</p>
      <div className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
      {status === 'success' && (
        <p className="success-message">Subscribed successfully!</p>
      )}
      {status === 'error' && (
        <p className="error-message">Error connecting to server.</p>
      )}
    </div>
  );
}

export default Newsletter;
