import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDailyPrices } from '@/hooks/useDailyPrices';
import { useCart } from '@/context/CartContext';
import { useMarket } from '@/context/MarketContext';
import ProductPricing from '@/components/product/ProductPricing';
import ProductAction from '@/components/product/ProductAction';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, StarHalf, Check, ShieldCheck, Truck, RotateCcw, Minus, Plus } from 'lucide-react';

export default function ProductPage() {
  const { productId } = useParams();
  const { products } = useDailyPrices();
  const { addToCart } = useCart();
  const { isMarketOpen } = useMarket();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === parseInt(productId) || p.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">The item you are looking for might have been removed from the inventory.</p>
        <Link to="/" className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-8 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50">
          Back to Storefront
        </Link>
      </div>
    );
  }

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating || 4.5);
    const hasHalfStar = (product.rating || 4.5) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} size={16} className="fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-fit">
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-slate-50 border-r border-slate-100">
            <div className={`relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 ${!isMarketOpen ? 'grayscale opacity-80' : ''}`}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.isBestSeller && isMarketOpen && (
                <div className="absolute top-4 left-4 z-20 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md">
                  Best Seller
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-2">
              <Badge variant="outline" className="text-slate-500 mb-3">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">{renderStars()}</div>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer font-medium">{(product.reviews || 128).toLocaleString()} ratings</span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <ProductPricing 
                currentPrice={product.currentPrice || product.basePrice} 
                mrp={product.mrp} 
                isMarketOpen={isMarketOpen} 
              />
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-semibold text-slate-700">Quantity</span>
                  <div className={`flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white ${!isMarketOpen ? 'opacity-60 pointer-events-none' : ''}`}>
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <ProductAction 
                  isMarketOpen={isMarketOpen} 
                  onAddToCart={() => {
                    addToCart({ ...product, currentPrice: product.currentPrice || product.basePrice }, quantity);
                    setQuantity(1); // reset after adding
                  }} 
                />
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full text-blue-600">
                  <Check size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block"><span className="text-teal-700 italic">Volt</span>Fulfilled</span>
                  Dispatched from and sold by VoltCommerce.
                </div>
              </div>
              
              {/* Guarantee 1: Delivery */}
              {product.deliveryDate && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-100 p-1.5 rounded-full text-slate-600">
                    <Truck size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Free Delivery</span>
                    Guaranteed delivery by <span className="font-bold">{product.deliveryDate}</span>.
                  </div>
                </div>
              )}

              {/* Guarantee 2: Warranty */}
              {(product.warranty || '1 Year Warranty') && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-100 p-1.5 rounded-full text-slate-600">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{product.warranty || '1 Year Warranty'}</span>
                    Covers all manufacturing defects.
                  </div>
                </div>
              )}

              {/* Guarantee 3: Returns */}
              {(product.returnPolicy || '30 Day Returns') && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-100 p-1.5 rounded-full text-slate-600">
                    <RotateCcw size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{product.returnPolicy || '30 Day Returns'}</span>
                    Return this item for a full refund within the designated period.
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
