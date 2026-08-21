const INTENT_LABELS = {
  1: 'Definitely no',
  2: 'Probably no',
  3: 'Not sure',
  4: 'Probably yes',
  5: 'Definitely yes'
};

const PREMIUM_LABELS = {
  no: 'No premium',
  up_to_10: 'Up to +10%',
  '10_to_25': '+10% to +25%',
  over_25: 'More than +25%'
};

const FREQUENCY_LABELS = {
  weekly: 'Weekly or more',
  monthly: '2–3 times / month',
  rarely: 'Every 1–2 months',
  never: 'Almost never'
};

const CHANNEL_LABELS = {
  supermarket: 'Supermarket / hypermarket',
  convenience: 'Convenience store',
  ecommerce: 'Online / delivery',
  specialty: 'Specialty store'
};

const BARRIER_LABELS = {
  price: 'Price too high',
  sugar: 'Sugar / calorie concern',
  availability: 'Not available nearby',
  brand: 'Unknown brand'
};

const FLAVOR_LABELS = {
  banana: 'Banana Bites',
  strawberry: 'Strawberry Blast',
  mango: 'Mango Crunch'
};

let dashboardPasscode = '';

function accessStorageKey() {
  const now = new Date();
  return `krunchies_dashboard_access_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function number(value, digits = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '—';
  return parsed.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function labelFor(value, labels = {}) {
  return labels[value] || value || '(unknown)';
}

async function loadMetrics() {
  const response = await fetch('/_ops/metrics', {
    headers: {
      Accept: 'application/json',
      'X-Krunchies-Dashboard-Day': dashboardPasscode
    }
  });
  let payload = null;
  try { payload = await response.json(); } catch { /* handled below */ }
  if (!response.ok || payload?.status !== 'success' || !payload?.data) {
    throw new Error(payload?.message || `Metrics endpoint returned HTTP ${response.status}`);
  }
  return payload.data;
}

function renderOverview(overview, quality) {
  const target = document.getElementById('overview-cards');
  const cards = [
    { label: 'Survey opens', value: number(overview?.opens), detail: 'unique tracked sessions' },
    { label: 'Completed', value: number(overview?.submits), detail: 'stored responses' },
    { label: 'Completion', value: `${number(overview?.completion_rate_pct, 1)}%`, detail: 'submits / opens' },
    { label: 'Average response', value: `${number(overview?.avg_step_time_ms / 1000, 1)}s`, detail: `${number(quality?.response_count)} response records` }
  ];
  target.innerHTML = cards.map((item) => `
    <article class="card">
      <div class="label">${escapeHtml(item.label)}</div>
      <div class="value">${escapeHtml(item.value)}</div>
      <div class="detail">${escapeHtml(item.detail)}</div>
    </article>
  `).join('');
}

function renderTable(containerId, headers, rows, empty = 'No data yet') {
  const container = document.getElementById(containerId);
  const thead = `<tr>${headers.map((header) => `<th>${escapeHtml(header.label || header)}</th>`).join('')}</tr>`;
  const tbody = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td${cell?.numeric ? ' class="numeric"' : ''}>${cell?.html ?? escapeHtml(cell)}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${headers.length}" class="muted">${escapeHtml(empty)}</td></tr>`;
  container.innerHTML = `<table class="table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}

function renderDistribution(containerId, items, labels = {}) {
  const values = (items || []).map((item) => Number(item.count) || 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...values, 1);
  const rows = (items || []).map((item, index) => {
    const count = values[index];
    const percentage = total ? (count / total) * 100 : 0;
    return [{ html: `<div class="bar-cell"><div class="bar-label"><span>${escapeHtml(labelFor(item.value, labels))}</span><strong>${number(count)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(percentage, count ? 2 : 0)}%"></div></div></div>` }];
  });
  renderTable(containerId, [{ label: 'Distribution' }], rows);
}

function renderPriceSignal(signal) {
  const target = document.getElementById('price-signal');
  const points = [
    ['Too cheap', signal?.average_too_cheap],
    ['Good value', signal?.average_cheap],
    ['Expensive', signal?.average_expensive],
    ['Too expensive', signal?.average_too_expensive]
  ];
  target.innerHTML = points.map(([label, value]) => `
    <div class="price-point"><div class="price-label">${escapeHtml(label)}</div><div class="price-value">${number(value, 0)} Kč</div></div>
  `).join('');
}

function renderDropoff(stepDropoff) {
  renderTable('dropoff-table', ['Step', 'Views', 'Next', 'Drop-off', 'Drop-off %'], (stepDropoff || []).map((item) => [
    item.step,
    { numeric: true, html: number(item.views) },
    { numeric: true, html: number(item.next) },
    { numeric: true, html: number(item.dropoff_count) },
    { numeric: true, html: `${number(item.dropoff_rate_pct, 1)}%` }
  ]));
}

function renderQuality(quality) {
  const items = [
    ['Avg. intent', `${number(quality?.avg_intent, 1)} / 5`],
    ['Avg. Krunchies score', `${number(quality?.avg_krunchies_score, 1)} / 10`],
    ['Avg. Franui score', `${number(quality?.avg_franui_score, 1)} / 10`],
    ['Flat-score responses', `${number(quality?.flat_score_responses)} / ${number(quality?.response_count)}`]
  ];
  document.getElementById('quality-box').innerHTML = items.map(([label, value]) => `<div class="quality-item"><div class="quality-label">${escapeHtml(label)}</div><div class="quality-value">${escapeHtml(value)}</div></div>`).join('');
}

function renderRecentResponses(responses) {
  renderTable('recent-table', ['Time', 'Lang', 'Age', 'Frequency', 'Intent', 'Good value', 'Expensive', 'Local 0–10', 'Premium', 'Barrier'], (responses || []).map((row) => [
    row.timestamp ? new Date(row.timestamp.replace(' ', 'T') + (row.timestamp.endsWith('Z') ? '' : 'Z')).toLocaleString() : '—',
    row.language,
    row.age,
    labelFor(row.purchase_frequency, FREQUENCY_LABELS),
    `${number(row.intent)} / 5`,
    `${number(row.psm_cheap)} Kč`,
    `${number(row.psm_expensive)} Kč`,
    number(row.local_importance),
    labelFor(row.premium_wtp, PREMIUM_LABELS),
    labelFor(row.main_barrier, BARRIER_LABELS)
  ]));
}

function setStatus(message = '', isError = false) {
  const target = document.getElementById('dashboard-status');
  target.textContent = message;
  target.style.color = isError ? 'var(--accent-dark)' : 'var(--muted)';
}

async function refreshDashboard() {
  const button = document.getElementById('refresh-button');
  button.disabled = true;
  setStatus('Loading metrics…');
  try {
    const data = await loadMetrics();
    renderOverview(data.overview, data.quality);
    renderPriceSignal(data.price_signal);
    renderDistribution('age-table', data.distributions?.age);
    renderDistribution('frequency-table', data.distributions?.purchase_frequency, FREQUENCY_LABELS);
    renderDistribution('intent-table', data.distributions?.intent, INTENT_LABELS);
    renderDistribution('premium-table', data.distributions?.premium_wtp, PREMIUM_LABELS);
    renderDistribution('channel-table', data.distributions?.purchase_channel, CHANNEL_LABELS);
    renderDistribution('barrier-table', data.distributions?.barrier, BARRIER_LABELS);
    renderDistribution('flavor-table', data.distributions?.favorite_flavor, FLAVOR_LABELS);
    renderDropoff(data.step_dropoff);
    renderTable('lang-table', ['Language', 'Count'], (data.language_distribution || []).map((item) => [item.language, { numeric: true, html: number(item.count) }]));
    renderTable('source-table', ['Source', 'Count'], (data.source_distribution || []).map((item) => [item.source, { numeric: true, html: number(item.count) }]));
    renderQuality(data.quality);
    renderRecentResponses(data.recent_responses);
    const updated = data.generated_at ? new Date(data.generated_at).toLocaleString() : 'just now';
    document.getElementById('last-updated').textContent = `Updated ${updated}`;
    setStatus('Metrics loaded');
  } catch (error) {
    setStatus(error.message || 'Failed to load metrics', true);
    if (/HTTP 401|unauthorized/i.test(error.message || '')) lockDashboard('The passcode is no longer valid. Enter today’s date.');
  } finally {
    button.disabled = false;
  }
}

function unlockDashboard() {
  document.getElementById('dashboard-lock').hidden = true;
  document.getElementById('dashboard-content').hidden = false;
  document.getElementById('dashboard-legal').hidden = false;
  refreshDashboard();
}

function lockDashboard(message = '') {
  dashboardPasscode = '';
  sessionStorage.removeItem(accessStorageKey());
  document.getElementById('dashboard-lock').hidden = false;
  document.getElementById('dashboard-content').hidden = true;
  document.getElementById('dashboard-legal').hidden = true;
  document.getElementById('dashboard-lock-error').textContent = message;
  document.getElementById('dashboard-passcode').focus();
}

document.getElementById('refresh-button').addEventListener('click', refreshDashboard);
document.getElementById('dashboard-unlock-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.getElementById('dashboard-passcode');
  const error = document.getElementById('dashboard-lock-error');
  dashboardPasscode = input.value.trim();
  error.textContent = '';
  if (!/^\d{1,2}$/.test(dashboardPasscode)) {
    error.textContent = 'Enter today’s date as a number from 1 to 31.';
    return;
  }
  try {
    await loadMetrics();
    sessionStorage.setItem(accessStorageKey(), dashboardPasscode);
    unlockDashboard();
  } catch (requestError) {
    dashboardPasscode = '';
    input.select();
    error.textContent = 'Incorrect passcode. Please enter today’s date.';
  }
});

const savedPasscode = sessionStorage.getItem(accessStorageKey());
if (savedPasscode) {
  dashboardPasscode = savedPasscode;
  unlockDashboard();
} else {
  document.getElementById('dashboard-passcode').focus();
}
