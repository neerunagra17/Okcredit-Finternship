import React from 'react';
import { useDailyPrices } from '@/hooks/useDailyPrices';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';
import { useParams } from 'react-router-dom';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { products, timeLeftUntilTomorrow } = useDailyPrices();
  const { addToCart } = useCart();

  // Normalize category names for matching
  const filteredProducts = products.filter(p => {
    if (categoryId === 'wiring') return p.category === 'Wiring';
    if (categoryId === 'switches') return p.category === 'Switches';
    if (categoryId === 'appliances') return p.category === 'Appliances';
    if (categoryId === 'lighting') return p.category === 'Lighting';
    return true; // Fallback
  });

  const categoryTitles = {
    wiring: 'Wiring & Cables',
    switches: 'Switches & Outlets',
    appliances: 'Home Appliances',
    lighting: 'Lighting Solutions'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">{categoryTitles[categoryId] || 'Products'}</h2>
            <p className="text-slate-500 font-medium">Market prices are updated daily at midnight.</p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
