/**
 * Cloudflare Worker for the Krunchies website, survey API, analytics and D1-backed dashboard.
 */

const SURVEY_SCHEMA = `
  CREATE TABLE IF NOT EXISTS survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    language TEXT,
    age TEXT,
    children TEXT,
    purchase_frequency TEXT,
    preference TEXT,
    intent INTEGER,
    psm_too_cheap INTEGER,
    psm_cheap INTEGER,
    psm_expensive INTEGER,
    psm_too_expensive INTEGER,
    local_importance INTEGER,
    premium_wtp TEXT,
    main_barrier TEXT,
    franui_visual INTEGER,
    franui_quality INTEGER,
    franui_health INTEGER,
    berrie_visual INTEGER,
    berrie_quality INTEGER,
    berrie_health INTEGER,
    client_ip TEXT
  )
`;

const ANALYTICS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS survey_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    event_type TEXT,
    step TEXT,
    duration_ms INTEGER,
    language TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    client_ip TEXT
  )
`;

function jsonResponse(payload, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders
    }
  });
}

async function ensureResponseSchema(db) {
  await db.prepare(SURVEY_SCHEMA).run();
  const info = await db.prepare("PRAGMA table_info(survey_responses)").all();
  const columns = new Set((info.results ?? []).map((column) => column.name));
  const optionalColumns = [
    ["session_id", "TEXT"],
    ["utm_source", "TEXT"],
    ["utm_medium", "TEXT"],
    ["utm_campaign", "TEXT"]
  ];

  for (const [name, type] of optionalColumns) {
    if (!columns.has(name)) {
      await db.prepare(`ALTER TABLE survey_responses ADD COLUMN ${name} ${type}`).run();
    }
  }
}

async function ensureAnalyticsSchema(db) {
  await db.prepare(ANALYTICS_SCHEMA).run();
}

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeRows(result) {
  return result?.results ?? [];
}

async function distribution(db, column, alias = "value") {
  const rows = await db.prepare(`
    SELECT COALESCE(NULLIF(${column}, ''), '(unknown)') AS ${alias}, COUNT(*) AS count
    FROM survey_responses
    GROUP BY ${column}
    ORDER BY count DESC, ${column} ASC
  `).all();

  return normalizeRows(rows).map((row) => ({
    [alias]: row[alias],
    count: numberOrZero(row.count)
  }));
}

async function fetchMetrics(db) {
  await ensureResponseSchema(db);
  await ensureAnalyticsSchema(db);

  const [
    submitsRow,
    opensRow,
    stepRows,
    languageRows,
    sourceRows,
    avgTimeRow,
    qualityRow,
    priceRow,
    scoreRow,
    ageRows,
    frequencyRows,
    intentRows,
    premiumRows,
    channelRows,
    barrierRows,
    recentRows
  ] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS submits FROM survey_responses").first(),
    db.prepare("SELECT COUNT(DISTINCT NULLIF(session_id, '')) AS opens FROM survey_events WHERE event_type = 'survey_open'").first(),
    db.prepare(`
      SELECT step, COUNT(*) AS views
      FROM survey_events
      WHERE event_type = 'step_view' AND step IS NOT NULL
      GROUP BY step
      ORDER BY CAST(step AS INTEGER)
    `).all(),
    db.prepare(`
      SELECT COALESCE(NULLIF(language, ''), '(unknown)') AS language, COUNT(*) AS count
      FROM survey_responses
      GROUP BY language
      ORDER BY count DESC
    `).all(),
    db.prepare(`
      SELECT COALESCE(NULLIF(utm_source, ''), '(direct)') AS source, COUNT(*) AS count
      FROM survey_responses
      GROUP BY source
      ORDER BY count DESC
    `).all(),
    db.prepare(`
      SELECT AVG(duration_ms) AS avg_step_time_ms
      FROM survey_events
      WHERE event_type = 'step_time' AND duration_ms IS NOT NULL AND duration_ms > 0
    `).first(),
    db.prepare(`
      SELECT
        COUNT(*) AS response_count,
        SUM(CASE WHEN franui_visual = franui_quality
          AND franui_quality = franui_health
          AND franui_health = berrie_visual
          AND berrie_visual = berrie_quality
          AND berrie_quality = berrie_health THEN 1 ELSE 0 END) AS flat_score_responses
      FROM survey_responses
    `).first(),
    db.prepare(`
      SELECT
        AVG(psm_too_cheap) AS avg_too_cheap,
        AVG(psm_cheap) AS avg_cheap,
        AVG(psm_expensive) AS avg_expensive,
        AVG(psm_too_expensive) AS avg_too_expensive
      FROM survey_responses
      WHERE psm_too_cheap > 0
        AND psm_cheap > 0
        AND psm_expensive > 0
        AND psm_too_expensive > 0
    `).first(),
    db.prepare(`
      SELECT
        AVG(intent) AS avg_intent,
        AVG(local_importance) AS avg_local_importance,
        AVG((berrie_visual + berrie_quality + berrie_health) / 3.0) AS avg_krunchies_score,
        AVG((franui_visual + franui_quality + franui_health) / 3.0) AS avg_franui_score
      FROM survey_responses
    `).first(),
    db.prepare(`SELECT COALESCE(NULLIF(age, ''), '(unknown)') AS value, COUNT(*) AS count FROM survey_responses GROUP BY age ORDER BY count DESC`).all(),
    db.prepare(`SELECT COALESCE(NULLIF(purchase_frequency, ''), '(unknown)') AS value, COUNT(*) AS count FROM survey_responses GROUP BY purchase_frequency ORDER BY count DESC`).all(),
    db.prepare(`SELECT COALESCE(intent, 0) AS value, COUNT(*) AS count FROM survey_responses GROUP BY intent ORDER BY intent ASC`).all(),
    db.prepare(`SELECT COALESCE(NULLIF(premium_wtp, ''), '(unknown)') AS value, COUNT(*) AS count FROM survey_responses GROUP BY premium_wtp ORDER BY count DESC`).all(),
    db.prepare(`SELECT COALESCE(NULLIF(preference, ''), '(unknown)') AS value, COUNT(*) AS count FROM survey_responses GROUP BY preference ORDER BY count DESC`).all(),
    db.prepare(`SELECT COALESCE(NULLIF(main_barrier, ''), '(unknown)') AS value, COUNT(*) AS count FROM survey_responses GROUP BY main_barrier ORDER BY count DESC`).all(),
    db.prepare(`
      SELECT timestamp, language, age, purchase_frequency, intent,
        psm_cheap, psm_expensive, local_importance, premium_wtp, main_barrier
      FROM survey_responses
      ORDER BY datetime(timestamp) DESC, id DESC
      LIMIT 12
    `).all()
  ]);

  const submits = numberOrZero(submitsRow?.submits);
  const opens = numberOrZero(opensRow?.opens);
  const stepViews = Object.fromEntries(
    normalizeRows(stepRows).map((row) => [String(row.step), numberOrZero(row.views)])
  );
  const orderedSteps = ["0", "1", "2", "3", "4"];
  const stepDropoff = orderedSteps.map((step, index) => {
    const views = stepViews[step] ?? 0;
    const next = index === orderedSteps.length - 1 ? submits : (stepViews[orderedSteps[index + 1]] ?? 0);
    const dropoffCount = Math.max(views - next, 0);
    return {
      step,
      views,
      next,
      dropoff_count: dropoffCount,
      dropoff_rate_pct: views ? Math.round((dropoffCount / views) * 10000) / 100 : 0
    };
  });

  const mapDistribution = (rows, key = "value") => normalizeRows(rows).map((row) => ({
    [key]: row[key],
    count: numberOrZero(row.count)
  }));

  return {
    generated_at: new Date().toISOString(),
    overview: {
      opens,
      submits,
      completion_rate_pct: opens ? Math.round((submits / opens) * 10000) / 100 : 0,
      avg_step_time_ms: numberOrZero(avgTimeRow?.avg_step_time_ms)
    },
    step_dropoff: stepDropoff,
    language_distribution: normalizeRows(languageRows).map((row) => ({
      language: row.language,
      count: numberOrZero(row.count)
    })),
    source_distribution: normalizeRows(sourceRows).map((row) => ({
      source: row.source,
      count: numberOrZero(row.count)
    })),
    price_signal: {
      average_too_cheap: numberOrZero(priceRow?.avg_too_cheap),
      average_cheap: numberOrZero(priceRow?.avg_cheap),
      average_expensive: numberOrZero(priceRow?.avg_expensive),
      average_too_expensive: numberOrZero(priceRow?.avg_too_expensive)
    },
    distributions: {
      age: mapDistribution(ageRows),
      purchase_frequency: mapDistribution(frequencyRows),
      intent: mapDistribution(intentRows),
      premium_wtp: mapDistribution(premiumRows),
      purchase_channel: mapDistribution(channelRows),
      barrier: mapDistribution(barrierRows)
    },
    quality: {
      response_count: numberOrZero(qualityRow?.response_count),
      flat_score_responses: numberOrZero(qualityRow?.flat_score_responses),
      avg_intent: numberOrZero(scoreRow?.avg_intent),
      avg_local_importance: numberOrZero(scoreRow?.avg_local_importance),
      avg_krunchies_score: numberOrZero(scoreRow?.avg_krunchies_score),
      avg_franui_score: numberOrZero(scoreRow?.avg_franui_score)
    },
    recent_responses: normalizeRows(recentRows).map((row) => ({
      timestamp: row.timestamp,
      language: row.language || "(unknown)",
      age: row.age || "(unknown)",
      purchase_frequency: row.purchase_frequency || "(unknown)",
      intent: row.intent == null ? "" : numberOrZero(row.intent),
      psm_cheap: row.psm_cheap == null ? "" : numberOrZero(row.psm_cheap),
      psm_expensive: row.psm_expensive == null ? "" : numberOrZero(row.psm_expensive),
      local_importance: row.local_importance == null ? "" : numberOrZero(row.local_importance),
      premium_wtp: row.premium_wtp || "(unknown)",
      main_barrier: row.main_barrier || "(unknown)"
    }))
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (pathname === "/api/submit" || pathname === "/submit") {
      if (request.method !== "POST") {
        return jsonResponse({ status: "error", message: "Method not allowed" }, 405, corsHeaders);
      }

      try {
        const body = await request.json();
        if (body.website_url) {
          return jsonResponse({ status: "error", message: "Invalid submission" }, 400, corsHeaders);
        }
        if (!env.SURVEY_DB) {
          return jsonResponse({ status: "error", message: "SURVEY_DB binding is not configured" }, 503, corsHeaders);
        }

        await ensureResponseSchema(env.SURVEY_DB);
        await env.SURVEY_DB.prepare(`
          INSERT INTO survey_responses (
            language, age, children, purchase_frequency, preference, intent,
            psm_too_cheap, psm_cheap, psm_expensive, psm_too_expensive,
            local_importance, premium_wtp, main_barrier,
            franui_visual, franui_quality, franui_health,
            berrie_visual, berrie_quality, berrie_health, client_ip,
            session_id, utm_source, utm_medium, utm_campaign
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          body.lang ?? "cs",
          body.age ?? "",
          body.children ?? "",
          body.purchase_frequency ?? "",
          body.preference ?? "",
          numberOrZero(body.intent),
          numberOrZero(body.psm_too_cheap),
          numberOrZero(body.psm_cheap),
          numberOrZero(body.psm_expensive),
          numberOrZero(body.psm_too_expensive),
          numberOrZero(body.local_importance),
          body.premium_wtp ?? "",
          body.main_barrier ?? "",
          numberOrZero(body.franui_visual),
          numberOrZero(body.franui_quality),
          numberOrZero(body.franui_health),
          numberOrZero(body.berrie_visual ?? body.krunchies_visual),
          numberOrZero(body.berrie_quality ?? body.krunchies_quality),
          numberOrZero(body.berrie_health ?? body.krunchies_health),
          request.headers.get("CF-Connecting-IP") ?? "",
          body.session_id ?? "",
          body.utm_source ?? "",
          body.utm_medium ?? "",
          body.utm_campaign ?? ""
        ).run();

        return jsonResponse({ status: "success", message: "Response recorded" }, 200, corsHeaders);
      } catch (error) {
        return jsonResponse({ status: "error", message: error.message }, 500, corsHeaders);
      }
    }

    if (pathname === "/api/track" || pathname === "/track") {
      if (request.method !== "POST") {
        return jsonResponse({ status: "error", message: "Method not allowed" }, 405, corsHeaders);
      }

      try {
        const body = await request.json();
        if (!env.SURVEY_DB) {
          return jsonResponse({ status: "error", message: "SURVEY_DB binding is not configured" }, 503, corsHeaders);
        }
        await ensureAnalyticsSchema(env.SURVEY_DB);
        await env.SURVEY_DB.prepare(`
          INSERT INTO survey_events (
            session_id, event_type, step, duration_ms, language,
            utm_source, utm_medium, utm_campaign, client_ip
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          body.session_id ?? "",
          body.event_type ?? "",
          body.step ?? null,
          body.duration_ms == null ? null : numberOrZero(body.duration_ms),
          body.lang ?? body.language ?? "",
          body.utm_source ?? "",
          body.utm_medium ?? "",
          body.utm_campaign ?? "",
          request.headers.get("CF-Connecting-IP") ?? ""
        ).run();
        return jsonResponse({ status: "success", tracked: true }, 200, corsHeaders);
      } catch (error) {
        return jsonResponse({ status: "error", message: error.message }, 500, corsHeaders);
      }
    }

    if (pathname === "/_ops/metrics") {
      if (request.method !== "GET") {
        return jsonResponse({ status: "error", message: "Method not allowed" }, 405, corsHeaders);
      }
      if (!env.SURVEY_DB) {
        return jsonResponse({ status: "error", message: "SURVEY_DB binding is not configured" }, 503, corsHeaders);
      }
      try {
        const data = await fetchMetrics(env.SURVEY_DB);
        return jsonResponse({ status: "success", data }, 200, corsHeaders);
      } catch (error) {
        return jsonResponse({ status: "error", message: error.message }, 500, corsHeaders);
      }
    }

    if (pathname === "/health") {
      return jsonResponse({ status: "ok", database: Boolean(env.SURVEY_DB), assets: Boolean(env.ASSETS) }, 200, corsHeaders);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Krunchies Worker Ready", { status: 200 });
  }
};
