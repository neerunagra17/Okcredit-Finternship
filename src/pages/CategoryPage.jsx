import React from 'react';
import { useDailyPrices } from '@/hooks/useDailyPrices';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';
import CartSidebar from '@/components/layout/CartSidebar';
import { useParams } from 'react-router-dom';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { products, timeLeftUntilTomorrow } = useDailyPrices();
  const { addToCart } = useCart();

  // Normalize category names for matching
  const filteredProducts = products.filter(p => {
    if (categoryId === 'wiring') return p.category === 'Wiring';
    if (categoryId === 'switches') return p.category === 'Switches';
    return true; // Fallback
  });

  const categoryTitles = {
    wiring: 'Wiring & Cables',
    switches: 'Switches & Outlets'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">{categoryTitles[categoryId] || 'Products'}</h2>
            <p className="text-slate-500 font-medium">Market prices are updated daily at midnight.</p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              No products found in this category.
            </div>
          ) : (
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
          )}
        </div>
        
        <CartSidebar />
      </div>
    </div>
  );
}
