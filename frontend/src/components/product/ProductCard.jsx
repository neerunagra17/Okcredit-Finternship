import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, StarHalf, Check, Lock } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { Link } from 'react-router-dom';
import ProductPricing from './ProductPricing';

export default function ProductCard({ product }) {
  const { isMarketOpen, timeLeftStr } = useMarket();
  const currentPrice = product.basePrice; 
  const isVolatile = product.volatility > 0;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} className="fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} size={14} className="fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={14} className="text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden transition-all duration-300 border-slate-200 bg-white rounded-2xl group ${!isMarketOpen ? 'opacity-90 grayscale-[30%]' : 'hover:shadow-xl hover:border-slate-300'}`}>
      
      {/* Image Container */}
      <div className="h-56 w-full overflow-hidden bg-white relative border-b border-slate-100 flex items-center justify-center p-4">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <img src={product.image} alt={product.name} className={`w-full h-full object-cover rounded-md transition-transform duration-700 ${isMarketOpen ? 'group-hover:scale-105' : ''}`} />
        </Link>
        
        {product.isBestSeller && isMarketOpen && (
          <div className="absolute top-0 left-0 z-20 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl shadow-md">
            Best Seller
          </div>
        )}
        
        {isVolatile && (
          <div className="absolute top-2 right-2 z-20">
            {isMarketOpen ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 shadow-sm border border-blue-200">
                Today's Market Rate
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-slate-800 text-slate-100 shadow-sm border border-slate-700 flex items-center gap-1.5 py-1">
                <Lock size={12} /> Market Closed
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col p-5 pt-4">
        <div className="mb-3">
          <Link to={`/product/${product.id}`}>
            <CardTitle className="text-lg font-bold leading-snug line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
              {product.name}
            </CardTitle>
          </Link>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex">{renderStars()}</div>
            <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">{product.reviews.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mb-3">
          <ProductPricing 
            currentPrice={currentPrice} 
            mrp={product.mrp} 
            isMarketOpen={isMarketOpen} 
          />
        </div>
        
        <div className={`flex flex-col gap-1 text-sm mb-4 ${!isMarketOpen ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-1">
            <Check size={16} className="text-orange-500 shrink-0" />
            <span className="text-slate-700 font-medium italic"><span className="font-extrabold text-teal-700 not-italic">Volt</span>Fulfilled</span>
          </div>
          <div className="text-slate-700 text-sm">
            FREE delivery <span className="font-bold">{product.deliveryDate}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="h-10 mb-3">
            {isVolatile ? (
              isMarketOpen ? (
                <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg w-full justify-center shadow-inner transition-all">
                  <Clock size={18} className="text-amber-600" />
                  <span className="font-semibold tracking-wide">Order cutoff in: <span className="text-amber-900 tabular-nums font-bold">{timeLeftStr}</span></span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg w-full justify-center shadow-inner transition-all">
                  <Clock size={16} className="text-slate-400" />
                  <span className="font-medium tracking-wide">Prices update in: <span className="text-slate-900 tabular-nums font-bold">{timeLeftStr}</span></span>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Fixed standard price
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-5 px-5">
        <Link 
          to={`/product/${product.id}`}
          className="w-full font-bold transition-all duration-200 py-3 flex items-center justify-center text-md rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-[0.98]"
        >
          View Product
        </Link>
      </CardFooter>
    </Card>
  );
}
