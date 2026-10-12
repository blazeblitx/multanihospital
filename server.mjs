import http from 'node:http';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'outputs');

// Load a local private .env.local file without adding a dependency.
try {
  const env = await readFile(path.join(root, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
} catch {}

const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const sendJson = (res, status, data) => {
  res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
  res.end(JSON.stringify(data));
};

const instructions = `You are an AI clinic information assistant for Multani Plastic Surgery Centre in Jalandhar, India. Clearly identify yourself as AI if asked. Provide general educational information and help visitors navigate the website only. You are not a clinician. Do not diagnose, triage except to advise immediate emergency help, prescribe or adjust medicines, assess someone's suitability for surgery, interpret photos or test results, promise outcomes, or invent clinic facts. For personal medical decisions, direct the visitor to contact the clinic/surgeon. For potentially urgent or life-threatening symptoms, advise seeking emergency care now and not waiting for this chat. Do not request personal or sensitive health data. Use only these verified site details when relevant: phone +91 98729 79616; alternate phone +91 98722 48616; email jangpreetsingh@yahoo.co.in; address SCO 97, Urban Estate Phase II Market, opposite petrol pump, Jalandhar, Punjab 144005. Published site sections include hair restoration, cosmetic surgery, reconstructive surgery, laser treatments, videos, and articles. Keep replies concise, calm, and clear.`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/api/ai-chat') {
    if (!process.env.OPENAI_API_KEY) return sendJson(res, 503, { error:'The AI assistant is not connected yet. Please call the clinic directly.' });
    let raw = '';
    try {
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 12000) return sendJson(res, 413, { error:'That message is too long. Please shorten it and try again.' });
      }
      const body = JSON.parse(raw || '{}');
      const messages = body.messages;
      if (!Array.isArray(messages) || messages.length < 1 || messages.length > 8 || messages.some(m => !m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 1200)) {
        return sendJson(res, 400, { error:'Please send a shorter message and try again.' });
      }
      const response = await fetch('https://api.openai.com/v1/responses', {
        method:'POST', headers:{ 'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type':'application/json' },
        body:JSON.stringify({ model:process.env.OPENAI_MODEL || 'gpt-6-astra', instructions, input:messages.map(m => ({ role:m.role, content:[{ type:'input_text', text:m.content }] })), max_output_tokens:350, store:false })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('OpenAI request failed with status', response.status);
        return sendJson(res, 502, { error:'The AI assistant could not respond right now. Please try again or contact the clinic.' });
      }
      const answer = (data.output || []).flatMap(item => item.content || []).filter(item => item.type === 'output_text').map(item => item.text).join('\n').trim();
      if (!answer) return sendJson(res, 502, { error:'The AI assistant could not prepare a response. Please try again.' });
      return sendJson(res, 200, { answer });
    } catch {
      return sendJson(res, 400, { error:'I couldn’t read that message. Please try again.' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { error:'Method not allowed.' });
  let decoded;
  try { decoded = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end(); }
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const filename = path.resolve(publicRoot, relative);
  if (!filename.startsWith(publicRoot + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    await access(filename);
    const content = await readFile(filename);
    res.writeHead(200, { 'Content-Type':mime[path.extname(filename).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff' });
    if (req.method === 'HEAD') return res.end();
    return res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
});

const port = Number(process.env.PORT || 4174);
server.listen(port, '127.0.0.1', () => console.log(`Site preview available at http://127.0.0.1:${port}`));
