import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { cart } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600 transition-colors";
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <Package className="text-blue-600 transition-transform group-hover:scale-110" size={28} />
          <h1 className="text-xl font-extrabold tracking-tight hidden sm:block group-hover:text-blue-700 transition-colors">VoltCommerce</h1>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
          <Link to="/category/wiring" className={isActive('/category/wiring')}>Wiring & Cables</Link>
          <Link to="/category/switches" className={isActive('/category/switches')}>Switches</Link>
          <Link to="/category/appliances" className={isActive('/category/appliances')}>Appliances</Link>
          <Link to="/category/lighting" className={isActive('/category/lighting')}>Lighting</Link>
          <Link to="/deals" className={`${isActive('/deals')} flex items-center gap-1`}>
            <span className="text-orange-500">🔥</span> Daily Deals
          </Link>
          <Link to="/support" className={isActive('/support')}>Support</Link>
        </nav>
        
        <div className="flex-1 max-w-md relative hidden xl:block ml-auto lg:ml-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products, SKUs..." 
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto xl:ml-0">
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3 mr-2 border-r border-slate-200 pr-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-blue-50/50 hidden lg:flex">
                    Admin Portal
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="max-w-[100px] truncate">{user?.username || 'User'}</span>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 mr-2">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Log In</Link>
              <Link to="/signup">
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-4 h-8 text-xs">Sign Up</Button>
              </Link>
            </div>
          )}

          <Link to="/checkout">
            <Button variant="outline" className="relative rounded-xl border-slate-300 hover:bg-slate-50 h-10 px-3 sm:px-4">
              <ShoppingCart size={20} className="sm:mr-2" />
              <span className="font-bold hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
        
      </div>
    </header>
  );
}
