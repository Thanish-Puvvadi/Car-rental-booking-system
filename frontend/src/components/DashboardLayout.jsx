import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Car,
  Users,
  Compass,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  UserCheck
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define menu items by roles
  const menuItems = [
    {
      name: 'Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'driver_coordinator', 'accounts'],
    },
    {
      name: 'Vehicles',
      path: '/admin/vehicles',
      icon: Car,
      roles: ['admin'],
    },
    {
      name: 'Drivers',
      path: '/admin/drivers',
      icon: UserCheck,
      roles: ['admin', 'driver_coordinator'],
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users,
      roles: ['admin'],
    },
    {
      name: 'Bookings',
      path: '/admin/bookings',
      icon: Compass,
      roles: ['admin', 'driver_coordinator', 'accounts'],
    },
    {
      name: 'Payments',
      path: '/admin/payments',
      icon: CreditCard,
      roles: ['admin', 'accounts'],
    },
    {
      name: 'Reports & Analytics',
      path: '/admin/reports',
      icon: BarChart3,
      roles: ['admin', 'accounts'],
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  // Filter items matching user role
  const activeMenuItems = menuItems.filter((item) => item.roles.includes(user?.role));

  const roleLabel = {
    admin: 'Administrator',
    driver_coordinator: 'Driver Coordinator',
    accounts: 'Accounts Department',
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-400 select-none">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
          <Car className="w-6 h-6 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-wider text-white uppercase leading-none">
              Manivtha
            </span>
            <span className="text-xxs font-bold text-amber-500 tracking-widest uppercase">
              Staff Portal
            </span>
          </div>
        </div>

        {/* User Badging */}
        <div className="p-4 mx-4 my-4 bg-slate-800/40 rounded-xl border border-slate-800/50">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xxs text-amber-500 font-bold uppercase tracking-wider mt-1">
            {roleLabel[user?.role] || 'Staff'}
          </p>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {activeMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/15'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-800 hover:text-white transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Dark Mode
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl hover:bg-red-950/30 text-red-500 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Slider */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Box */}
          <div className="relative w-64 bg-slate-900 border-r border-slate-850 flex flex-col text-slate-400 animate-fade-in z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-amber-500" />
                <span className="text-sm font-extrabold text-white tracking-wider uppercase">
                  Manivtha
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 mx-4 my-4 bg-slate-800/40 rounded-xl border border-slate-800/50">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xxs text-amber-500 font-bold uppercase tracking-wider mt-1">
                {roleLabel[user?.role] || 'Staff'}
              </p>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {activeMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/15'
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-800 hover:text-white transition-all"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl hover:bg-red-950/30 text-red-500 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeMenuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:text-amber-500 dark:hover:border-amber-500 dark:hover:text-amber-500 text-slate-650 dark:text-slate-300 rounded-lg transition-all"
            >
              Public Home
            </Link>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 dark:text-slate-500 leading-none">Logged in as</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
