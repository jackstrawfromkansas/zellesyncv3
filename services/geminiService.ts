
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedPayment, ReconciliationMatch } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseEmailContent(content: string): Promise<ParsedPayment[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following text for payment confirmation details (Zelle, PayPal, or Chime). 
    Extract as many separate transactions as you find. 
    Pay special attention to "Notes", "Memo", "Message", or "For" fields as they often contain Shopify order numbers or alphanumeric confirmation codes.
    
    Email Content:
    ---
    ${content}
    ---`,
    config: {
      systemInstruction: "You are a specialized financial data extractor. Convert unstructured email text into structured JSON. ALWAYS extract the 'memo' or 'note' content if present. For Chime, look for phrases like 'You sent money' or 'Money received'. Capture any strings starting with '#' followed by numbers OR alphanumeric characters (e.g., #1001 or #UKX5NJ150) and ensure they are included in the memo.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, description: "Zelle, PayPal, Chime, or Other" },
            senderName: { type: Type.STRING },
            senderEmail: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            transactionId: { type: Type.STRING },
            date: { type: Type.STRING },
            memo: { type: Type.STRING, description: "The message, note, or memo field from the payment" },
            originalText: { type: Type.STRING }
          },
          required: ["platform", "senderName", "amount", "transactionId"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function matchOrder(payment: ParsedPayment, orders: any[]): Promise<ReconciliationMatch | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Match this payment to a Shopify order.
    
    PRIORITY 1: If the payment 'memo' contains an order number (e.g., #1001) OR an alphanumeric confirmation code (e.g., #UKX5NJ150) that exactly matches an orderNumber in the list, that is a 100% match.
    PRIORITY 2: Match by Customer Name and Amount.
    PRIORITY 3: Match by Email and Amount.

    Payment: ${JSON.stringify(payment)}
    Orders: ${JSON.stringify(orders)}`,
    config: {
      systemInstruction: "Compare payment details with Shopify orders. Return a JSON object with orderId, confidence (0-1), reason, and matchedBy ('note', 'name', 'email', or 'amount'). If the order number or confirmation code is in the memo, matchedBy MUST be 'note'. Match alphanumeric codes exactly.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          orderId: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          matchedBy: { type: Type.STRING, enum: ['note', 'name', 'email', 'amount'] }
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "null");
    if (!data || !data.orderId) return null;
    return {
      ...data,
      paymentId: payment.transactionId
    };
  } catch (e) {
    return null;
  }
}
