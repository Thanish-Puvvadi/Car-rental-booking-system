import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Car className="w-6 h-6 text-amber-500" />
              <div className="flex flex-col">
                <span className="text-md font-extrabold tracking-wider text-white uppercase leading-none">
                  Manivtha
                </span>
                <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">
                  Tours & Travels
                </span>
              </div>
            </Link>
            <p className="text-sm">
              Providing premium car rental experiences since 2018. Affordable pricing, well-maintained fleets, and professional drivers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/fleet" className="hover:text-amber-500 transition-colors">Our Fleet</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-500 transition-colors">Services Offered</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-500 transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-white font-bold mb-4">Business Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday - Saturday: 8:00 AM - 10:00 PM</li>
              <li>Sunday: 9:00 AM - 6:00 PM</li>
              <li>Emergency Support: 24/7 Available</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Main Road, near Metro Station, City Hub, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>bookings@manivtha.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Manivtha Tours & Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
