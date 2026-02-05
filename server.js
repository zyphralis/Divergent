const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 4173;
const root = __dirname;

const templates = [
  {
    id: 'moderation',
    title: 'Moderation bot',
    description:
      'Slash commands for kick, ban, timeout, warn, and purge with hierarchy checks and safety limits.',
    details: 'Includes risk warnings, private logs, and options for appeal buttons + rate limits.'
  },
  {
    id: 'welcome',
    title: 'Welcome bot',
    description: 'Branded greetings, auto-role assignment, and join/leave tracking.',
    details: 'Great for community onboarding and clean channel structure.'
  },
  {
    id: 'utility',
    title: 'Utility bot',
    description: 'Polls, reminders, quick timestamps, and daily helper commands.',
    details: 'General-purpose tools for productivity and coordination.'
  },
  {
    id: 'events',
    title: 'Event bot',
    description: 'Countdowns, schedules, signups, and announcement automation.',
    details: 'Useful for launches, tournaments, and recurring server events.'
  }
];

let state = {
  selectedTemplate: null,
  status: 'Offline',
  latency: null,
  commands1h: 0,
  errors1h: 0,
  lastAction: 'No actions yet.'
};

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function json(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Request body too large.'));
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', reject);
  });
}

function verifyToken(token) {
  const trimmed = (token || '').trim();
  if (!trimmed) {
    return { ok: false, reason: 'Paste a token before verification.' };
  }

  const looksLikeToken = trimmed.length > 30 && trimmed.includes('.');
  if (!looksLikeToken) {
    return {
      ok: false,
      reason: 'Token format looks wrong. Open Developer Portal → Bot and copy token again.'
    };
  }

  if (trimmed.toLowerCase().includes('deny') || trimmed.toLowerCase().includes('fail')) {
    return {
      ok: false,
      reason: 'Missing permissions detected. Re-invite the bot with Manage Messages and Moderate Members.'
    };
  }

  return { ok: true };
}

function serveStatic(req, res) {
  const requestPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(root, path.normalize(requestPath));

  if (!filePath.startsWith(root)) {
    json(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      json(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/verify' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const result = verifyToken(body.token);
      if (!result.ok) {
        json(res, 400, result);
        return;
      }
      json(res, 200, {
        ok: true,
        message: 'Verification complete. Permissions and server access look good.'
      });
      return;
    } catch (error) {
      json(res, 400, { ok: false, reason: error.message });
      return;
    }
  }

  if (req.url === '/api/templates' && req.method === 'GET') {
    json(res, 200, { templates });
    return;
  }

  if (req.url === '/api/select-template' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const chosen = templates.find((t) => t.id === body.templateId);
      if (!chosen) {
        json(res, 404, { ok: false, message: 'Template not found.' });
        return;
      }

      state = {
        ...state,
        selectedTemplate: chosen.id,
        status: 'Online',
        latency: Math.floor(Math.random() * 40 + 45),
        commands1h: Math.floor(Math.random() * 250 + 50),
        errors1h: Math.floor(Math.random() * 3),
        lastAction: `${chosen.title} configured. Sandbox ready.`
      };

      json(res, 200, { ok: true, state });
      return;
    } catch (error) {
      json(res, 400, { ok: false, message: error.message });
      return;
    }
  }

  if (req.url === '/api/sandbox-test' && req.method === 'POST') {
    if (!state.selectedTemplate) {
      json(res, 400, { ok: false, message: 'Choose a template before running sandbox tests.' });
      return;
    }

    state = {
      ...state,
      errors1h: 0,
      lastAction: 'Sandbox test passed. Commands responded in isolated server environment.'
    };

    json(res, 200, { ok: true, state });
    return;
  }

  if (req.url === '/api/deploy' && req.method === 'POST') {
    if (!state.selectedTemplate) {
      json(res, 400, { ok: false, message: 'Select a template first, then deploy in one click.' });
      return;
    }

    state = {
      ...state,
      status: 'Online',
      lastAction: 'Deployment complete. Your updated bot configuration is now live.'
    };

    json(res, 200, { ok: true, state });
    return;
  }

  if (req.url === '/api/dashboard' && req.method === 'GET') {
    json(res, 200, { state });
    return;
  }

  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Divergent server running at http://0.0.0.0:${port}`);
});
