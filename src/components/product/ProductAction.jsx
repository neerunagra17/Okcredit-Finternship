import React from 'react';
import { Button } from '@/components/ui/button';

export default function ProductAction({ isMarketOpen, onAddToCart }) {
  return (
    <Button 
      disabled={!isMarketOpen}
      onClick={onAddToCart} 
      className={`w-full font-bold transition-all duration-200 py-6 text-md rounded-xl shadow-md ${isMarketOpen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-[0.98]' : 'bg-slate-200 text-slate-500 hover:bg-slate-200 opacity-80'}`} 
      variant={isMarketOpen ? "default" : "secondary"}
    >
      {isMarketOpen ? "Add to Cart" : "Market Closed"}
    </Button>
  );
}
