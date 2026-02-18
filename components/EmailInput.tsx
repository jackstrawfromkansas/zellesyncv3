
import React, { useState } from 'react';

interface EmailInputProps {
  onProcess: (content: string) => void;
  onSync: () => void;
  isLoading: boolean;
  isSyncing: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ onProcess, onSync, isLoading, isSyncing }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onProcess(content);
    }
  };

  const loadExample = (type: 'zelle' | 'paypal' | 'chime') => {
    const examples = {
      zelle: `Zelle payment from Alex Rivera: $45.00. 
Memo: Order #1001 reconciliation.
Transaction ID: ZL123456789. 
Date: May 20, 2024.`,
      paypal: `PayPal: You received $120.50 USD from Jordan Smith.
Buyer Note: "For #1002, thanks!"
Transaction ID: 9BT334200X.`,
      chime: `Chime: Maria Garcia sent you $89.99.
Message: Confirmation #UKX5NJ150 payment.
Reference: CH90210.
Date: May 21, 2024.`
    };
    setContent(examples[type]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Reconcile Payments
        </h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => loadExample('zelle')}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-wider"
          >
            Ex. Zelle
          </button>
          <button 
            onClick={() => loadExample('paypal')}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-wider"
          >
            Ex. PayPal
          </button>
          <button 
            onClick={() => loadExample('chime')}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-wider"
          >
            Ex. Chime
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={onSync}
          disabled={isSyncing || isLoading}
          className={`w-full py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border-2 border-dashed ${
            isSyncing 
              ? 'bg-slate-50 border-slate-200 text-slate-400' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking Gmail automatically...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Scan Gmail for Payments</span>
            </>
          )}
        </button>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">or paste manually below</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste email text here..."
          className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none text-sm"
        />
        
        <button
          type="submit"
          disabled={isLoading || isSyncing || !content.trim()}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isLoading || !content.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg'
          }`}
        >
          {isLoading ? 'Processing...' : 'Manual Reconcile'}
        </button>
      </form>
    </div>
  );
};
