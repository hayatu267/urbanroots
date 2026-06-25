import React, { useState } from 'react';
import api from '../api';
import '../styles/Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: '' });
    try {
      await api.post('/contact', form);
      setStatus({ submitting: false, success: true, error: '' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Questions, feedback, or just want to say hi? Send us a message below.</p>
      </div>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          {status.success && (
            <p className="contact-success">✓ Your message has been sent. We'll get back to you soon!</p>
          )}
          {status.error && <p className="contact-error">{status.error}</p>}

          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Subject
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows={6}
              required
            />
          </label>

          <button type="submit" disabled={status.submitting}>
            {status.submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="contact-info">
          <h3>Other ways to reach us</h3>
          <p>
            <strong>Email:</strong><br />
            <a href="mailto:hello@urbanroots.example">hello@urbanroots.example</a>
          </p>
          <p>
            <strong>Follow us:</strong><br />
            Instagram · TikTok · YouTube
          </p>
          <p className="contact-note">
            We typically respond within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
