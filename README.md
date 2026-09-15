# Tournoi 7v7 Brébeuf — site

Site statique d'une page. Ouvre simplement `index.html` dans un navigateur : aucun serveur, aucun build.

- `index.html` — mise en page et style (pas besoin d'y toucher pour les mises à jour).
- `data.js` — **toutes les données** : calendrier, classements, équipes.

> ⚠️ Écris les noms d'équipes exactement de la même façon partout (accents compris).
> Après une modification, recharge la page. Une fois le site en ligne, change aussi le numéro dans `<script src="data.js?v=2">` (index.html) — `v=3`, `v=4`… — sinon les téléphones peuvent garder l'ancienne version en mémoire. Si une section est vide, il y a probablement une virgule ou un guillemet manquant dans `data.js`.

## Ajouter un match

Dans `calendrier`, ajoute une ligne dans la bonne semaine :

```js
{ date: "Vendredi 25 septembre", heure: "12h45", equipeA: "SLA FC", equipeB: "BI Élite", scoreA: null, scoreB: null },
```

Pour une nouvelle semaine, ajoute un bloc `{ semaine: "Semaine 2 — …", matchs: [ … ] }` (un exemple est en commentaire dans le fichier).

## Entrer un score

Remplace les `null` du match par les buts :

```js
{ date: "Mercredi 16 septembre", heure: "12h45", equipeA: "FC Sans Mounes", equipeB: "SLA FC", scoreA: 3, scoreB: 1 },
```

Tant que `scoreA`/`scoreB` valent `null`, le match affiche « à venir ».

## Classements

Les classements se calculent **tout seuls** à partir des scores des matchs « Terminé » (entre deux équipes du même groupe) : 3 points par victoire, 1 par nul, tri par PTS puis DB puis BP.
Un match « Live » ne change pas l'ordre tant qu'il n'est pas marqué « Terminé ». Dans `classements`, il suffit de lister les équipes de chaque groupe :

```js
{ equipe: "FC Sans Mounes" },
```

## Ajouter une liste de joueurs

Dans `equipes`, remplis le tableau `joueurs` (vide = « Liste à venir ») ainsi que `coach` et `assistant` (laisse `""` pour masquer la ligne) :

```js
joueurs: [
  { nom: "Prénom Nom", capitaine: true },  // affiche (C)
  { nom: "Prénom Nom", gardien: true },    // affiche (GK)
  { nom: "Prénom Nom" },
],
coach: "Prénom Nom", assistant: "Prénom Nom",
```
# tournoifootbreb

## Portail admin

Le bouton **Admin** en haut à droite ouvre un portail protégé par un code à 6 chiffres. On peut y modifier **tout ce que contient `data.js`** :

- **Calendrier** — semaines, matchs (date, heure, équipes), scores et statut : **À venir**, **Live** ou **Terminé**.
- **Équipes** — nom, groupe, coach, assistant, joueurs (C = capitaine, GK = gardien). Le groupe place l'équipe dans les classements ; renommer une équipe met aussi à jour ses matchs.
- **Réglages** — « Effacer et revenir à data.js » efface tout ce qui a été enregistré dans le portail.

Rien n'est publié avant de cliquer sur **Enregistrer**. Les visiteurs voient les changements en moins d'une minute (la page se met à jour toute seule toutes les 30 secondes). Si deux personnes modifient en même temps, la deuxième doit rouvrir le portail avant d'enregistrer.

> ⚠️ Dès le premier enregistrement dans le portail, le site utilise les données du Worker Cloudflare (dossier `worker/`) et **ignore `data.js`**. Modifier `data.js` n'a alors plus d'effet, sauf après « Effacer et revenir à data.js ».

### Installation (une seule fois)

Il faut un compte Cloudflare (gratuit) et Node.js.

```bash
cd worker
npx wrangler login
npx wrangler kv namespace create SCORES   # copie l'id dans wrangler.toml
npx wrangler secret put ADMIN_CODE        # tape le code à 6 chiffres
npx wrangler deploy                       # affiche l'adresse du Worker
```

Colle ensuite l'adresse du Worker dans `data.js` (`api: "https://tournoi-brebeuf-api.<compte>.workers.dev"`) puis mets le site en ligne.
Pour plus de sécurité, remplace `ORIGINE = "*"` dans `wrangler.toml` par l'adresse du site et redéploie.

Changer le code : `npx wrangler secret put ADMIN_CODE`. Après 5 codes erronés, l'adresse IP est bloquée 15 minutes.
