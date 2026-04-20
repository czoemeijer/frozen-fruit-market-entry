async function loadMetrics() {
  const response = await fetch('/_ops/metrics');
  if (!response.ok) {
    throw new Error('Failed to load metrics');
  }
  const payload = await response.json();
  return payload.data;
}

function renderOverview(overview) {
  const target = document.getElementById('overview-cards');
  const cards = [
    { label: 'Opens', value: overview.opens },
    { label: 'Submits', value: overview.submits },
    { label: 'Completion %', value: `${overview.completion_rate_pct}%` },
    { label: 'Avg Step Time', value: `${Math.round(overview.avg_step_time_ms / 1000)}s` }
  ];

  target.innerHTML = cards
    .map(item => `<article class="card"><div class="label">${item.label}</div><div class="value">${item.value}</div></article>`)
    .join('');
}

function renderTable(containerId, headers, rows) {
  const container = document.getElementById(containerId);
  const thead = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  const tbody = rows.length
    ? rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${headers.length}" class="muted">No data</td></tr>`;

  container.innerHTML = `<table class="table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}

function renderDropoff(stepDropoff) {
  renderTable(
    'dropoff-table',
    ['Step', 'Views', 'Next', 'Drop-off', 'Drop-off %'],
    stepDropoff.map(item => [item.step, item.views, item.next, item.dropoff_count, `${item.dropoff_rate_pct}%`])
  );
}

function renderLanguage(languageDistribution) {
  renderTable(
    'lang-table',
    ['Lang', 'Count'],
    languageDistribution.map(item => [item.language || '(unknown)', item.count])
  );
}

function renderSource(sourceDistribution) {
  renderTable(
    'source-table',
    ['Source', 'Count'],
    sourceDistribution.map(item => [item.source, item.count])
  );
}

function renderQuality(quality) {
  const target = document.getElementById('quality-box');
  target.innerHTML = `
    <p><strong>Flat score responses:</strong> ${quality.flat_score_responses}</p>
    <p class="muted">Flat scores can indicate low-engagement or speed-run responses.</p>
  `;
}

async function bootstrap() {
  try {
    const data = await loadMetrics();
    renderOverview(data.overview);
    renderDropoff(data.step_dropoff);
    renderLanguage(data.language_distribution);
    renderSource(data.source_distribution);
    renderQuality(data.quality);
  } catch (error) {
    document.body.innerHTML = `<main class="container"><h1>Survey Quality Dashboard</h1><p class="muted">${error.message}</p></main>`;
  }
}

bootstrap();
