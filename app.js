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

const verifyBtn = document.getElementById('verify-btn');
const tokenInput = document.getElementById('token-input');
const verifyStatus = document.getElementById('verify-status');
const developerHelp = document.getElementById('developer-help');

const pathPanel = document.getElementById('path-panel');
const templatesPanel = document.getElementById('templates-panel');
const setupOptions = document.getElementById('setup-options');
const templateList = document.getElementById('template-list');
const dashboardPanel = document.getElementById('dashboard-panel');

const metricStatus = document.getElementById('metric-status');
const metricLatency = document.getElementById('metric-latency');
const metricCommands = document.getElementById('metric-commands');
const metricErrors = document.getElementById('metric-errors');
const sandboxBtn = document.getElementById('sandbox-btn');
const deployBtn = document.getElementById('deploy-btn');
const actionLog = document.getElementById('action-log');

let selectedTemplate = '';

function fakeVerifyToken(token) {
  const trimmed = token.trim();
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

function showPanel(panel) {
  panel.classList.remove('hidden');
}

function renderTemplates() {
  templateList.innerHTML = '';

  templates.forEach((template) => {
    const button = document.createElement('button');
    button.className = 'card selectable';
    button.type = 'button';
    button.dataset.template = template.id;
    button.innerHTML = `
      <h3>${template.title}</h3>
      <p>${template.description}</p>
      <p>${template.details}</p>
    `;

    button.addEventListener('click', () => {
      selectedTemplate = template.id;
      for (const sibling of templateList.querySelectorAll('.card')) {
        sibling.classList.remove('selected');
      }
      button.classList.add('selected');
      showPanel(dashboardPanel);
      metricStatus.textContent = 'Online';
      metricLatency.textContent = `${Math.floor(Math.random() * 40 + 45)} ms`;
      metricCommands.textContent = `${Math.floor(Math.random() * 250 + 50)}`;
      metricErrors.textContent = `${Math.floor(Math.random() * 3)}`;
      actionLog.textContent = `${template.title} configured. Sandbox ready.`;
    });

    templateList.appendChild(button);
  });
}

verifyBtn.addEventListener('click', () => {
  const result = fakeVerifyToken(tokenInput.value);

  verifyStatus.classList.remove('ok', 'warn');

  if (!result.ok) {
    verifyStatus.classList.add('warn');
    verifyStatus.textContent = result.reason;
    developerHelp.open = true;
    return;
  }

  verifyStatus.classList.add('ok');
  verifyStatus.textContent = 'Verification complete. Permissions and server access look good.';
  showPanel(pathPanel);
});

setupOptions.addEventListener('click', (event) => {
  const selected = event.target.closest('[data-path]');
  if (!selected) {
    return;
  }

  for (const sibling of setupOptions.querySelectorAll('.card')) {
    sibling.classList.remove('selected');
  }

  selected.classList.add('selected');
  showPanel(templatesPanel);
  renderTemplates();
});

sandboxBtn.addEventListener('click', () => {
  if (!selectedTemplate) {
    actionLog.textContent = 'Choose a template before running sandbox tests.';
    return;
  }

  actionLog.textContent = 'Sandbox test passed. Commands responded in isolated server environment.';
  metricErrors.textContent = '0';
});

deployBtn.addEventListener('click', () => {
  if (!selectedTemplate) {
    actionLog.textContent = 'Select a template first, then deploy in one click.';
    return;
  }

  actionLog.textContent = 'Deployment complete. Your updated bot configuration is now live.';
  metricStatus.textContent = 'Online';
});
