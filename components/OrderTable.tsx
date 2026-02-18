
import React from 'react';
import { ShopifyOrder, OrderStatus } from '../types';

interface OrderTableProps {
  orders: ShopifyOrder[];
  onSelectOrder?: (order: ShopifyOrder) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onSelectOrder }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Unpaid Shopify Orders
        </h3>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {orders.length} Pending
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/30 text-slate-400 text-xs font-semibold uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>All orders are paid!</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onSelectOrder?.(order)}
                >
                  <td className="px-6 py-4 font-bold text-indigo-600">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{order.customerName}</span>
                      <span className="text-xs text-slate-500">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
