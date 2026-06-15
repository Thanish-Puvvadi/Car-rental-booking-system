import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Car, Sun, Moon, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'driver_coordinator':
        return '/admin/dashboard'; // Both use DashboardLayout with role customized links
      case 'accounts':
        return '/admin/dashboard';
      default:
        return '/dashboard'; // Customer dashboard
    }
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-indigo-650/10 dark:bg-amber-600/10 group-hover:bg-amber-600/20 transition-all duration-300 text-amber-500">
              <Car className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-md font-extrabold tracking-wider text-indigo-950 dark:text-white uppercase leading-none">
                Manivtha
              </span>
              <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">
                Tours & Travels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-slate-600 hover:text-amber-500 dark:text-slate-350 dark:hover:text-amber-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons & Theme Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-amber-500 dark:text-slate-200 dark:hover:text-amber-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 mt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full justify-center px-4 py-2.5 text-base font-semibold text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full justify-center px-4 py-2.5 text-base font-semibold text-red-500 border border-red-200 hover:bg-red-50 dark:border-red-950/30 dark:hover:bg-red-950/20 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center px-4 py-2.5 text-base font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
