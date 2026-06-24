import React from 'react';

export default function ProductPricing({ currentPrice, mrp, isMarketOpen }) {
  const discountPercent = Math.max(0, Math.round(((mrp - currentPrice) / mrp) * 100));

  return (
    <div className={!isMarketOpen ? 'opacity-60' : ''}>
      <div className="flex items-center gap-2 mb-1">
        {isMarketOpen && <span className="text-red-600 font-semibold text-sm">-{discountPercent}%</span>}
        <span className="text-slate-500 text-xs line-through">M.R.P: ₹{mrp.toFixed(2)}</span>
      </div>
      
      <div className="text-3xl font-extrabold tracking-tight flex items-center gap-1">
        <span className="text-sm font-semibold relative top-1">₹</span>
        <span>{currentPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
