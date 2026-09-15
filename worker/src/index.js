// Worker Cloudflare : stocke les données du tournoi (KV) et vérifie le code admin.
//   GET    /donnees  → { donnees: {…} | null, matchs: {…} }         (public)
//   POST   /login    → 204 si le code est bon                      (Authorization: Bearer <code>)
//   PUT    /donnees  → enregistre { donnees, base }                 (Authorization: Bearer <code>)
//   DELETE /donnees  → efface tout, le site revient à data.js       (Authorization: Bearer <code>)
// « matchs » = anciens scores enregistrés avant l'édition complète (lus seulement tant que « donnees » est vide).

const STATUTS = ["a-venir", "live", "termine"];
const MAX_ECHECS = 5;          // essais ratés permis…
const BLOCAGE_SECONDES = 900;  // …avant un blocage de 15 minutes par adresse IP
const TAILLE_MAX = 500_000;    // octets

export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ORIGINE || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

    if (req.method === "GET" && pathname === "/donnees") {
      const [donnees, matchs] = await Promise.all([env.SCORES.get("donnees", "json"), env.SCORES.get("matchs", "json")]);
      return repondre({ donnees, matchs: matchs || {} });
    }

    const protegee = (req.method === "POST" && pathname === "/login") ||
      (["PUT", "DELETE"].includes(req.method) && pathname === "/donnees");
    if (!protegee) return repondre({ erreur: "Introuvable." }, 404);

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

    if (req.method === "DELETE") {
      await Promise.all([env.SCORES.delete("donnees"), env.SCORES.delete("matchs")]);
      return repondre(null, 204);
    }

    const brut = await req.text();
    if (brut.length > TAILLE_MAX) return repondre({ erreur: "Données trop volumineuses." }, 413);
    let corps;
    try { corps = JSON.parse(brut); } catch { return repondre({ erreur: "JSON invalide." }, 400); }
    if (!corps || typeof corps.donnees !== "object") return repondre({ erreur: "Données invalides." }, 400);

    // Refuse d'écraser une version plus récente enregistrée par quelqu'un d'autre.
    const actuelles = await env.SCORES.get("donnees", "json");
    if (actuelles && actuelles.maj > (+corps.base || 0)) {
      return repondre({ erreur: "Les données ont été modifiées ailleurs. Ferme et rouvre le portail pour recharger." }, 409);
    }

    const donnees = nettoyer(corps.donnees);
    donnees.maj = Date.now();
    await env.SCORES.put("donnees", JSON.stringify(donnees));
    return repondre({ donnees });
  },
};

function codeValide(recu, attendu) {
  const a = new TextEncoder().encode(recu);
  const b = new TextEncoder().encode(attendu);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

// Ne garde que les champs connus, avec les bons types.
function nettoyer(d) {
  const texte = (v, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const liste = (v, max) => (Array.isArray(v) ? v.slice(0, max) : []);
  const score = (v) => (Number.isInteger(v) && v >= 0 && v <= 99 ? v : null);

  const calendrier = liste(d.calendrier, 50).map((s) => ({
    semaine: texte(s && s.semaine),
    matchs: liste(s && s.matchs, 100).map((m) => {
      m = m || {};
      let scoreA = score(m.scoreA), scoreB = score(m.scoreB);
      if (scoreA === null || scoreB === null) scoreA = scoreB = null;
      return {
        date: texte(m.date), heure: texte(m.heure, 20),
        equipeA: texte(m.equipeA), equipeB: texte(m.equipeB),
        scoreA, scoreB,
        statut: STATUTS.includes(m.statut) ? m.statut : "a-venir",
      };
    }),
  }));

  const classements = {};
  Object.keys(d.classements || {}).slice(0, 10).forEach((g) => {
    const cle = texte(g, 3);
    if (cle) classements[cle] = liste(d.classements[g], 50).map((r) => ({ equipe: texte(r && r.equipe) })).filter((r) => r.equipe);
  });

  const equipes = liste(d.equipes, 50).map((e) => {
    e = e || {};
    return {
      nom: texte(e.nom), groupe: texte(e.groupe, 3),
      joueurs: liste(e.joueurs, 40).map((j) => {
        j = j || {};
        const o = { nom: texte(j.nom) };
        if (j.capitaine === true) o.capitaine = true;
        if (j.gardien === true) o.gardien = true;
        return o;
      }).filter((j) => j.nom),
      coach: texte(e.coach), assistant: texte(e.assistant),
    };
  });

  return { calendrier, classements, equipes };
}
