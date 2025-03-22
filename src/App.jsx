import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Auth from './pages/auth/Auth';
import Home from './pages/home/Home';
import PWABadge from './PWABadge';

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
      <ToastContainer />
      <PWABadge />
    </>
  );
}

export default App;