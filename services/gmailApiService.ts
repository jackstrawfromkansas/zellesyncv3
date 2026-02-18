
/**
 * To use this for real:
 * 1. Go to Google Cloud Console.
 * 2. Enable Gmail API and create OAuth 2.0 credentials.
 */

export async function fetchRecentPaymentEmails(accessToken: string) {
  const query = 'subject:(Zelle OR PayPal OR Chime) "payment received"';
  
  try {
    const listResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const { messages } = await listResponse.json();
    if (!messages) return [];

    const emailDetails = await Promise.all(messages.map(async (msg: any) => {
      const detailResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const data = await detailResponse.json();
      
      // Extract the body text from the Gmail message structure
      const body = data.snippet || ""; // Using snippet for simplicity
      const subject = data.payload.headers.find((h: any) => h.name === 'Subject')?.value || "";
      
      return { subject, body, id: msg.id };
    }));

    return emailDetails;
  } catch (error) {
    console.error("Gmail API error:", error);
    return [];
  }
}

export async function archiveGmailMessage(accessToken: string, messageId: string) {
  await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/batchModify`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      removeLabelIds: ['INBOX']
    })
  });
}
