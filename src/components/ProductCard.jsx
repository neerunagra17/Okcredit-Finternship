import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, YAxis } from 'recharts';
import { Timer, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [priceLocked, setPriceLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const currentPrice = product.history[product.history.length - 1];
  const previousPrice = product.history.length > 1 ? product.history[product.history.length - 2] : currentPrice;
  const isVolatile = product.volatility > 0;
  
  const priceTrend = currentPrice > previousPrice ? 'up' : currentPrice < previousPrice ? 'down' : 'stable';

  const chartData = product.history.map((price, index) => ({ index, price }));

  const handleAddToCart = () => {
    if (isVolatile && !priceLocked) {
      setPriceLocked(true);
      setTimeLeft(15); // 15 seconds lock
    }
    onAddToCart({ ...product, currentPrice, priceLockedAt: isVolatile ? Date.now() : null });
  };

  useEffect(() => {
    let timer;
    if (priceLocked && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setPriceLocked(false);
    }
    return () => clearInterval(timer);
  }, [priceLocked, timeLeft]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200">
      <div className="h-48 overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold leading-tight">{product.name}</CardTitle>
          {isVolatile && <Badge variant="secondary" className="bg-amber-100 text-amber-800 animate-pulse">Market Price</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              ${currentPrice.toFixed(2)}
              {isVolatile && (
                <span className={`text-sm flex items-center ${priceTrend === 'up' ? 'text-red-500' : priceTrend === 'down' ? 'text-green-500' : 'text-slate-400'}`}>
                  {priceTrend === 'up' ? <TrendingUp size={16} /> : priceTrend === 'down' ? <TrendingDown size={16} /> : <Minus size={16} />}
                </span>
              )}
            </div>
          </div>
          
          {isVolatile && (
            <div className="w-24 h-12">
              <LineChart width={96} height={48} data={chartData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line type="monotone" dataKey="price" stroke={priceTrend === 'down' ? '#22c55e' : priceTrend === 'up' ? '#ef4444' : '#64748b'} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </div>
          )}
        </div>
        
        {priceLocked && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md mb-2">
            <Timer size={16} className="animate-pulse" />
            <span>Price locked for {timeLeft}s</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full font-semibold transition-transform active:scale-95" variant={priceLocked ? "secondary" : "default"}>
          {priceLocked ? "Add Another" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
