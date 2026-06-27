import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useMarket } from '@/context/MarketContext';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Lock, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, calculateTotal, clearCart } = useCart();
  const { isMarketOpen } = useMarket();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!isSubmitting && cart.length > 0) {
      if (!isMarketOpen) {
        toast.error("Checkout failed. The market has closed.");
        return;
      }
  
      setIsSubmitting(true);
      try {
        const orderData = {
          customerInfo: formData,
          items: cart,
          total: calculateTotal()
        };
  
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
  
        if (!response.ok) {
          throw new Error('Failed to place order');
        }
  
        toast.success("Order placed successfully! Thank you for shopping.");
        clearCart();
        navigate('/');
      } catch (error) {
        toast.error("An error occurred while placing your order.");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-8 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-fit">
          <ArrowLeft size={16} /> Back to Store
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">Secure Checkout</h1>
      </div>

      {!isMarketOpen && (
        <div className="bg-red-50 text-red-900 p-4 rounded-xl border border-red-200 mb-8 flex items-start gap-3 shadow-sm">
          <Lock size={24} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-lg text-red-800">Checkout Paused</h3>
            <p className="font-medium mt-1">The daily delivery cutoff has been reached. Prices are currently frozen and checkout is disabled until new market prices are published tomorrow.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Forms */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Truck className="text-blue-600" /> Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123 Hardware Lane" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="New York" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ZIP / Postal Code</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10001" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="text-blue-600" /> Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="MM/YY" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                <input type="password" maxLength="4" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="123" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
              </div>
            </div>
          </div>

        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-24 shadow-sm">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-200 pb-4">Order Summary</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.cartId} className="flex justify-between">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Qty: 1</p>
                  </div>
                  <p className="font-bold text-slate-900 shrink-0">₹{item.currentPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <Button 
              disabled={!isMarketOpen}
              onClick={handlePlaceOrder}
              className={`w-full py-6 text-lg font-bold rounded-xl flex items-center justify-center gap-2 ${isMarketOpen ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-md shadow-amber-500/20' : 'bg-slate-300 text-slate-500'}`}
            >
              <ShieldCheck size={20} />
              {isMarketOpen ? "Place Order" : "Market Closed"}
            </Button>
            
            <p className="text-xs text-slate-500 text-center mt-4 flex items-center justify-center gap-1">
              <Lock size={12} /> Secure 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
