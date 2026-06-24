# VoltCommerce ⚡

VoltCommerce is a modern, dynamic e-commerce prototype tailored for the electrical and hardware goods market. It features a unique "live market" pricing model where product prices fluctuate daily based on market volatility, and a Merchant Portal that syncs inventory in real-time across the storefront.

## 🚀 Key Features

* **Dynamic Market Pricing**: Product prices (M.R.P vs Current Price) update dynamically. Products have customizable volatility rates (from 0% fixed to 10% high volatility) that simulate live B2B hardware market conditions.
* **Market Hours Simulation**: Features a simulated "Market Close" mechanism. When the daily cutoff is reached, checkout systems lock down and the UI seamlessly transforms to indicate that prices are frozen until the next day.
* **Merchant Portal (Admin Dashboard)**: A dedicated portal (`/admin`) for merchants to lodge new inventory into the store, configure pricing and volatility, and simulate the market close.
* **Real-Time Cross-Tab Syncing**: Powered by global Contexts and `localStorage` event listeners, actions taken in the Merchant Portal (like lodging a product or closing the market) instantly propagate to active Storefront tabs without requiring a page refresh.

## 💻 Tech Stack

* **Frontend Framework**: React 18 + Vite
* **Routing**: React Router DOM (v6)
* **Styling**: Tailwind CSS for rapid, utility-first styling
* **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives wrapped in Tailwind)
* **Icons**: Lucide React
* **Toast Notifications**: Sonner
* **State Management**: React Context API (`ProductContext`, `MarketContext`, `CartContext`) mapped to Browser `localStorage` for persistence.

## 📂 Repository Structure

The codebase is engineered with a strict adherence to single-responsibility and separation of concerns.

```text
src/
├── components/          # Reusable UI building blocks
│   ├── admin/           # Merchant Portal specific components
│   │   ├── AddProductForm.jsx
│   │   └── InventoryTable.jsx
│   ├── layout/          # Structural application framing
│   │   ├── CartSidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── product/         # Storefront product display logic
│   │   ├── ProductAction.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductPricing.jsx
│   └── ui/              # shadcn UI components (badges, buttons, cards, etc.)
│
├── context/             # Global Application State
│   ├── CartContext.jsx      # Manages user shopping cart
│   ├── MarketContext.jsx    # Manages global market hours and cutoff times
│   └── ProductContext.jsx   # Manages global inventory and cross-tab syncing
│
├── hooks/               # Custom React Hooks
│   └── useDailyPrices.js    # Calculates current active price based on volatility
│
├── lib/                 # Utility functions and raw data
│   ├── mockData.js          # Initial seed dataset for the store
│   └── utils.js             # Tailwind merge utilities (clsx/twMerge)
│
├── pages/               # Top-level Route Views
│   ├── AdminPage.jsx        # /admin route container
│   ├── CategoryPage.jsx     # /category/:id route
│   ├── DealsPage.jsx        # /deals route
│   ├── HomePage.jsx         # / (root) storefront
│   └── SupportPage.jsx      # Legal and support placeholder
│
├── App.jsx              # Main Router and Context Provider composition
└── index.css            # Global CSS and Tailwind directives
```

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Explore the app:**
   - **Storefront**: Open `http://localhost:5173/`
   - **Merchant Portal**: Open `http://localhost:5173/admin`
