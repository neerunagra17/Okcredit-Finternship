export const mockProducts = [
  {
    id: '1',
    name: 'Copper Wire 10 AWG (per meter)',
    basePrice: 12.50,
    volatility: 0.05, // 5% max swing per tick
    history: [12.0, 12.2, 12.1, 12.4, 12.5],
    category: 'Wiring',
    image: 'https://images.unsplash.com/photo-1616683696860-29c8fb944e95?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Aluminum Cable 4/0 (per meter)',
    basePrice: 8.20,
    volatility: 0.03,
    history: [8.0, 8.1, 8.05, 8.15, 8.20],
    category: 'Wiring',
    image: 'https://images.unsplash.com/photo-1596435010996-0f04e17dc462?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    name: 'Standard Light Switch',
    basePrice: 4.50,
    volatility: 0.0, // Static price
    history: [4.5, 4.5, 4.5, 4.5, 4.5],
    category: 'Switches',
    image: 'https://images.unsplash.com/photo-1558231265-5154c15d487f?auto=format&fit=crop&q=80&w=400',
  }
];

export function generateNextPrice(currentPrice, volatility) {
  if (volatility === 0) return currentPrice;
  const change = 1 + (Math.random() * volatility * 2 - volatility);
  return Number((currentPrice * change).toFixed(2));
}
