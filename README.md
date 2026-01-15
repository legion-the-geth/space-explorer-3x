# 🌌 Space Explorer 3X

Un jeu d'exploration spatiale contemplative et sans combat, axé sur la découverte scientifique et la construction d'un réseau de connexions interstellaires.

> **Inspiré par** : No Man's Sky (exploration) + Stellaris (gestion) - Combat = Space Explorer 3X

## ✨ Concept

Explorez l'univers, cataloguez ses merveilles, et construisez un réseau de lignes de saut entre les systèmes stellaires. Pas de combat, pas de stress, juste la contemplation et la découverte.

## 🛠️ Stack Technique

### Core
- **Runtime** : Web (navigateur)
- **Langage** : TypeScript
- **Bundler** : Vite
- **Rendering** : PixiJS (2D)

### State & Data
- **State Management** : Zustand
- **Storage** : IndexedDB (via `idb`) + Export/Import JSON
- **Génération Procédurale** : Seed-based avec lib de noise

### Dev Tools
- **Tests** : Vitest
- **Linting** : ESLint + Prettier
- **Type Checking** : TypeScript strict mode

## 🎮 Mécaniques Principales

### Exploration
- **Scan de systèmes** : Découverte des corps célestes et lignes de saut
- **Scan planétaire** : Analyse détaillée (composition, atmosphère, ressources)
- **Catalogage** : Documentation de la faune, flore et minéraux

### Progression
- **Lignes de saut** : Activation avec ressources pour débloquer nouveaux systèmes
- **Collecte de ressources** : Exploitation planétaire pour alimenter l'expansion
- **Réseau spatial** : Construction progressive d'un réseau de connexions

### Interface
- **Navigation 2D** : Plan infini avec pan/zoom fluide (façon Figma)
- **Carte galactique** : Vue d'ensemble des systèmes découverts
- **Zoom contextuel** : Détails planétaires par zoom sur un système

## 🚀 Installation et Setup

### Prérequis
- Node.js 18+
- npm ou pnpm

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

### Build
```bash
npm run build
```

### Tests
```bash
npm test
```

### Lint
```bash
npm run lint
```

## 📁 Structure du Projet

```
space_explorer_3x/
├── src/
│   ├── core/           # Systèmes de base (rendering, input, storage)
│   ├── game/           # Logique métier (génération, gameplay)
│   ├── ui/             # Interface utilisateur
│   ├── utils/          # Utilitaires génériques
│   └── main.ts         # Point d'entrée
├── public/             # Assets statiques
├── doc_templates/      # Templates de documentation
├── SPECS/
│   ├── SPEC.md         # Spécifications du jeu
│   └── FEAT_001.md     # Spécifications détaillées d'une feature
├── CLAUDE.md           # Instructions pour Claude Code
├── TODO.md             # Backlog de tâches
├── CHANGELOG.md        # Historique des versions
└── README.md           # Ce fichier
```

## 🎨 Direction Artistique

- **Style** : 2D minimaliste et lisible
- **Palette** : Tons sombres (espace) avec accents colorés (planètes, UI)
- **Typographie** : Monospace pour l'aspect "computer terminal"
- **Animations** : Fluides et contemplatives, pas de rush

## 🧩 Architecture Technique

### Génération Procédurale
- **Seed-based** : Tout l'univers généré à partir d'une seed
- **Déterministe** : Même seed = même univers
- **Lazy generation** : Systèmes générés uniquement à la visite

### Sauvegarde
- **Stratégie "Seed + Delta"** :
  - Seed de l'univers
  - Deltas uniquement (systèmes découverts, ressources collectées, etc.)
  - Sauvegarde légère (<100 KB pour 1000+ systèmes)
- **Storage** :
  - Principal : IndexedDB (plusieurs MB disponibles)
  - Backup : Export/Import JSON manuel
  - Auto-save toutes les 30s + sur actions importantes

### State Management
- **Zustand** pour l'état global du jeu
- Stores par domaine : player, universe, ui, catalog

## 🎯 Principes de Design

1. **Chill & Contemplatif** : Pas de pression temporelle, pas de combat
2. **Découverte Récompensante** : Chaque système doit offrir quelque chose d'intéressant
3. **Progression Naturelle** : Gameplay émergent, pas de tutoriel lourd
4. **Réalisme Scientifique** : Bases astronomiques respectées tout en restant fun
5. **Accessibilité** : Interface claire, apprentissage progressif

## 📚 Documentation

- **SPEC.md** : Vision complète du projet, mécaniques, features
- **CLAUDE.md** : Méthodologie de développement, décisions d'architecture
- **TODO.md** : Backlog priorisé et suivi des tâches
- **CHANGELOG.md** : Historique des versions et changements

## 🤝 Contribution

Projet solo développé en pair programming avec IA (Claude).

## 📝 License

TBD

---

**Status** : 🟢 MVP en développement (FEAT-001 ~90% complété)
**Version** : 0.1.0 (alpha)
**Dernière mise à jour** : 2026-01-15
