import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './UI/Spinner';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
        <div className="p-4 bg-red-100 dark:bg-red-950/20 text-red-500 rounded-full mb-6">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
