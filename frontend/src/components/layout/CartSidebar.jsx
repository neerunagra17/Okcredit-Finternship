import React from 'react';
import { ShoppingCart, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useMarket } from '@/context/MarketContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { cart, removeFromCart, calculateTotal } = useCart();
  const { isMarketOpen } = useMarket();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-200 p-6 sticky top-24">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
          <ShoppingCart size={20} className="text-blue-600" /> Order Summary
        </h3>
        
        {cart.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <ShoppingCart size={32} className="text-slate-300" />
            </div>
            <p className="font-medium text-slate-500">Your cart is empty</p>
            <p className="text-sm mt-1">Add items to lock in today's price</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Market Closed Banner in Cart */}
            {!isMarketOpen && (
              <div className="bg-red-50 text-red-900 p-4 rounded-xl text-sm border border-red-200 flex flex-col gap-1.5 shadow-sm mb-2">
                <span className="font-extrabold flex items-center gap-1.5 text-red-700">
                  <Lock size={16} /> Checkout Paused
                </span>
                <span className="font-medium leading-relaxed">The delivery cutoff has been reached. Checkout is disabled until new prices are published tomorrow.</span>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto pr-2 flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.cartId} className={`flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 transition-all ${!isMarketOpen ? 'opacity-60' : 'shadow-sm hover:border-slate-200'}`}>
                  <div className="overflow-hidden flex-1 pr-2">
                    <p className="text-sm font-bold truncate text-slate-800" title={item.name}>{item.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Today: <span className="text-slate-900 font-bold">₹{item.currentPrice.toFixed(2)}</span>
                    </p>
                  </div>
                  <Button disabled={!isMarketOpen} variant="ghost" size="sm" onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 shrink-0 h-8 rounded-lg">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            
            {cart.some(item => item.volatility > 0) && isMarketOpen && (
              <div className="bg-amber-50/80 text-amber-900 p-4 rounded-xl text-xs border border-amber-200 flex flex-col gap-1.5 shadow-sm">
                <span className="font-extrabold flex items-center gap-1.5 text-amber-700"><span className="text-base">⚠️</span> Price Guarantee</span>
                <span className="font-medium leading-relaxed">Prices in your cart are locked until the daily cutoff. Check out before the market closes.</span>
              </div>
            )}

            <div className="pt-4 mt-2 border-t border-slate-200 border-dashed">
              <div className="flex justify-between items-center mb-5">
                <span className="text-slate-500 font-semibold">Total</span>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">₹{calculateTotal()}</span>
              </div>
              <Button 
                disabled={!isMarketOpen}
                className={`w-full font-extrabold py-6 text-lg rounded-xl shadow-lg ${isMarketOpen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25' : 'bg-slate-200 text-slate-500 shadow-none'}`} 
                onClick={handleCheckout}
              >
                {isMarketOpen ? "Proceed to Checkout" : "Market Closed"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
