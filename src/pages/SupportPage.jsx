import React from 'react';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">How can we help?</h1>
        <p className="text-lg text-slate-500">Search our knowledge base or get in touch with our team.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-2">Price Guarantee</h3>
          <p className="text-slate-500 mb-4">Learn how our daily pricing model guarantees you the exact price in your cart through midnight.</p>
          <a href="#" className="text-blue-600 font-semibold hover:underline">Read policy &rarr;</a>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-2">Shipping & Fulfillment</h3>
          <p className="text-slate-500 mb-4">Track your order, learn about VoltFulfilled expedited shipping, or initiate a return.</p>
          <a href="#" className="text-blue-600 font-semibold hover:underline">Track order &rarr;</a>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">Our B2B support team is available 24/7 to assist with bulk orders, technical specifications, and general inquiries.</p>
        <button className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
          Contact Support
        </button>
      </div>
    </div>
  );
}
