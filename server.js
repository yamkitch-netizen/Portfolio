// Local dev server to handle /api/send-email
// Run alongside Vite with: node server.js
// Vite proxies /api/* -> http://localhost:3001

import http from "http";

const PORT = 3001;
const RESEND_API_KEY = "re_hy8zjuS4_FW4JK4iDBvPaGP3BNjsmyhgj";

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/api/send-email" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { subject, html } = JSON.parse(body);

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "YAMKITCH Portal <portal@yamkitch.in>",
            to: "yamkitch@gmail.com",
            subject,
            html,
          }),
        });

        const data = await response.json();
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`✅ YAMKITCH API server running at http://localhost:${PORT}`);
  console.log(`   Proxying /api/send-email -> Resend`);
});
