import React, { useState, useEffect } from 'react';
import { Package, Clock, User, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import { toast } from 'sonner';

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchOrders();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchOrders = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading orders...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Package className="text-blue-600" size={20} />
          Recent Orders
        </h2>
        <span className="text-sm font-semibold text-slate-500">{orders.length} Total</span>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No orders yet</h3>
          <p className="text-sm text-slate-500">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900 mb-1 text-sm">#{order.orderId}</div>
                    <div className="flex items-center text-xs text-slate-500 gap-1">
                      <Clock size={12} />
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-medium text-slate-700 text-sm mb-1">
                      <User size={14} className="text-slate-400" />
                      {order.customerInfo?.fullName || 'Guest'}
                    </div>
                    <div className="flex items-start gap-1 text-xs text-slate-500">
                      <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
                      <span className="line-clamp-2 max-w-[200px]">
                        {order.customerInfo?.address}, {order.customerInfo?.city} {order.customerInfo?.zip}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">₹{order.total?.toFixed(2)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600 max-w-[200px]">
                      {order.items?.length === 1 ? (
                        <span className="line-clamp-2">{order.items[0].name}</span>
                      ) : (
                        <span>{order.items?.length || 0} items</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
