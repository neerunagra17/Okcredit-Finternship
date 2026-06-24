import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Power } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import AddProductForm from '@/components/admin/AddProductForm';
import InventoryTable from '@/components/admin/InventoryTable';

export default function AdminPage() {
  const { isMarketOpen, toggleMarketStatus } = useMarket();

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Package className="text-blue-400" size={24} />
          <h1 className="text-lg font-bold tracking-tight">VoltCommerce <span className="font-medium text-slate-400">| Merchant Portal</span></h1>
        </div>
        <Button asChild variant="outline" className="text-slate-900 bg-white hover:bg-slate-100 rounded-xl">
          <Link to="/" className="flex items-center"><ArrowLeft size={16} className="mr-2"/> View Storefront</Link>
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-slate-800 font-bold mb-1 flex items-center gap-2">
              <Power size={18} className="text-blue-600" /> Market Hours Control
            </h4>
            <p className="text-sm text-slate-500">Toggle the market status to simulate the daily delivery cutoff.</p>
          </div>
          <Button 
            onClick={() => {
              toggleMarketStatus();
              toast.info(!isMarketOpen ? "Market is now simulated as OPEN." : "Market is now simulated as CLOSED. View storefront to see changes.");
            }}
            variant={isMarketOpen ? "destructive" : "default"}
            className={isMarketOpen ? "bg-red-500 hover:bg-red-600 font-bold" : "bg-emerald-500 hover:bg-emerald-600 text-white font-bold"}
          >
            Simulate Market {isMarketOpen ? "Close" : "Open"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <AddProductForm />
          </div>

          <div className="w-full lg:w-2/3">
            <InventoryTable />
          </div>
        </div>
      </main>
    </div>
  );
}
