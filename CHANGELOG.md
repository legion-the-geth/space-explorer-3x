# Changelog

Tous les changements notables de ce projet sont documentés dans ce fichier.

---

## [2026-01-16] - Refonte de l'Interface et Nettoyage Technique

### Added
- **Système de Thème centralisé** (`src/ui/theme.ts`) : Unification des couleurs, polices et espacements.
- **Composants UI réutilisables** (`src/ui/components/`) :
  - `Button.ts` : Gestion autonome des états (repos, survol) et du style.
  - `Panel.ts` : Conteneur standardisé avec fond et bordures thématiques.
- **Nouveaux sous-composants pour la vue détail** :
  - `SystemInfoPanel.ts` : Extraction du panneau de données stellaires.
  - `SystemVisualizer.ts` : Extraction de la logique de rendu visuel de l'étoile.

### Changed
- **Refactorisation majeure de `SystemDetailView.ts`** : Code réduit et clarifié grâce à l'utilisation des nouveaux composants.
- **Standardisation des imports** : Passage systématique aux alias (`@core`, `@game`, `@ui`, etc.) pour une meilleure maintenabilité.
- Mise à jour de `HUD.ts` et `Grid.ts` pour consommer le `THEME` global.

### Fixed
- Corrections de types TypeScript dans les générateurs et le système stellaire.
- Nettoyage des variables inutilisées et des imports fantômes pour un build 100% propre.

---

## [2026-01-15] - Initialisation et fonctionnalités de base

### Added
- Documentation initiale du projet (SPEC.md, README.md, CLAUDE.md, TODO.md, CHANGELOG.md)
- **FEAT_001.md** : Spécification complète du système de découverte et d'exploration
- Définition de la stack technique (Vite + TypeScript + PixiJS v8 + Zustand + seedrandom)
- Architecture de sauvegarde "Seed + Delta"
- Système de caméra avec pan/zoom fluide (smooth lerp)
- Grille infinie adaptative avec 4 niveaux de zoom
- HUD affichant coordonnées et niveau de zoom
- Système de double vue (Galaxy/System) avec ViewManager
- Vue détail système avec panel d'informations sur l'étoile
- Navigation : molette (zoom), bouton milieu/espace+drag (pan), clic gauche (détails)
- Raccourci ESC pour retour à la vue galaxie
- Effets visuels : hover sur étoiles (scale x1.5), glow autour des étoiles
- **Génération procédurale déterministe** :
  - UniverseGenerator avec seed globale ("space-explorer-3x-default-seed")
  - StarGenerator avec 7 classes spectrales (O, B, A, F, G, K, M)
  - Distribution réaliste lissée pour gameplay (M:45%, K:25%, G:15%, F:8%, A:4%, B:2%, O:1%)
  - Propriétés stellaires réalistes (température, masse, rayon, couleur)
  - Système de nommage : SEC-[Secteur]-[Type][Numéro] (ex: SEC-A7-M142)
  - Secteurs de 3000 unités (300 AL)
  - Échelle spatiale : 1 unité = 0.1 année-lumière
  - Placement sur grille avec jitter (espacement moyen 10 AL, probabilité spawn 80%)
  - SeededRandom utility avec gaussian, weightedChoice, etc.
  - Génération initiale dans région -1000 à 1000 (~348 systèmes)
  - Couleurs réalistes par température (bleu → blanc → jaune → orange → rouge)
  - Tailles variables selon type (O/B légèrement plus grosses)

### Changed
- Migration vers API PixiJS v8 (`.stroke()` au lieu de `.lineStyle()`)
- Fond d'écran : #0d0d0d (noir profond)
- Grille : #ededed (blanc cassé) pour meilleure visibilité

---

## 📝 Types de changements

- **Added** : Nouvelles fonctionnalités
- **Changed** : Modifications de fonctionnalités existantes
- **Deprecated** : Fonctionnalités obsolètes, à supprimer prochainement
- **Removed** : Fonctionnalités supprimées
- **Fixed** : Corrections de bugs
- **Security** : Corrections de vulnérabilités de sécurité

## 🔢 Versioning

Ce projet suit le Semantic Versioning (MAJOR.MINOR.PATCH) :

- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

---

**Note** : Le projet est actuellement en phase de setup initial (version 0.0.0).
