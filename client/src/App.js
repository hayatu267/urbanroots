import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/main.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import Products from './components/Products';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <Products />
      <Newsletter />
    </>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
