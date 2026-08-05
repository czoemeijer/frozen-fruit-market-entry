/**
 * Cloudflare Worker for Krunchies Official Website & Market Survey Backend
 * Handles static asset serving via env.ASSETS and D1 Database persistent storage.
 */

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
        return new Response(JSON.stringify({ status: "error", message: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
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

        return new Response(JSON.stringify({ status: "success", message: "Response recorded" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (error) {
        return new Response(JSON.stringify({ status: "error", message: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }

    // 2. Tracking Analytics Endpoint
    if (pathname === "/api/track" || pathname === "/track") {
      return new Response(JSON.stringify({ status: "success", tracked: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // 3. Serve Static Assets (Official Website & Integrated Survey)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Krunchies Worker Ready", { status: 200 });
  }
};
