# TODO - Space Explorer 3X

> **Dernière mise à jour** : 2026-01-14
> **Méthodologie** : Feature-Driven Development (FDD)

---

## 🔥 Prioritaire (En cours)

> **Voir détails complets dans** : [FEAT_001.md](./SPECS/FEAT_001.md)

- [ ] **[FEAT]** Génération de planètes dans les systèmes ~1d #procgen @game
  Ajouter des planètes aux systèmes stellaires existants.
  - [ ] Générateur de planètes (types, tailles, orbites)
  - [ ] Affichage des orbites dans la vue système
  - [ ] Propriétés planétaires (composition, atmosphère, température)
  - [ ] Zone habitable calculée selon l'étoile

### Phase 2 : Interface de Navigation 2D

- [+] **[FEAT]** Affichage de la carte galactique ~4h #ui @frontend
  Rendu visuel des systèmes stellaires sur la carte 2D.
  - [x] Sprites/shapes pour les systèmes
  - [ ] Affichage des connexions (lignes de saut)
  - [+] Indication visuelle (découvert/non découvert)
  - [+] Labels et infos au survol

### Phase 3 : Système de Scan
- [ ] **[FEAT]** Scan de système stellaire ~4h #gameplay @game
  Mécanique pour scanner un système et révéler ses planètes.
  - [ ] UI de scan (bouton/interaction)
  - [ ] Révélation progressive des informations
  - [ ] Animation de scan
  - [ ] Stockage des données scannées

- [ ] **[FEAT]** Scan planétaire détaillé ~4h #gameplay @game
  Analyse détaillée d'une planète (composition, atmosphère, ressources).
  - [ ] UI de détails planétaires
  - [ ] Données procédurales (composition, atmosphère, ressources)
  - [ ] Catalogage des découvertes

### Phase 4 : Ressources et Lignes de Saut
- [ ] **[FEAT]** Système de collecte de ressources ~4h #gameplay @game
  Extraction de ressources depuis les planètes.
  - [ ] Types de ressources
  - [ ] Mécanique de collecte
  - [ ] UI d'inventaire
  - [ ] Stockage dans le state

- [ ] **[FEAT]** Mécanique de lignes de saut ~4h #gameplay @game
  Activation de connexions entre systèmes avec prérequis de ressources.
  - [ ] Coût en ressources par ligne de saut
  - [ ] UI d'activation
  - [ ] Déplacement entre systèmes
  - [ ] Déblocage progressif de nouvelles zones

### Phase 5 : Sauvegarde
- [ ] **[FEAT]** Système de sauvegarde IndexedDB ~4h #storage @fullstack [DEC-004]
  Sauvegarde de l'état du jeu dans IndexedDB avec stratégie "seed + delta".
  - [ ] Installation lib `idb`
  - [ ] Sérialisation de l'état du jeu
  - [ ] Auto-save (30s + actions importantes)
  - [ ] Chargement au démarrage

- [ ] **[FEAT]** Export/Import JSON ~2h #storage @frontend
  Fonctionnalité de backup manuel des sauvegardes.
  - [ ] Bouton "Export Save"
  - [ ] Bouton "Import Save"
  - [ ] Validation du format importé

### Phase 6 : Polish MVP
- [ ] **[UI]** Interface d'information sur les planètes ~4h #ui @frontend
  Panel latéral ou overlay avec détails des planètes découvertes.

- [ ] **[UI]** HUD basique (ressources, position) ~2h #ui @frontend
  Affichage permanent des infos importantes (ressources, système actuel).

- [ ] **[UI]** Ajouter une graduation sur la grille 
  Sur les cases autour de la position du jouer, afficher une règle graduée jusqu'à 10 AL.

- [ ] **[DOCS]** Documentation utilisateur basique ~2h #docs
  Guide de prise en main et explication des mécaniques.

## 🔮 Évolutions Futures (Post-MVP)

### Génération Procédurale Avancée
- [ ] **[FEAT]** Systèmes binaires et multiples ~2d #procgen @game
  10-20% des systèmes avec plusieurs étoiles en orbite mutuelle.

- [ ] **[FEAT]** Types d'étoiles exotiques ~1d #procgen @game
  White Dwarfs, Red Giants, Neutron Stars, Black Holes, types aliens.

- [ ] **[FEAT]** Modificateurs par secteur ~1d #procgen @game
  Jeunes secteurs = plus O/B, vieux secteurs = plus M/K, secteurs denses/vides.

- [ ] **[FEAT]** Amas stellaires ~2d #procgen @game
  Amas ouverts et globulaires avec densité élevée.

- [ ] **[FEAT]** Structure galactique ~3d #procgen @game
  Bras spiraux, halo, centre galactique, zones de transition.

- [ ] **[FEAT]** Anomalies spatiales ~2d #procgen @game
  Nébuleuses, trous de ver, artefacts aliens, zones exotiques.

- [ ] **[FEAT]** Métallicité des étoiles ~1d #procgen @game
  Affecte la probabilité de formation planétaire.

- [ ] **[FEAT]** Âge des étoiles ~1d #procgen @game
  Influence les propriétés et le type d'étoile (évolution stellaire).

### Génération de Positions
- [ ] **[TECH]** Poisson disc sampling ~1d #procgen @game
  Distribution spatiale plus naturelle que la grille+jitter.

- [ ] **[TECH]** Génération à la demande ~2d #procgen @game
  Charger/décharger les systèmes selon la région visible (streaming).

- [ ] **[TECH]** Optimisation spatiale ~1d #procgen @game
  QuadTree ou structure spatiale pour accélérer les requêtes.

### Interface & UX
- [ ] **[UI]** Input de seed personnalisée ~2h #ui @frontend
  Permettre au joueur de choisir sa seed d'univers.

- [ ] **[UI]** Galerie de découvertes ~1d #ui @frontend
  Collection visuelle des types d'étoiles trouvés.

- [ ] **[UI]** Statistiques de génération ~4h #ui @frontend
  Afficher les stats de l'univers généré (nombre d'étoiles par type, etc.).

- [ ] **[UI]** Tooltips sur étoiles ~4h #ui @frontend
  Afficher le nom du système au survol sans cliquer.

## ✅ Terminé

- [x] **[FEAT]** Action "Jump to System" ~2h #gameplay @fullstack [FEAT-001-5]
  **Terminé le** : 2026-01-16
  Implémentation de la mécanique de saut. Bouton contextuel dans la vue système, mise à jour de la position du joueur, gestion des états (REACHABLE/VISITED), génération dynamique de nouveaux systèmes lors du saut pour une exploration infinie. Refonte du rendu galaxie avec starsContainer pour gestion z-index.

- [x] **[FEAT]** Système de découverte et fog of war (steps 1-4) ~1d #gameplay @fullstack [FEAT-001]
  **Terminé le** : 2026-01-15
  Implémentation du système d'états (UNKNOWN/VISIBLE/REACHABLE/VISITED/SCANNED) et génération dynamique. Scan system révèle planètes + jump lines avec distribution pondérée (0-4) et protection anti-softlock. UI avec status badge, bouton scan conditionnel, affichage jump lines dans panel.

- [x] **[FEAT]** Système de génération procédurale avec seed ~4h #procgen @game [DEC-002]
  **Terminé le** : 2026-01-14
  Génération déterministe d'étoiles avec propriétés réalistes (classes spectrales O-M, températures, masses, couleurs). Système de nommage SEC-A7-M142. Distribution spatiale grille+jitter. Échelle 1 unité = 0.1 AL.

- [x] **[FEAT]** Système de caméra pan/zoom avec grille ~4h #ui @frontend
  **Terminé le** : 2026-01-14
  Navigation fluide avec zoom (molette), pan (bouton milieu/espace+clic), grille infinie adaptative, smooth lerp, HUD coordonnées/zoom.

- [x] **[FEAT]** Système de double vue (Galaxy/System) ~2h #ui @frontend [DEC-005]
  **Terminé le** : 2026-01-14
  ViewManager pour switcher entre vue galaxie et vue détail système. Clic gauche sur étoile = détails, ESC/bouton retour = galaxie.

- [x] **[UI]** Panel d'informations système ~1h #ui @frontend
  **Terminé le** : 2026-01-14
  Affichage des propriétés de l'étoile (type, température, masse, rayon, position) dans la vue détail.

- [x] **[SETUP]** Initialisation du projet Vite + TypeScript ~30min #setup @fullstack [DEC-001]
  **Terminé le** : 2026-01-14
  Création de la structure de base avec Vite, TypeScript strict mode, ESLint, Prettier, structure de dossiers.

- [x] **[SETUP]** Installation et configuration PixiJS ~30min #setup @frontend
  **Terminé le** : 2026-01-14
  Installation PixiJS 8.6.8, setup canvas, renderer, test d'affichage avec étoile animée.

- [x] **[SETUP]** Installation Zustand + idb ~10min #setup @frontend [DEC-003, DEC-004]
  **Terminé le** : 2026-01-14
  Installation des dépendances Zustand (state management) et idb (storage).

- [x] **[DOCS]** Création de la documentation projet (README, SPEC, CLAUDE, TODO, CHANGELOG) ~1h #docs
  **Terminé le** : 2026-01-14

---

## 📝 Légende

### Types de tâches
- **[SETUP]** : Configuration initiale du projet
- **[FEAT]** : Nouvelle fonctionnalité
- **[UI]** : Interface utilisateur
- **[DOCS]** : Documentation
- **[TECH]** : Dette technique, refactoring, optimisation

### Tags
- `~Xd/Xh` : Estimation de durée (ex: ~3d, ~4h)
- `#categorie` : Catégorie (setup, procgen, ui, gameplay, storage, docs)
- `@scope` : Scope (frontend, game, fullstack)
- `[DEC-XXX]` : Référence à une décision dans CLAUDE.md

### Statuts
- `- [ ]` : À faire
- `- [+]` : En cours
- `- [x]` : Terminé
- **Gras** : Haute priorité ou bloquant

---

## 💡 Notes

- **Objectif MVP** : Boucle de gameplay complète (explorer → scanner → collecter → débloquer)
- **Priorité** : Fonctionnalités de base avant le polish visuel
- **Itérations** : Tester fréquemment, ajuster selon le ressenti
- Déplacer les tâches terminées vers "✅ Terminé" lors des fins de session
