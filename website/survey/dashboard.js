const DASHBOARD_TRANSLATIONS = {
  en: {
    lock_eyebrow: 'KRUNCHIES / PRIVATE RESEARCH', lock_title: 'Dashboard access', lock_description: 'This area contains internal market-research results.', lock_label: 'Access code', lock_button: 'Unlock dashboard', home: 'Home', ops_eyebrow: 'KRUNCHIES / RESEARCH OPS', dashboard_title: 'Survey Quality Dashboard', dashboard_subtitle: 'A compact view of response volume, price expectations and audience signals.', waiting: 'Waiting for data', refresh: 'Refresh', price_signal: 'PRICE SIGNAL', price_title: 'Price Sensitivity Meter', price_note: 'Average selected price for the 150 g pack.', audience: 'Audience mix', who_answered: 'Who answered', purchase_frequency: 'Purchase frequency', purchase_intent: 'Purchase intent', five_point: '5-point scale', local_premium: 'Local premium willingness', flavor_preference: 'Flavor preference', flavor_note: 'Most appealing packaging after review', preferred_channel: 'Preferred channel', where_buy: 'Where they would buy', purchase_barriers: 'Purchase barriers', conversion_blockers: 'What blocks conversion', funnel: 'Funnel drop-off', tracked_steps: 'Tracked survey steps', language: 'Language', submitted_responses: 'Submitted responses', traffic_source: 'Traffic source', utm_or_direct: 'UTM source or direct', response_quality: 'Response quality', quality_note: 'Useful checks, not a judgement', recent_responses: 'Recent responses', privacy_note: 'Personal IP addresses are never shown here.', legal_usage: 'Usage & copyright', legal_commercial: 'Commercial use requires a paid written license.',
    survey_opens: 'Survey opens', unique_sessions: 'unique tracked sessions', completed: 'Completed', stored_responses: 'stored responses', completion: 'Completion', submits_opens: 'submits / opens', average_response: 'Average response', response_records: 'response records', no_data: 'No data yet', distribution: 'Distribution', too_cheap: 'Too cheap', good_value: 'Good value', expensive: 'Expensive', too_expensive: 'Too expensive', step: 'Step', views: 'Views', next: 'Next', drop_off: 'Drop-off', drop_off_pct: 'Drop-off %', avg_intent: 'Avg. intent', avg_krunchies: 'Avg. Krunchies score', avg_franui: 'Avg. Franui score', flat_scores: 'Flat-score responses', time: 'Time', age: 'Age', frequency: 'Frequency', intent: 'Intent', local: 'Local 0–10', premium: 'Premium', barrier: 'Barrier', count: 'Count', source: 'Source', loading: 'Loading metrics…', metrics_loaded: 'Metrics loaded', updated: 'Updated', just_now: 'just now', invalid_access: 'Access code is not valid.', metrics_failed: 'Failed to load metrics'
  },
  cs: {
    lock_eyebrow: 'KRUNCHIES / SOUKROMÝ VÝZKUM', lock_title: 'Přístup do dashboardu', lock_description: 'Tato část obsahuje interní výsledky průzkumu trhu.', lock_label: 'Přístupový kód', lock_button: 'Odemknout dashboard', home: 'Domů', ops_eyebrow: 'KRUNCHIES / VÝZKUM', dashboard_title: 'Dashboard kvality průzkumu', dashboard_subtitle: 'Stručný přehled objemu odpovědí, cenových očekávání a signálů publika.', waiting: 'Čekání na data', refresh: 'Obnovit', price_signal: 'CENOVÝ SIGNÁL', price_title: 'Měřič cenové citlivosti', price_note: 'Průměrná zvolená cena balení 150 g.', audience: 'Složení respondentů', who_answered: 'Kdo odpovídal', purchase_frequency: 'Frekvence nákupu', purchase_intent: 'Nákupní záměr', five_point: 'Pětibodová škála', local_premium: 'Ochota připlatit za lokální produkt', flavor_preference: 'Preference příchutí', flavor_note: 'Nejlákavější obal po zhlédnutí', preferred_channel: 'Preferovaný kanál', where_buy: 'Kde by nakoupili', purchase_barriers: 'Bariéry nákupu', conversion_blockers: 'Co brání konverzi', funnel: 'Odpad ve funnelu', tracked_steps: 'Sledované kroky dotazníku', language: 'Jazyk', submitted_responses: 'Odeslané odpovědi', traffic_source: 'Zdroj návštěvnosti', utm_or_direct: 'UTM zdroj nebo přímá návštěva', response_quality: 'Kvalita odpovědí', quality_note: 'Užitečné kontroly, ne hodnocení', recent_responses: 'Poslední odpovědi', privacy_note: 'Osobní IP adresy se zde nikdy nezobrazují.', legal_usage: 'Použití a autorská práva', legal_commercial: 'Komerční použití vyžaduje placenou písemnou licenci.',
    survey_opens: 'Otevření dotazníku', unique_sessions: 'unikátních sledovaných relací', completed: 'Dokončeno', stored_responses: 'uložených odpovědí', completion: 'Dokončení', submits_opens: 'odeslání / otevření', average_response: 'Průměrná odpověď', response_records: 'záznamů odpovědí', no_data: 'Zatím žádná data', distribution: 'Rozdělení', too_cheap: 'Příliš levné', good_value: 'Výhodná cena', expensive: 'Drahé', too_expensive: 'Příliš drahé', step: 'Krok', views: 'Zobrazení', next: 'Další', drop_off: 'Odpad', drop_off_pct: 'Odpad %', avg_intent: 'Prům. záměr', avg_krunchies: 'Prům. skóre Krunchies', avg_franui: 'Prům. skóre Franui', flat_scores: 'Odpovědi se stejným skóre', time: 'Čas', age: 'Věk', frequency: 'Frekvence', intent: 'Záměr', local: 'Lokální 0–10', premium: 'Příplatek', barrier: 'Bariéra', count: 'Počet', source: 'Zdroj', loading: 'Načítání metrik…', metrics_loaded: 'Metriky načteny', updated: 'Aktualizováno', just_now: 'právě teď', invalid_access: 'Přístupový kód není platný.', metrics_failed: 'Metriky se nepodařilo načíst'
  }
};

let dashboardLanguage = 'en';
const dt = (key) => DASHBOARD_TRANSLATIONS[dashboardLanguage][key] || DASHBOARD_TRANSLATIONS.en[key] || key;

let INTENT_LABELS = {
  1: 'Definitely no',
  2: 'Probably no',
  3: 'Not sure',
  4: 'Probably yes',
  5: 'Definitely yes'
};

let PREMIUM_LABELS = {
  no: 'No premium',
  up_to_10: 'Up to +10%',
  '10_to_25': '+10% to +25%',
  over_25: 'More than +25%'
};

let FREQUENCY_LABELS = {
  weekly: 'Weekly or more',
  monthly: '2–3 times / month',
  rarely: 'Every 1–2 months',
  never: 'Almost never'
};

let CHANNEL_LABELS = {
  supermarket: 'Supermarket / hypermarket',
  convenience: 'Convenience store',
  ecommerce: 'Online / delivery',
  specialty: 'Specialty store'
};

let BARRIER_LABELS = {
  price: 'Price too high',
  sugar: 'Sugar / calorie concern',
  availability: 'Not available nearby',
  brand: 'Unknown brand'
};

let FLAVOR_LABELS = {
  banana: 'Banana Bites',
  strawberry: 'Strawberry Blast',
  mango: 'Mango Crunch'
};

function applyDashboardLanguage(language) {
  dashboardLanguage = language === 'cs' ? 'cs' : 'en';
  document.documentElement.lang = dashboardLanguage;
  localStorage.setItem('krunchies_language', dashboardLanguage);
  document.title = dashboardLanguage === 'cs' ? 'Dashboard průzkumu · Krunchies' : 'Survey Quality Dashboard · Krunchies';
  document.querySelectorAll('[data-dashboard-i18n]').forEach((element) => { element.textContent = dt(element.dataset.dashboardI18n); });
  document.querySelectorAll('[data-dashboard-lang]').forEach((button) => {
    const isActive = button.dataset.dashboardLang === dashboardLanguage;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  INTENT_LABELS = dashboardLanguage === 'cs' ? { 1: 'Určitě ne', 2: 'Spíše ne', 3: 'Nevím', 4: 'Spíše ano', 5: 'Určitě ano' } : { 1: 'Definitely no', 2: 'Probably no', 3: 'Not sure', 4: 'Probably yes', 5: 'Definitely yes' };
  PREMIUM_LABELS = dashboardLanguage === 'cs' ? { no: 'Bez příplatku', up_to_10: 'Až +10 %', '10_to_25': '+10 % až +25 %', over_25: 'Více než +25 %' } : { no: 'No premium', up_to_10: 'Up to +10%', '10_to_25': '+10% to +25%', over_25: 'More than +25%' };
  FREQUENCY_LABELS = dashboardLanguage === 'cs' ? { weekly: 'Týdně nebo častěji', monthly: '2–3× měsíčně', rarely: 'Každé 1–2 měsíce', never: 'Téměř nikdy' } : { weekly: 'Weekly or more', monthly: '2–3 times / month', rarely: 'Every 1–2 months', never: 'Almost never' };
  CHANNEL_LABELS = dashboardLanguage === 'cs' ? { supermarket: 'Supermarket / hypermarket', convenience: 'Večerka / convenience', ecommerce: 'Online / rozvoz', specialty: 'Specializovaná prodejna' } : { supermarket: 'Supermarket / hypermarket', convenience: 'Convenience store', ecommerce: 'Online / delivery', specialty: 'Specialty store' };
  BARRIER_LABELS = dashboardLanguage === 'cs' ? { price: 'Příliš vysoká cena', sugar: 'Obava z cukru / kalorií', availability: 'Není dostupné poblíž', brand: 'Neznámá značka' } : { price: 'Price too high', sugar: 'Sugar / calorie concern', availability: 'Not available nearby', brand: 'Unknown brand' };
  FLAVOR_LABELS = dashboardLanguage === 'cs' ? { banana: 'Banánové bites', strawberry: 'Jahodový výbuch', mango: 'Mangový křup' } : { banana: 'Banana Bites', strawberry: 'Strawberry Blast', mango: 'Mango Crunch' };
}

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
    { label: dt('survey_opens'), value: number(overview?.opens), detail: dt('unique_sessions') },
    { label: dt('completed'), value: number(overview?.submits), detail: dt('stored_responses') },
    { label: dt('completion'), value: `${number(overview?.completion_rate_pct, 1)}%`, detail: dt('submits_opens') },
    { label: dt('average_response'), value: `${number(overview?.avg_step_time_ms / 1000, 1)}s`, detail: `${number(quality?.response_count)} ${dt('response_records')}` }
  ];
  target.innerHTML = cards.map((item) => `
    <article class="card">
      <div class="label">${escapeHtml(item.label)}</div>
      <div class="value">${escapeHtml(item.value)}</div>
      <div class="detail">${escapeHtml(item.detail)}</div>
    </article>
  `).join('');
}

function renderTable(containerId, headers, rows, empty = dt('no_data')) {
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
  renderTable(containerId, [{ label: dt('distribution') }], rows);
}

function renderPriceSignal(signal) {
  const target = document.getElementById('price-signal');
  const points = [
    [dt('too_cheap'), signal?.average_too_cheap],
    [dt('good_value'), signal?.average_cheap],
    [dt('expensive'), signal?.average_expensive],
    [dt('too_expensive'), signal?.average_too_expensive]
  ];
  target.innerHTML = points.map(([label, value]) => `
    <div class="price-point"><div class="price-label">${escapeHtml(label)}</div><div class="price-value">${number(value, 0)} Kč</div></div>
  `).join('');
}

function renderDropoff(stepDropoff) {
  renderTable('dropoff-table', [dt('step'), dt('views'), dt('next'), dt('drop_off'), dt('drop_off_pct')], (stepDropoff || []).map((item) => [
    item.step,
    { numeric: true, html: number(item.views) },
    { numeric: true, html: number(item.next) },
    { numeric: true, html: number(item.dropoff_count) },
    { numeric: true, html: `${number(item.dropoff_rate_pct, 1)}%` }
  ]));
}

function renderQuality(quality) {
  const items = [
    [dt('avg_intent'), `${number(quality?.avg_intent, 1)} / 5`],
    [dt('avg_krunchies'), `${number(quality?.avg_krunchies_score, 1)} / 10`],
    [dt('avg_franui'), `${number(quality?.avg_franui_score, 1)} / 10`],
    [dt('flat_scores'), `${number(quality?.flat_score_responses)} / ${number(quality?.response_count)}`]
  ];
  document.getElementById('quality-box').innerHTML = items.map(([label, value]) => `<div class="quality-item"><div class="quality-label">${escapeHtml(label)}</div><div class="quality-value">${escapeHtml(value)}</div></div>`).join('');
}

function renderRecentResponses(responses) {
  renderTable('recent-table', [dt('time'), dt('language'), dt('age'), dt('frequency'), dt('intent'), dt('good_value'), dt('expensive'), dt('local'), dt('premium'), dt('barrier')], (responses || []).map((row) => [
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
  setStatus(dt('loading'));
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
    renderTable('lang-table', [dt('language'), dt('count')], (data.language_distribution || []).map((item) => [item.language, { numeric: true, html: number(item.count) }]));
    renderTable('source-table', [dt('source'), dt('count')], (data.source_distribution || []).map((item) => [item.source, { numeric: true, html: number(item.count) }]));
    renderQuality(data.quality);
    renderRecentResponses(data.recent_responses);
    const updated = data.generated_at ? new Date(data.generated_at).toLocaleString(dashboardLanguage === 'cs' ? 'cs-CZ' : 'en-GB') : dt('just_now');
    document.getElementById('last-updated').textContent = `${dt('updated')} ${updated}`;
    setStatus(dt('metrics_loaded'));
  } catch (error) {
    setStatus(error.message || dt('metrics_failed'), true);
    if (/HTTP 401|unauthorized/i.test(error.message || '')) lockDashboard(dt('invalid_access'));
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

const preferredDashboardLanguage = (navigator.languages || [navigator.language || 'en']).some((language) => String(language).toLowerCase().startsWith('cs')) ? 'cs' : 'en';
const savedDashboardLanguage = localStorage.getItem('krunchies_language');
applyDashboardLanguage(savedDashboardLanguage === 'cs' || savedDashboardLanguage === 'en' ? savedDashboardLanguage : preferredDashboardLanguage);
document.querySelectorAll('[data-dashboard-lang]').forEach((button) => button.addEventListener('click', () => {
  applyDashboardLanguage(button.dataset.dashboardLang);
  if (!document.getElementById('dashboard-content').hidden) refreshDashboard();
}));

document.getElementById('refresh-button').addEventListener('click', refreshDashboard);
document.getElementById('dashboard-unlock-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.getElementById('dashboard-passcode');
  const error = document.getElementById('dashboard-lock-error');
  dashboardPasscode = input.value.trim();
  error.textContent = '';
  if (!/^\d{1,2}$/.test(dashboardPasscode)) {
    error.textContent = dt('invalid_access');
    return;
  }
  try {
    await loadMetrics();
    sessionStorage.setItem(accessStorageKey(), dashboardPasscode);
    unlockDashboard();
  } catch (requestError) {
    dashboardPasscode = '';
    input.select();
    error.textContent = dt('invalid_access');
  }
});

const savedPasscode = sessionStorage.getItem(accessStorageKey());
if (savedPasscode) {
  dashboardPasscode = savedPasscode;
  unlockDashboard();
} else {
  document.getElementById('dashboard-passcode').focus();
}
