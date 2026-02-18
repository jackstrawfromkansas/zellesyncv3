
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { OrderTable } from './components/OrderTable';
import { EmailInput } from './components/EmailInput';
import { MatchResults } from './components/MatchResults';
import { HistoryLog } from './components/HistoryLog';
import { AccountManager } from './components/AccountManager';
import { ShopifyOrder, OrderStatus, ParsedPayment, ReconciliationMatch, GmailAccount } from './types';
import { parseEmailContent, matchOrder } from './services/geminiService';
import { fetchUnpaidOrders, markOrderAsPaid } from './services/shopifyService';
import { fetchRecentPaymentEmails, archiveGmailMessage } from './services/gmailApiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [results, setResults] = useState<{payment: ParsedPayment; match: ReconciliationMatch | null}[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [archivedTransactionIds, setArchivedTransactionIds] = useState<Set<string>>(new Set());

  const [accounts, setAccounts] = useState<GmailAccount[]>([
    {
      id: 'acc_1',
      name: 'Main Store Sales',
      email: 'sales@mystore.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sales',
      isActive: true,
      lastSync: new Date().toISOString()
    }
  ]);

  // LOAD REAL ORDERS ON STARTUP
  useEffect(() => {
    const loadRealData = async () => {
      setIsLoadingOrders(true);
      const realOrders = await fetchUnpaidOrders();
      // If Shopify fails, we fall back to a helper message or empty state
      setOrders(realOrders);
      setIsLoadingOrders(false);
    };
    loadRealData();
  }, []);

  const handleConfirmMatch = useCallback(async (match: ReconciliationMatch, shouldArchive: boolean = false) => {
    const orderToUpdate = orders.find(o => o.id === match.orderId);
    if (!orderToUpdate) return;

    // 1. UPDATE REAL SHOPIFY
    const success = await markOrderAsPaid(match.orderId);
    if (!success) {
      alert("Failed to update Shopify. Check API permissions.");
      return;
    }

    // 2. ARCHIVE IN GMAIL (if requested)
    if (shouldArchive) {
      // In a real app, you'd pass the real Gmail Message ID here
      setArchivedTransactionIds(prev => new Set(prev).add(match.paymentId));
    }

    // 3. UPDATE LOCAL UI
    setOrders(prev => prev.filter(o => o.id !== match.orderId));
    setHistory(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: orderToUpdate.orderNumber,
      amount: orderToUpdate.totalAmount,
      timestamp: new Date().toISOString(),
      method: match.matchedBy === 'note' ? 'Auto-Note Sync' : 'AI Match',
      isArchived: shouldArchive,
      transactionId: match.paymentId
    }, ...prev]);

    setResults(prev => prev.filter(r => r.match?.orderId !== match.orderId));
  }, [orders]);

  const handleArchiveHistoryItem = (transactionId: string) => {
    setArchivedTransactionIds(prev => new Set(prev).add(transactionId));
    setHistory(prev => prev.map(log => 
      log.transactionId === transactionId ? { ...log, isArchived: true } : log
    ));
  };

  const processEmailBatch = async (content: string, sourceEmail?: string) => {
    const payments = await parseEmailContent(content);
    const unarchivedPayments = payments.filter(p => !archivedTransactionIds.has(p.transactionId));

    const matchPromises = unarchivedPayments.map(async (payment) => {
      const match = await matchOrder(payment, orders);
      return { 
        payment: { ...payment, sourceAccountEmail: sourceEmail }, 
        match 
      };
    });

    return await Promise.all(matchPromises);
  };

  const handleProcessManualEmail = async (content: string) => {
    setIsProcessing(true);
    try {
      const newResults = await processEmailBatch(content);
      setResults(newResults);
    } catch (error) {
      console.error("Reconciliation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncGmail = async () => {
    const activeAccounts = accounts.filter(a => a.isActive);
    if (activeAccounts.length === 0) {
      alert("Please activate at least one Gmail account.");
      return;
    }

    setIsSyncing(true);
    setResults([]);
    try {
      const allResults: any[] = [];
      
      for (const account of activeAccounts) {
        // CALL REAL GMAIL API
        // In a real app, 'ya29.fake-token' would be your OAuth token
        const realEmails = await fetchRecentPaymentEmails('ya29.your_access_token');
        
        const combinedInboxContent = realEmails
          .map(mail => `From: ${account.email}\nSubject: ${mail.subject}\nBody: ${mail.body}`)
          .join('\n\n---\n\n');
        
        if (combinedInboxContent) {
          const accountResults = await processEmailBatch(combinedInboxContent, account.email);
          allResults.push(...accountResults);
        }
      }
      
      setResults(allResults);
      setAccounts(prev => prev.map(a => a.isActive ? { ...a, lastSync: new Date().toISOString() } : a));
    } catch (error) {
      console.error("Gmail sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, isActive: !acc.isActive } : acc));
  };

  const handleAddAccount = () => {
    alert("This would open the Google Login (OAuth) popup in a production app.");
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Live API Status</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Shopify Engine</span>
                  <span className={orders.length > 0 ? "text-emerald-400" : "text-amber-400"}>
                    {orders.length > 0 ? "CONNECTED" : "WAITING FOR TOKEN"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Gmail Watcher</span>
                  <span className="text-indigo-400">READY TO SCAN</span>
                </div>
              </div>
            </div>

            <AccountManager 
              accounts={accounts}
              onToggleAccount={handleToggleAccount}
              onAddAccount={handleAddAccount}
              onRemoveAccount={handleRemoveAccount}
            />

            <EmailInput 
              onProcess={handleProcessManualEmail} 
              onSync={handleSyncGmail}
              isLoading={isProcessing} 
              isSyncing={isSyncing}
            />
            
            <MatchResults 
              results={results} 
              orders={orders} 
              onConfirm={handleConfirmMatch}
              onDiscard={(i) => setResults(prev => prev.filter((_, idx) => idx !== i))}
            />
          </div>

          <div className="lg:col-span-7">
            {isLoadingOrders ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-500 font-medium">Fetching real orders from Shopify...</p>
              </div>
            ) : (
              <OrderTable orders={orders} />
            )}
            
            <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-2xl">
              <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Developer Configuration Required
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                To activate live syncing, replace the placeholder tokens in <code>services/shopifyService.ts</code> and <code>services/gmailApiService.ts</code> with your actual credentials.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <HistoryLog logs={history} onArchive={handleArchiveHistoryItem} />
      )}
    </Layout>
  );
};

export default App;
