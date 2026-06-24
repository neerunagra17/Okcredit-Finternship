import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddProductForm() {
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Wiring',
    basePrice: '',
    mrp: '',
    volatility: '0.05',
    image: '',
    deliveryDate: 'Tomorrow',
    warranty: '1 Year Warranty',
    returnPolicy: '30 Day Returns',
    isBestSeller: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.basePrice || !formData.mrp || !formData.image) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const newProduct = {
      name: formData.name,
      category: formData.category,
      basePrice: parseFloat(formData.basePrice),
      mrp: parseFloat(formData.mrp),
      volatility: parseFloat(formData.volatility),
      image: formData.image,
      deliveryDate: formData.deliveryDate,
      warranty: formData.warranty,
      returnPolicy: formData.returnPolicy,
      isBestSeller: formData.isBestSeller
    };

    addProduct(newProduct);
    toast.success("Product successfully added to storefront!");
    
    setFormData({
      ...formData,
      name: '',
      basePrice: '',
      mrp: '',
      image: '',
      warranty: '1 Year Warranty',
      returnPolicy: '30 Day Returns'
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Plus size={20} className="text-blue-600" /> Lodge New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
          <input 
            type="text" 
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 50A Circuit Breaker"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₹)</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 150.00"
              value={formData.basePrice}
              onChange={e => setFormData({...formData, basePrice: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">M.R.P (₹)</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 200.00"
              value={formData.mrp}
              onChange={e => setFormData({...formData, mrp: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Wiring">Wiring & Cables</option>
              <option value="Switches">Switches & Outlets</option>
              <option value="Tools">Tools</option>
              <option value="Lighting">Lighting</option>
              <option value="Appliances">Appliances</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Daily Volatility</label>
            <select 
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.volatility}
              onChange={e => setFormData({...formData, volatility: e.target.value})}
            >
              <option value="0.00">0% (Fixed Price)</option>
              <option value="0.02">2% (Low)</option>
              <option value="0.05">5% (Medium)</option>
              <option value="0.10">10% (High)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
          <input 
            type="text" 
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://picsum.photos/seed/.../400/300"
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Warranty</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 1 Year Warranty"
              value={formData.warranty}
              onChange={e => setFormData({...formData, warranty: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Return Policy</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 30 Day Returns"
              value={formData.returnPolicy}
              onChange={e => setFormData({...formData, returnPolicy: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="bestseller"
            className="w-4 h-4 text-blue-600 rounded"
            checked={formData.isBestSeller}
            onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
          />
          <label htmlFor="bestseller" className="text-sm font-medium text-slate-700">Flag as "Best Seller"</label>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 font-bold py-6 rounded-xl">
          Lodge Product to Store
        </Button>
      </form>
    </div>
  );
}
