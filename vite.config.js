import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Inline Vite plugin to handle /api/send-email during dev
function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
          try {
            const { subject, html } = JSON.parse(body);

            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: 'Bearer re_hy8zjuS4_FW4JK4iDBvPaGP3BNjsmyhgj',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'YAMKITCH Portal <portal@yamkitch.in>',
                to: 'yamkitch@gmail.com',
                subject,
                html,
              }),
            });

            const data = await response.json();
            res.writeHead(response.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
})
