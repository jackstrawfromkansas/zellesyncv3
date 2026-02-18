
export enum OrderStatus {
  UNPAID = 'Unpaid',
  PAID = 'Paid',
  PROCESSING = 'Processing',
  ARCHIVED = 'Archived'
}

export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  status: OrderStatus;
}

export interface GmailAccount {
  id: string;
  email: string;
  name: string;
  avatar: string;
  isActive: boolean;
  lastSync?: string;
}

export interface ParsedPayment {
  platform: 'Zelle' | 'PayPal' | 'Chime' | 'Other';
  senderName: string;
  senderEmail?: string;
  amount: number;
  transactionId: string;
  date: string;
  memo?: string;
  originalText: string;
  sourceAccountEmail?: string;
}

export interface ReconciliationMatch {
  orderId: string;
  paymentId: string;
  confidence: number;
  reason: string;
  matchedBy?: 'note' | 'name' | 'email' | 'amount';
}
