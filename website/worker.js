/**
 * Cloudflare Worker for Krunchies Official Website & Market Survey Backend
 * Handles static asset serving via env.ASSETS and D1 Database persistent storage.
 */

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

async function ensureAnalyticsSchema(db) {
  await db.prepare(ANALYTICS_SCHEMA).run();
}

async function fetchMetrics(db) {
  await ensureAnalyticsSchema(db);

  const submitsRow = await db
    .prepare("SELECT COUNT(*) AS submits FROM survey_responses")
    .first();
  const opensRow = await db
    .prepare("SELECT COUNT(DISTINCT session_id) AS opens FROM survey_events WHERE event_type = 'survey_open'")
    .first();

  const submits = Number(submitsRow?.submits ?? 0);
  const opens = Number(opensRow?.opens ?? 0);
  const completionRate = opens ? Math.round((submits / opens) * 10000) / 100 : 0;

  const stepRows = await db
    .prepare(`
      SELECT step, COUNT(*) AS views
      FROM survey_events
      WHERE event_type = 'step_view' AND step IS NOT NULL
      GROUP BY step
      ORDER BY CAST(step AS INTEGER)
    `)
    .all();
  const stepViews = Object.fromEntries(
    (stepRows.results ?? []).map((row) => [String(row.step), Number(row.views ?? 0)])
  );

  const orderedSteps = ["0", "1", "2", "3", "4"];
  const stepDropoff = orderedSteps.map((step, index) => {
    const views = stepViews[step] ?? 0;
    const next = index === orderedSteps.length - 1
      ? submits
      : (stepViews[orderedSteps[index + 1]] ?? 0);
    const dropoffCount = Math.max(views - next, 0);
    return {
      step,
      views,
      next,
      dropoff_count: dropoffCount,
      dropoff_rate_pct: views ? Math.round((dropoffCount / views) * 10000) / 100 : 0
    };
  });

  const languageRows = await db
    .prepare(`
      SELECT COALESCE(NULLIF(language, ''), '(unknown)') AS language, COUNT(*) AS count
      FROM survey_responses
      GROUP BY language
      ORDER BY count DESC
    `)
    .all();

  // The current D1 response schema does not include UTM columns. Keep the
  // dashboard useful by reporting all submitted responses as direct traffic.
  const sourceDistribution = submits
    ? [{ source: "(direct)", count: submits }]
    : [];

  const avgTimeRow = await db
    .prepare(`
      SELECT AVG(duration_ms) AS avg_step_time_ms
      FROM survey_events
      WHERE event_type = 'step_time' AND duration_ms IS NOT NULL AND duration_ms > 0
    `)
    .first();

  const flatScoreRow = await db
    .prepare(`
      SELECT COUNT(*) AS flat_score_responses
      FROM survey_responses
      WHERE franui_visual = franui_quality
        AND franui_quality = franui_health
        AND franui_health = berrie_visual
        AND berrie_visual = berrie_quality
        AND berrie_quality = berrie_health
    `)
    .first();

  return {
    overview: {
      opens,
      submits,
      completion_rate_pct: completionRate,
      avg_step_time_ms: Number(avgTimeRow?.avg_step_time_ms ?? 0)
    },
    step_dropoff: stepDropoff,
    language_distribution: (languageRows.results ?? []).map((row) => ({
      language: row.language,
      count: Number(row.count ?? 0)
    })),
    source_distribution: sourceDistribution,
    quality: {
      flat_score_responses: Number(flatScoreRow?.flat_score_responses ?? 0)
    }
  };
}

export default {
  async fetch(request, env, ctx) {
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

    // 1. Survey Submit API Endpoint
    if (pathname === "/api/submit" || pathname === "/submit") {
      if (request.method !== "POST") {
        return jsonResponse({ status: "error", message: "Method not allowed" }, 405, corsHeaders);
      }

      try {
        const body = await request.json();

        // Save to D1 database if SURVEY_DB binding exists
        if (env.SURVEY_DB) {
          const stmt = env.SURVEY_DB.prepare(`
            INSERT INTO survey_responses (
              language, age, children, purchase_frequency, preference, intent,
              psm_too_cheap, psm_cheap, psm_expensive, psm_too_expensive,
              local_importance, premium_wtp, main_barrier,
              franui_visual, franui_quality, franui_health,
              berrie_visual, berrie_quality, berrie_health, client_ip
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            body.lang ?? "cs",
            body.age ?? "",
            body.children ?? "",
            body.purchase_frequency ?? "",
            body.preference ?? "",
            Number(body.intent ?? 0),
            Number(body.psm_too_cheap ?? 0),
            Number(body.psm_cheap ?? 0),
            Number(body.psm_expensive ?? 0),
            Number(body.psm_too_expensive ?? 0),
            Number(body.local_importance ?? 0),
            body.premium_wtp ?? "",
            body.main_barrier ?? "",
            Number(body.franui_visual ?? 0),
            Number(body.franui_quality ?? 0),
            Number(body.franui_health ?? 0),
            Number(body.berrie_visual ?? body.krunchies_visual ?? 0),
            Number(body.berrie_quality ?? body.krunchies_quality ?? 0),
            Number(body.berrie_health ?? body.krunchies_health ?? 0),
            request.headers.get("CF-Connecting-IP") ?? ""
          );
          await stmt.run();
        }

        return jsonResponse({ status: "success", message: "Response recorded" }, 200, corsHeaders);
      } catch (error) {
        return jsonResponse({ status: "error", message: error.message }, 500, corsHeaders);
      }
    }

    // 2. Tracking Analytics Endpoint
    if (pathname === "/api/track" || pathname === "/track") {
      if (request.method !== "POST") {
        return jsonResponse({ status: "error", message: "Method not allowed" }, 405, corsHeaders);
      }

      try {
        const body = await request.json();
        if (env.SURVEY_DB) {
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
            body.duration_ms == null ? null : Number(body.duration_ms),
            body.lang ?? body.language ?? "",
            body.utm_source ?? "",
            body.utm_medium ?? "",
            body.utm_campaign ?? "",
            request.headers.get("CF-Connecting-IP") ?? ""
          ).run();
        }
        return jsonResponse({ status: "success", tracked: true }, 200, corsHeaders);
      } catch (error) {
        return jsonResponse({ status: "error", message: error.message }, 500, corsHeaders);
      }
    }

    // 3. D1-backed admin metrics endpoint used by survey/dashboard.html.
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

    // 4. Serve Static Assets (Official Website & Integrated Survey)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Krunchies Worker Ready", { status: 200 });
  }
};
