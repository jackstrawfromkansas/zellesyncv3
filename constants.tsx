
import React from 'react';
import { ShopifyOrder, OrderStatus } from './types';

export const MOCK_ORDERS: ShopifyOrder[] = [
  {
    id: 'gid://shopify/Order/1001',
    orderNumber: '#1001',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.r@example.com',
    totalAmount: 45.00,
    currency: 'USD',
    createdAt: '2024-05-20T10:30:00Z',
    status: OrderStatus.UNPAID
  },
  {
    id: 'gid://shopify/Order/1002',
    orderNumber: '#1002',
    customerName: 'Jordan Smith',
    customerEmail: 'jordan.s@example.com',
    totalAmount: 120.50,
    currency: 'USD',
    createdAt: '2024-05-20T11:15:00Z',
    status: OrderStatus.UNPAID
  },
  {
    id: 'gid://shopify/Order/1003',
    orderNumber: '#UKX5NJ150',
    customerName: 'Maria Garcia',
    customerEmail: 'm.garcia@mail.com',
    totalAmount: 89.99,
    currency: 'USD',
    createdAt: '2024-05-20T12:00:00Z',
    status: OrderStatus.UNPAID
  },
  {
    id: 'gid://shopify/Order/1004',
    orderNumber: '#1004',
    customerName: 'Sam Wilson',
    customerEmail: 'sam.wilson@demo.com',
    totalAmount: 15.00,
    currency: 'USD',
    createdAt: '2024-05-20T13:45:00Z',
    status: OrderStatus.UNPAID
  }
];

export const MOCK_GMAIL_INBOX = [
  {
    subject: "Zelle: Payment Received",
    body: "Zelle payment from Alex Rivera: $45.00. Memo: Payment for order #1001. Transaction ID: ZL99881. Date: May 21, 2024."
  },
  {
    subject: "PayPal: You've got money!",
    body: "Jordan Smith sent you $120.50 USD. Note from sender: Ref #1002. Transaction ID: PP44552."
  },
  {
    subject: "Zelle: Payment Notification",
    body: "Maria Garcia sent $89.99. Memo: Confirmation code #UKX5NJ150. Transaction ID: ZL77112."
  },
  {
    subject: "Chime: You received money",
    body: "Sam Wilson sent you $15.00. Note: Order #1004. Ref: CH90210. Date: May 21, 2024."
  }
];

export const APP_CONFIG = {
  REFRESH_INTERVAL: 30000,
};
