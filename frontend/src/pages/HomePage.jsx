import React from 'react';
import { useDailyPrices } from '@/hooks/useDailyPrices';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { products, timeLeftUntilTomorrow } = useDailyPrices();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HERO BANNER */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-8 md:p-12 text-white mb-10 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 pointer-events-none transition-transform duration-1000 group-hover:scale-105">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/40 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border border-blue-400/30 mb-5 px-3 py-1 font-semibold tracking-wide">Daily Market Update</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Copper Prices Hit a <span className="text-amber-400 drop-shadow-md">30-Day Low</span></h2>
          <p className="text-blue-100/90 text-lg md:text-xl mb-8 leading-relaxed font-medium">Stock up on essential wiring materials today. Prices are guaranteed through midnight.</p>
          <Button asChild className="bg-amber-400 hover:bg-amber-500 text-indigo-950 font-extrabold px-8 py-6 rounded-xl shadow-lg hover:shadow-amber-500/20 border-none text-lg transition-all hover:-translate-y-0.5">
            <Link to="/category/wiring">Shop Top Materials</Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Featured Materials</h2>
            <p className="text-slate-500 font-medium">Market prices are updated daily at midnight.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
