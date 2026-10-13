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

let socialFeedCache = { expiresAt: 0, value: null };

async function fetchGraph(path, token, version) {
  const url = new URL(`https://graph.facebook.com/${version}/${path}`);
  url.searchParams.set('access_token', token);
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error('Social feed request failed');
  return data;
}

async function getSocialFeed() {
  const pageId = process.env.META_PAGE_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) return { connected: false, posts: [] };
  if (socialFeedCache.value && socialFeedCache.expiresAt > Date.now()) return socialFeedCache.value;

  const version = (process.env.META_GRAPH_API_VERSION || 'v26.0').replace(/^v?/, 'v');
  const pagePath = `${encodeURIComponent(pageId)}/posts?fields=id,message,permalink_url,created_time,full_picture&limit=8`;
  try {
    const pagePromise = fetchGraph(pagePath, token, version);
    const pageInfoPromise = fetchGraph(`${encodeURIComponent(pageId)}?fields=instagram_business_account`, token, version).catch(() => ({}));
    const [pageData, pageInfo] = await Promise.all([pagePromise, pageInfoPromise]);
    const igUserId = process.env.META_IG_USER_ID || pageInfo.instagram_business_account?.id;
    const instagramData = igUserId
      ? await fetchGraph(`${encodeURIComponent(igUserId)}/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&limit=8`, token, version).catch(() => ({ data: [] }))
      : { data: [] };
    const facebookPosts = (pageData.data || []).map(post => ({
      id: `facebook-${post.id}`, platform: 'Facebook', caption: post.message || 'A recent update from the clinic.',
      url: post.permalink_url, timestamp: post.created_time, image: post.full_picture || ''
    }));
    const instagramPosts = (instagramData.data || []).map(post => ({
      id: `instagram-${post.id}`, platform: 'Instagram', caption: post.caption || 'A recent update from the clinic.',
      url: post.permalink, timestamp: post.timestamp,
      image: post.media_type === 'VIDEO' ? (post.thumbnail_url || '') : (post.media_url || '')
    }));
    const value = {
      connected: true,
      profiles: {
        facebook: 'https://www.facebook.com/multaniplasticsurgerycentre/',
        instagram: 'https://www.instagram.com/multaniplasticsurgerycentre/'
      },
      posts: [...facebookPosts, ...instagramPosts]
        .filter(post => post.url && post.timestamp)
        .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        .slice(0, 12)
    };
    socialFeedCache = { value, expiresAt: Date.now() + 5 * 60 * 1000 };
    return value;
  } catch {
    if (socialFeedCache.value) return socialFeedCache.value;
    throw new Error('Social updates are temporarily unavailable.');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/api/social-feed') {
    try {
      const feed = await getSocialFeed();
      return sendJson(res, 200, feed);
    } catch {
      return sendJson(res, 502, { connected: false, posts: [], error: 'Social updates are temporarily unavailable.' });
    }
  }
  if (req.method === 'POST' && url.pathname === '/api/ai-chat') {
    if (!process.env.GEMINI_API_KEY) return sendJson(res, 503, { error:'The AI assistant is not connected yet. Please call the clinic directly.' });
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
      const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method:'POST',
        headers:{ 'x-goog-api-key':process.env.GEMINI_API_KEY, 'Content-Type':'application/json' },
        body:JSON.stringify({
          systemInstruction:{ parts:[{ text:instructions }] },
          contents:messages.map(m => ({ role:m.role === 'assistant' ? 'model' : 'user', parts:[{ text:m.content }] })),
          generationConfig:{ maxOutputTokens:350 }
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('Gemini request failed with status', response.status);
        return sendJson(res, 502, { error:'The AI assistant could not respond right now. Please try again or contact the clinic.' });
      }
      const answer = (data.candidates || []).flatMap(candidate => candidate.content?.parts || []).map(part => part.text || '').join('\n').trim();
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
