export const mockProducts = [
  {
    id: '1',
    name: 'Copper Wire 10 AWG (per meter)',
    basePrice: 12.50,
    mrp: 18.00,
    volatility: 0.05, // 5% max swing per tick
    history: [12.0, 12.2, 12.1, 12.4, 12.5],
    category: 'Wiring',
    image: 'https://picsum.photos/seed/copperwire/400/300',
    rating: 4.6,
    reviews: 1284,
    stock: 5,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
  },
  {
    id: '2',
    name: 'Aluminum Cable 4/0 (per meter)',
    basePrice: 8.20,
    mrp: 12.00,
    volatility: 0.03,
    history: [8.0, 8.1, 8.05, 8.15, 8.20],
    category: 'Wiring',
    image: 'https://picsum.photos/seed/aluminumcable/400/300',
    rating: 4.1,
    reviews: 842,
    stock: 145,
    isBestSeller: false,
    deliveryDate: 'Thursday, June 27',
  },
  {
    id: '3',
    name: 'Standard Light Switch',
    basePrice: 45.00,
    mrp: 55.00,
    volatility: 0.0, // Static price
    history: [45.0, 45.0, 45.0, 45.0, 45.0],
    category: 'Switches',
    image: 'https://picsum.photos/seed/lightswitch/400/300',
    rating: 4.8,
    reviews: 3042,
    stock: 12,
    isBestSeller: true,
    deliveryDate: 'Tomorrow, June 25',
  }
];

export function generateNextPrice(currentPrice, volatility) {
  if (volatility === 0) return currentPrice;
  const change = 1 + (Math.random() * volatility * 2 - volatility);
  return Number((currentPrice * change).toFixed(2));
}
