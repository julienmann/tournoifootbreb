// =====================================================================
//  Données du Tournoi 7v7 Brébeuf — Automne 2026
//  Modifie ce fichier pour mettre le site à jour (voir README.md).
//  Les noms d'équipes doivent être écrits EXACTEMENT pareil partout.
// =====================================================================

window.TOURNOI = {
  // Adresse du Worker Cloudflare (portail admin, scores en direct).
  // Laisse "" pour utiliser seulement les scores écrits dans ce fichier.
  api: "https://tournoi-brebeuf-api.jmdashboard.workers.dev",

  // ---------------------------------------------------------------
  // CALENDRIER — un bloc par semaine.
  // Score : mets des nombres dans scoreA / scoreB une fois le match joué.
  //         Laisse null tant que le match n'est pas joué (« à venir »).
  // ---------------------------------------------------------------
  calendrier: [
    {
      semaine: "Semaine 1 — 16 au 23 septembre",
      matchs: [
        { date: "Mercredi 16 septembre", heure: "12h45", equipeA: "FC Sans Mounes", equipeB: "SLA FC",       scoreA: null, scoreB: null },
        { date: "Mercredi 16 septembre", heure: "13h25", equipeA: "Les Penguez",    equipeB: "BI Élite",     scoreA: null, scoreB: null },
        { date: "Jeudi 17 septembre",    heure: "12h45", equipeA: "FC Haramball",   equipeB: "La Famé FC",   scoreA: null, scoreB: null },
        { date: "Jeudi 24 septembre",    heure: "12h45", equipeA: "La Famé FC",     equipeB: "Maisonnée FC", scoreA: null, scoreB: null },
      ],
    },
    // Exemple pour ajouter une semaine :
    // {
    //   semaine: "Semaine 2 — 28 septembre au 2 octobre",
    //   matchs: [
    //     { date: "Mercredi 30 septembre", heure: "12h45", equipeA: "SLA FC", equipeB: "BI Élite", scoreA: null, scoreB: null },
    //   ],
    // },
  ],

  // ---------------------------------------------------------------
  // CLASSEMENTS — la liste des équipes de chaque groupe.
  // Tout (MJ, V, N, D, BP, BC, DB, PTS) est calculé à partir des matchs
  // « Terminé » du calendrier. Le tri se fait par PTS, puis DB, puis BP.
  // ---------------------------------------------------------------
  classements: {
    A: [
      { equipe: "BI Élite" },
      { equipe: "FC Sans Mounes" },
      { equipe: "SLA FC" },
      { equipe: "Les Penguez" },
    ],
    B: [
      { equipe: "FC Babakar" },
      { equipe: "Maisonnée FC" },
      { equipe: "FC Haramball" },
      { equipe: "La Famé FC" },
    ],
  },

  // ---------------------------------------------------------------
  // ÉQUIPES — joueurs : { nom, capitaine: true } / { nom, gardien: true }
  // Tableau vide = la carte affiche « Liste à venir ».
  // coach / assistant : laisse "" s'il n'y en a pas (la ligne est masquée).
  // ---------------------------------------------------------------
  equipes: [
    {
      nom: "BI Élite", groupe: "A",
      joueurs: [
        { nom: "Lucas Lai", capitaine: true },
        { nom: "Dario Afshin" },
        { nom: "Aghiles Assous" },
        { nom: "Alexandre Bitzikadis" },
        { nom: "Nicolas Forero" },
        { nom: "Nassim Hamzaoui" },
        { nom: "Aylimas Ouali", gardien: true },
        { nom: "Ahmad Sarakbi" },
        { nom: "Johann Tchinda" },
        { nom: "Charles Thibault" },
      ],
      coach: "", assistant: "",
    },
    {
      nom: "FC Sans Mounes", groupe: "A",
      joueurs: [
        { nom: "Élliot Bourgeois", capitaine: true },
        { nom: "Théo Gariepy" },
        { nom: "Maxim Vu" },
        { nom: "Kevin Tutu" },
        { nom: "Mason On" },
        { nom: "Kaede Magnin", gardien: true },
        { nom: "Santiago Bérubé" },
        { nom: "Shervine Khalifi" },
        { nom: "Amine Hassan" },
        { nom: "Charlie Liu" },
        { nom: "Ryan Nikirad" },
      ],
      coach: "Rémi Lize", assistant: "Esaïe Chery",
    },
    {
      nom: "SLA FC", groupe: "A",
      joueurs: [
        { nom: "Elliot Delourme", capitaine: true },
        { nom: "Étienne Trudeau", gardien: true },
        { nom: "Ilie Vastua" },
        { nom: "Lili Brochu" },
        { nom: "Santiago Miro-Lucas" },
        { nom: "Julien Mann" },
        { nom: "Cris Popovici" },
        { nom: "Lucas-Marius Civil" },
        { nom: "Daniel Quevedo" },
        { nom: "Eli Severino" },
      ],
      coach: "Luka Helal", assistant: "",
    },
    {
      nom: "Les Penguez", groupe: "A",
      joueurs: [
        { nom: "Édouard Reeves", capitaine: true },
        { nom: "Alexandre Corriveau" },
        { nom: "Damian Tonea" },
        { nom: "Sami Akhrif" },
        { nom: "Nikolas Sajous" },
        { nom: "Mikael Mansour" },
        { nom: "Francois Proulx", gardien: true },
        { nom: "Ilyes Tachefine" },
      ],
      coach: "", assistant: "",
    },
    {
      nom: "FC Babakar", groupe: "B",
      joueurs: [
        { nom: "Arpad Fraiberger", gardien: true, capitaine: true },
        { nom: "Philippe Sugleris" },
        { nom: "Mattias Chahwan" },
        { nom: "Julien Hardoon" },
        { nom: "Kylian Moutanabir" },
        { nom: "Xavier Turner" },
        { nom: "Sacha Buswell" },
        { nom: "Luka Boucher" },
        { nom: "Maxime Toulouse" },
        { nom: "Marc Bechlian" },
        { nom: "Sofiane Keddache" },
      ],
      coach: "", assistant: "",
    },
    {
      nom: "Maisonnée FC", groupe: "B",
      joueurs: [
        { nom: "Florent Bessette", capitaine: true },
        { nom: "Benjamin Leclerc" },
        { nom: "Simon Racine" },
        { nom: "David Zakrzewski" },
        { nom: "Noah Howard" },
        { nom: "Elliott Jenny" },
        { nom: "Jason Elgemayel" },
        { nom: "Vincent Viau" },
        { nom: "Félix Nachou" },
        { nom: "Mali Villedieu" },
        { nom: "Rocco Castiglio" },
        { nom: "Alistair Howard", gardien: true },
      ],
      coach: "Émile Nohra", assistant: "",
    },
    {
      nom: "FC Haramball", groupe: "B",
      joueurs: [
        { nom: "Adam Krifa", capitaine: true },
        { nom: "Sem Elghazi" },
        { nom: "Imrane Sellam" },
        { nom: "Sharthak Banik" },
        { nom: "Nathan Jeshurun Anton" },
        { nom: "Kai Chen Guo" },
        { nom: "Braulio Manuel Churampi Aguirre" },
        { nom: "Mohamed Acheraf Ez-Zirani" },
        { nom: "Jordy-Spencer Dombeu" },
        { nom: "Mehdi El Jafri", gardien: true },
        { nom: "Mohamed Amin Khouzai" },
      ],
      coach: "", assistant: "",
    },
    {
      nom: "La Famé FC", groupe: "B",
      joueurs: [
        { nom: "Mohamed Reda Alouani", capitaine: true },
        { nom: "Ezekiel Duncan" },
        { nom: "Brian Guerrero" },
        { nom: "Olivier Zaurrini" },
        { nom: "Zakaria Khadir" },
        { nom: "Nassim Khalid" },
        { nom: "Mohamed Aatil" },
        { nom: "Alexandre Ghislain-Fernandez", gardien: true },
        { nom: "Gabriel Coblentz" },
      ],
      coach: "Moukakhel", assistant: "",
    },
  ],
};
