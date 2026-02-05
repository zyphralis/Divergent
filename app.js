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

let templatesCache = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.reason || payload.message || payload.error || 'Request failed.');
  }
  return payload;
}

function showPanel(panel) {
  panel.classList.remove('hidden');
}

function paintDashboard(state) {
  metricStatus.textContent = state.status;
  metricLatency.textContent = state.latency == null ? '-- ms' : `${state.latency} ms`;
  metricCommands.textContent = `${state.commands1h}`;
  metricErrors.textContent = `${state.errors1h}`;
  actionLog.textContent = state.lastAction;
}

function renderTemplates(templates) {
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

    button.addEventListener('click', async () => {
      try {
        for (const sibling of templateList.querySelectorAll('.card')) {
          sibling.classList.remove('selected');
        }
        button.classList.add('selected');

        const result = await request('/api/select-template', {
          method: 'POST',
          body: JSON.stringify({ templateId: template.id })
        });

        showPanel(dashboardPanel);
        paintDashboard(result.state);
      } catch (error) {
        actionLog.textContent = error.message;
      }
    });

    templateList.appendChild(button);
  });
}

verifyBtn.addEventListener('click', async () => {
  verifyStatus.classList.remove('ok', 'warn');

  try {
    const result = await request('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ token: tokenInput.value })
    });

    verifyStatus.classList.add('ok');
    verifyStatus.textContent = result.message;
    showPanel(pathPanel);
  } catch (error) {
    verifyStatus.classList.add('warn');
    verifyStatus.textContent = error.message;
    developerHelp.open = true;
  }
});

setupOptions.addEventListener('click', async (event) => {
  const selected = event.target.closest('[data-path]');
  if (!selected) {
    return;
  }

  for (const sibling of setupOptions.querySelectorAll('.card')) {
    sibling.classList.remove('selected');
  }
  selected.classList.add('selected');

  showPanel(templatesPanel);

  if (templatesCache.length === 0) {
    try {
      const result = await request('/api/templates');
      templatesCache = result.templates;
    } catch (error) {
      actionLog.textContent = error.message;
      return;
    }
  }

  renderTemplates(templatesCache);
});

sandboxBtn.addEventListener('click', async () => {
  try {
    const result = await request('/api/sandbox-test', { method: 'POST', body: '{}' });
    paintDashboard(result.state);
  } catch (error) {
    actionLog.textContent = error.message;
  }
});

deployBtn.addEventListener('click', async () => {
  try {
    const result = await request('/api/deploy', { method: 'POST', body: '{}' });
    paintDashboard(result.state);
  } catch (error) {
    actionLog.textContent = error.message;
  }
});

(async () => {
  try {
    const result = await request('/api/dashboard');
    paintDashboard(result.state);
  } catch {
    // Keep default fallback UI values.
  }
})();
