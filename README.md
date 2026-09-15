# Tournoi 7v7 Brébeuf — site

Site statique d'une page. Ouvre simplement `index.html` dans un navigateur : aucun serveur, aucun build.

- `index.html` — mise en page et style (pas besoin d'y toucher pour les mises à jour).
- `data.js` — **toutes les données** : calendrier, classements, équipes.

> ⚠️ Écris les noms d'équipes exactement de la même façon partout (accents compris).
> Après une modification, recharge la page. Si une section est vide, il y a probablement une virgule ou un guillemet manquant dans `data.js`.

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

## Mettre à jour les classements

Les classements ne se calculent **pas** à partir des scores : mets à jour `v`, `n`, `d`, `bp`, `bc` de chaque équipe dans `classements`.
MJ, DB et PTS (3 par victoire, 1 par nul) sont calculés automatiquement, et le tableau est trié par PTS puis DB.

```js
{ equipe: "FC Sans Mounes", v: 1, n: 0, d: 0, bp: 3, bc: 1 },
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
