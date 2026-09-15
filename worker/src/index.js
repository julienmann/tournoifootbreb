// Worker Cloudflare : stocke les scores et statuts des matchs (KV) et vérifie le code admin.
//   GET  /matchs        → { "<id>": { scoreA, scoreB, statut }, … }   (public)
//   POST /login         → 204 si le code est bon                     (Authorization: Bearer <code>)
//   PUT  /matchs        → enregistre { id, scoreA, scoreB, statut }  (Authorization: Bearer <code>)

const STATUTS = ["a-venir", "live", "termine"];
const MAX_ECHECS = 5;          // essais ratés permis…
const BLOCAGE_SECONDES = 900;  // …avant un blocage de 15 minutes par adresse IP

export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ORIGINE || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
    const repondre = (corps, statut = 200) =>
      new Response(corps == null ? null : JSON.stringify(corps), {
        status: statut,
        headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
      });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const { pathname } = new URL(req.url);

    if (req.method === "GET" && pathname === "/matchs") {
      return repondre((await env.SCORES.get("matchs", "json")) || {});
    }

    if ((req.method === "POST" && pathname === "/login") || (req.method === "PUT" && pathname === "/matchs")) {
      const ip = req.headers.get("CF-Connecting-IP") || "inconnue";
      const cleEchecs = "echecs:" + ip;
      const echecs = +(await env.SCORES.get(cleEchecs)) || 0;
      if (echecs >= MAX_ECHECS) return repondre({ erreur: "Trop d'essais. Réessaie dans 15 minutes." }, 429);

      const code = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      if (!env.ADMIN_CODE || !codeValide(code, env.ADMIN_CODE)) {
        await env.SCORES.put(cleEchecs, String(echecs + 1), { expirationTtl: BLOCAGE_SECONDES });
        return repondre({ erreur: "Code invalide." }, 401);
      }

      if (pathname === "/login") return repondre(null, 204);

      let m;
      try { m = await req.json(); } catch { return repondre({ erreur: "JSON invalide." }, 400); }
      const score = (v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 99);
      if (typeof m.id !== "string" || !m.id || m.id.length > 300 || !score(m.scoreA) || !score(m.scoreB) || !STATUTS.includes(m.statut)) {
        return repondre({ erreur: "Données invalides." }, 400);
      }

      const matchs = (await env.SCORES.get("matchs", "json")) || {};
      matchs[m.id] = { scoreA: m.scoreA, scoreB: m.scoreB, statut: m.statut };
      await env.SCORES.put("matchs", JSON.stringify(matchs));
      return repondre(matchs[m.id]);
    }

    return repondre({ erreur: "Introuvable." }, 404);
  },
};

function codeValide(recu, attendu) {
  const a = new TextEncoder().encode(recu);
  const b = new TextEncoder().encode(attendu);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}
