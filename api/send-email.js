export default async function handler(req, res) {
  // Set CORS headers so it works locally and on live deployment
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, html, to } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ error: "Missing subject or html content" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY is not configured" });
    }

    const rawRecipients = Array.isArray(to) ? to : to ? [to] : [];
    const recipients = [...new Set(rawRecipients.map((addr) => String(addr).trim()).filter(Boolean))];
    const finalTo = recipients.length > 0 ? recipients : ["yamkitch@gmail.com"];

    // Call Resend API from backend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YAMKITCH Portal <portal@yamkitch.in>",
        to: finalTo,
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API responded with an error:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in serverless email handler:", error);
    return res.status(500).json({ error: error.message });
  }
}
