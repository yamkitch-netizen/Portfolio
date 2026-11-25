// Local dev server to handle /api/send-email
// Run alongside Vite with: node server.js
// Vite proxies /api/* -> http://localhost:3001

import http from "http";
import fs from "fs";
import path from "path";

const PORT = 3001;

function loadEnvKey(key) {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split(/\r?\n/)) {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
      if (match && match[1] === key) {
        return match[2].replace(/^['"]|['"]$/g, "");
      }
    }
  } catch {
    // .env file is optional when env var is provided by the host
  }
  return "";
}

const RESEND_API_KEY = loadEnvKey("RESEND_API_KEY");

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
        const { subject, html, to } = JSON.parse(body);
        const rawRecipients = Array.isArray(to) ? to : to ? [to] : [];
        const recipients = [...new Set(rawRecipients.map((addr) => String(addr).trim()).filter(Boolean))];
        const finalTo = recipients.length > 0 ? recipients : ["yamkitch@gmail.com"];

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "YAMKITCH Portal <portal@yamkitch.in>",
            to: finalTo,
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
