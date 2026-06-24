import { useMarket } from '@/context/MarketContext';
import { useProducts } from '@/context/ProductContext';

export function useDailyPrices() {
  const { products } = useProducts();
  const { isMarketOpen, timeLeftStr } = useMarket();

  // The logic for fluctuating the basePrice is handled at the source if we want, 
  // but since basePrice is the current live price, we just pass the products directly.

  return { 
    products, 
    timeLeftUntilTomorrow: timeLeftStr,
    isMarketOpen 
  };
}
