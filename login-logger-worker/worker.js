const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Admin-Key"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json;charset=utf-8"
    }
  });
}

function unauthorized() {
  return json({ error: "unauthorized" }, 401);
}

function isAdmin(request, env) {
  const expected = env.ADMIN_KEY || "";
  const provided = request.headers.get("X-Admin-Key") || "";
  return Boolean(expected) && provided === expected;
}

function normalizeLog(input, request) {
  const cf = request.cf || {};
  return {
    id: input.id || crypto.randomUUID(),
    time: input.time || new Date().toISOString(),
    serverTime: new Date().toISOString(),
    role: input.role || "unknown",
    success: Boolean(input.success),
    ip: request.headers.get("CF-Connecting-IP") || input.ip || "",
    country: cf.country || "",
    city: cf.city || "",
    colo: cf.colo || "",
    device: input.device || "",
    os: input.os || "",
    browser: input.browser || "",
    screen: input.screen || "",
    language: input.language || "",
    timezone: input.timezone || "",
    userAgent: input.userAgent || request.headers.get("User-Agent") || ""
  };
}

async function readLogs(env) {
  const logs = await env.LOGIN_LOGS.get("logs", "json");
  return Array.isArray(logs) ? logs : [];
}

async function writeLogs(env, logs) {
  await env.LOGIN_LOGS.put("logs", JSON.stringify(logs.slice(0, 1000)));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (url.pathname !== "/logs") {
      return json({ error: "not_found" }, 404);
    }
    if (request.method === "POST") {
      let body = {};
      try {
        body = await request.json();
      } catch {
        body = {};
      }
      const log = normalizeLog(body, request);
      const logs = await readLogs(env);
      await writeLogs(env, [log, ...logs]);
      return json({ ok: true });
    }
    if (request.method === "GET") {
      if (!isAdmin(request, env)) return unauthorized();
      const logs = await readLogs(env);
      return json({ logs });
    }
    if (request.method === "DELETE") {
      if (!isAdmin(request, env)) return unauthorized();
      await writeLogs(env, []);
      return json({ ok: true });
    }
    return json({ error: "method_not_allowed" }, 405);
  }
};
