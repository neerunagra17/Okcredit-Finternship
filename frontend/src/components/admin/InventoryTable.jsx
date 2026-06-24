import React from 'react';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryTable() {
  const { products, deleteProduct } = useProducts();

  const handleDelete = (id) => {
    deleteProduct(id);
    toast.info("Product removed from inventory.");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Current Inventory ({products.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Today's Price</th>
              <th className="p-4 font-medium">M.R.P</th>
              <th className="p-4 font-medium">Volatility</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map(product => (
              <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-slate-800 flex items-center gap-3">
                  <img src={product.image} className="w-10 h-10 rounded object-cover border border-slate-200" alt="" />
                  <span className="line-clamp-2 max-w-[200px]">{product.name}</span>
                </td>
                <td className="p-4">
                  <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">{product.category}</span>
                </td>
                <td className="p-4 font-bold text-slate-900">₹{product.basePrice.toFixed(2)}</td>
                <td className="p-4 text-slate-500 line-through">₹{product.mrp.toFixed(2)}</td>
                <td className="p-4 text-slate-500">{(product.volatility * 100).toFixed(0)}%</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0">
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
