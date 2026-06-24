import React, { useState } from 'react';
import { useLivePrices } from '@/hooks/useLivePrices';
import ProductCard from '@/components/ProductCard';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

function App() {
  const products = useLivePrices();
  const [cart, setCart] = useState([]);

  const handleAddToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    toast.success(`${item.name} added to cart at $${item.currentPrice.toFixed(2)}`);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.currentPrice, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold tracking-tight">VoltCommerce</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="relative">
              <ShoppingCart size={20} className="mr-2" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Featured Materials</h2>
              <p className="text-slate-500">Live market prices updated every 5 seconds.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
          
          <aside className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={20} /> Order Summary
              </h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="max-h-96 overflow-y-auto pr-2 flex flex-col gap-3">
                    {cart.map(item => (
                      <div key={item.cartId} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate" title={item.name}>{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Locked at ${item.currentPrice.toFixed(2)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFromCart(item.cartId)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 shrink-0">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4 font-bold text-lg">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <Button className="w-full font-bold" size="lg" onClick={() => toast.success("Checkout successful! (Simulated)")}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
