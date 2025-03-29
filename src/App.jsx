import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/navbar/Navbar';
import Auth from './pages/auth/Auth';
import AdminDashboard from './pages/admin/dashboard/Dashboard';
import AdminCustomer from './pages/admin/customer/Customer';
import PWABadge from './PWABadge';
import Hero from './components/ui/custom/Hero';
import Header from './components/ui/custom/Header';
import Home from './pages/Home';
import Hotelpage from './pages/hotel/hotel-page';

function App() {
  return (
    <>
      {/* <Header></Header>
      <Home></Home> */}

      <Hotelpage />
      <ToastContainer />
      <PWABadge />
    </>
  );
}

export default App;