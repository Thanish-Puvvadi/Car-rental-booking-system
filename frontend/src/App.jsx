import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import VehicleDetails from './pages/VehicleDetails';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import MyBookings from './pages/Customer/MyBookings';
import BookingDetails from './pages/Customer/BookingDetails';
import Profile from './pages/Customer/Profile';
import Notifications from './pages/Customer/Notifications';
import OperationsDashboard from './pages/OperationsDashboard';
import { useAuth } from './context/AuthContext';

const DashboardSelector = () => {
  const { user } = useAuth();
  if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }
  return <OperationsDashboard />;
};

// Shared Layout Wrapper for Public and Customer Pages
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/fleet" element={<MainLayout><Fleet /></MainLayout>} />
            <Route path="/vehicles/:id" element={<MainLayout><VehicleDetails /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

            {/* PROTECTED DASHBOARD ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer', 'driver_coordinator', 'accounts']}>
                  <MainLayout><DashboardSelector /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MainLayout><MyBookings /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MainLayout><BookingDetails /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MainLayout><Profile /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MainLayout><Notifications /></MainLayout>
                </ProtectedRoute>
              }
            />


            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
