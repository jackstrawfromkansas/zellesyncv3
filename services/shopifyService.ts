
import { ShopifyOrder, OrderStatus } from "../types";

/**
 * To use this for real:
 * 1. Go to Shopify Admin > Settings > Apps and sales channels > Develop apps.
 * 2. Create an app and get an "Admin API Access Token".
 * 3. Your store URL is usually 'your-store-name.myshopify.com'.
 */

const SHOPIFY_STORE = 'your-store.myshopify.com';
const API_VERSION = '2024-04';

export async function fetchUnpaidOrders(): Promise<ShopifyOrder[]> {
  try {
    // In a production app, this call would go through a backend to hide the API Key
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/orders.json?status=open&financial_status=pending`, {
      headers: {
        'X-Shopify-Access-Token': 'shpat_your_token_here',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Shopify connection failed');
    const data = await response.json();
    
    return data.orders.map((o: any) => ({
      id: o.admin_graphql_api_id,
      orderNumber: `#${o.order_number}`,
      customerName: `${o.customer?.first_name || ''} ${o.customer?.last_name || ''}`.trim() || 'Guest',
      customerEmail: o.customer?.email || 'No email',
      totalAmount: parseFloat(o.total_price),
      currency: o.currency,
      createdAt: o.created_at,
      status: OrderStatus.UNPAID
    }));
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return []; // Return empty list if connection fails
  }
}

export async function markOrderAsPaid(orderId: string): Promise<boolean> {
  // Real implementation would call Shopify GraphQL API to create a transaction
  console.log(`Setting order ${orderId} to PAID in Shopify...`);
  return true;
}
