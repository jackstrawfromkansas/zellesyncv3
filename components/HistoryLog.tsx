
import React from 'react';

interface LogEntry {
  id: string;
  orderNumber: string;
  amount: number;
  timestamp: string;
  method: string;
  isArchived?: boolean;
  transactionId: string;
}

interface HistoryLogProps {
  logs: LogEntry[];
  onArchive?: (transactionId: string) => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs, onArchive }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Reconciliation Activity Log</h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Post-Sync Cleanup</span>
      </div>
      <div className="divide-y divide-slate-100">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic">
            No activity logged yet.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.isArchived ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  {log.isArchived ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Order {log.orderNumber} updated to Paid</p>
                  <p className="text-xs text-slate-500">
                    Confirmed via {log.method} • {new Date(log.timestamp).toLocaleString()}
                    {log.isArchived && <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">Archived in Gmail</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-slate-700">${log.amount.toFixed(2)}</span>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Synced</p>
                </div>
                {!log.isArchived && onArchive && (
                  <button
                    onClick={() => onArchive(log.transactionId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold flex items-center gap-1"
                    title="Archive this email in Gmail"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archive Email
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
