import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <Package className="text-blue-500 transition-transform group-hover:scale-110" size={24} />
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">VoltCommerce</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The leading B2B marketplace for raw materials and electrical supplies. Live daily pricing guarantees you the best market rates.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/wiring" className="hover:text-blue-400 transition-colors">Wiring & Cables</Link></li>
              <li><Link to="/category/switches" className="hover:text-blue-400 transition-colors">Switches & Outlets</Link></li>
              <li><Link to="/deals" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-orange-500">🔥</span> Daily Deals</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Price Guarantee</Link></li>
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} VoltCommerce. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
