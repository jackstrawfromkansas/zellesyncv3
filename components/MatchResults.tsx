
import React from 'react';
import { ParsedPayment, ShopifyOrder, ReconciliationMatch } from '../types';

interface MatchResultsProps {
  results: {
    payment: ParsedPayment;
    match: ReconciliationMatch | null;
  }[];
  orders: ShopifyOrder[];
  onConfirm: (match: ReconciliationMatch, archive?: boolean) => void;
  onDiscard: (index: number) => void;
}

export const MatchResults: React.FC<MatchResultsProps> = ({ results, orders, onConfirm, onDiscard }) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Auto-Detected Matches</h3>
        <span className="text-xs text-slate-500">Scan Complete: {results.length} results</span>
      </div>

      {results.map((item, idx) => {
        const order = orders.find(o => o.id === item.match?.orderId);
        const isNoteMatch = item.match?.matchedBy === 'note';

        const getBadgeStyle = (platform: string) => {
          switch (platform) {
            case 'PayPal': return 'bg-blue-100 text-blue-700';
            case 'Zelle': return 'bg-purple-100 text-purple-700';
            case 'Chime': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
          }
        };
        
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              {/* Payment Info */}
              <div className="p-5 flex-1 bg-slate-50/50 border-r border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${getBadgeStyle(item.payment.platform)}`}>
                    {item.payment.platform}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">#{item.payment.transactionId}</span>
                </div>
                <div className="mb-2">
                  <h4 className="font-bold text-slate-900">{item.payment.senderName}</h4>
                  <p className="text-xs text-slate-500 font-mono">${item.payment.amount.toFixed(2)}</p>
                </div>
                {item.payment.sourceAccountEmail && (
                   <p className="text-[10px] text-indigo-600 font-semibold mb-2">Found in: {item.payment.sourceAccountEmail}</p>
                )}
                {item.payment.memo && (
                  <div className="mt-2 text-[11px] bg-white p-2 border border-slate-100 rounded text-slate-600">
                    <span className="font-bold text-slate-400 uppercase tracking-tighter mr-1">Note:</span>
                    {item.payment.memo}
                  </div>
                )}
              </div>

              {/* Match Logic */}
              <div className="p-5 flex-[1.5] flex items-center justify-center border-r border-slate-100">
                {item.match && order ? (
                  <div className="w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isNoteMatch ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {isNoteMatch ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-bold uppercase tracking-tight ${
                            isNoteMatch ? 'text-indigo-600' : 'text-emerald-600'
                          }`}>
                            {isNoteMatch ? 'Exact Note Match' : 'Fuzzy AI Match'}
                          </p>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">
                            {Math.round(item.match.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">Linked to {order.orderNumber}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-indigo-200 pl-3">
                      &quot;{item.match.reason}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-400">Could not find matching order</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-5 flex flex-col justify-center gap-2 bg-slate-50/20 w-full md:w-56">
                {item.match && order ? (
                  <>
                    <button
                      onClick={() => onConfirm(item.match!, true)}
                      className={`w-full py-2 px-4 text-white rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 bg-slate-800 hover:bg-slate-900 shadow-slate-200 flex items-center justify-center gap-2`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Confirm & Archive
                    </button>
                    <button
                      onClick={() => onConfirm(item.match!, false)}
                      className={`w-full py-2 px-4 text-white rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 ${
                        isNoteMatch ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-50' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-50'
                      }`}
                    >
                      Confirm Paid Only
                    </button>
                  </>
                ) : (
                  <button disabled className="w-full py-2 px-4 bg-slate-100 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed">
                    Manual Fix
                  </button>
                )}
                <button
                  onClick={() => onDiscard(idx)}
                  className="w-full py-2 px-4 text-slate-400 hover:text-red-500 text-xs font-semibold"
                >
                  Ignore Result
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
