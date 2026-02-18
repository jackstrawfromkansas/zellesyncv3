
import React from 'react';
import { GmailAccount } from '../types';

interface AccountManagerProps {
  accounts: GmailAccount[];
  onToggleAccount: (id: string) => void;
  onAddAccount: () => void;
  onRemoveAccount: (id: string) => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({ 
  accounts, 
  onToggleAccount, 
  onAddAccount, 
  onRemoveAccount 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Connected Accounts
        </h3>
        <button 
          onClick={onAddAccount}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </button>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div 
            key={account.id} 
            className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all ${
              account.isActive 
                ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' 
                : 'bg-slate-50 border-slate-100 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={account.avatar} 
                  alt={account.name} 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                {account.isActive && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{account.name}</span>
                <span className="text-xs text-slate-500 truncate max-w-[140px]">{account.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleAccount(account.id)}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  account.isActive ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  account.isActive ? 'left-5.5' : 'left-0.5'
                } transform translate-x-${account.isActive ? '0' : '0'}`} 
                style={{ transform: `translateX(${account.isActive ? '20px' : '0px'})` }}
                />
              </button>
              
              <button 
                onClick={() => onRemoveAccount(account.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-slate-400 text-center leading-relaxed">
        Only active accounts will be scanned during the automated reconciliation process.
      </p>
    </div>
  );
};
