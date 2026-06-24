import React from 'react';
import { useDailyPrices } from '@/hooks/useDailyPrices';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';
import CartSidebar from '@/components/layout/CartSidebar';
import { Badge } from '@/components/ui/badge';

export default function DealsPage() {
  const { products, timeLeftUntilTomorrow } = useDailyPrices();
  const { addToCart } = useCart();

  // For deals, let's just pick items that have a discount or are best sellers
  const filteredProducts = products.filter(p => p.isBestSeller || (p.mrp > p.basePrice));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 w-full bg-orange-100 border border-orange-200 rounded-2xl p-8 flex items-center justify-between shadow-sm">
        <div>
          <Badge className="bg-orange-500 text-white mb-2 hover:bg-orange-600 border-none">Limited Time</Badge>
          <h2 className="text-3xl font-extrabold text-orange-900 tracking-tight">Daily Deals 🔥</h2>
          <p className="text-orange-800 font-medium mt-1">Grab these discounted materials before prices update tonight.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                timeLeftUntilTomorrow={timeLeftUntilTomorrow}
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        </div>
        
        <CartSidebar />
      </div>
    </div>
  );
}
