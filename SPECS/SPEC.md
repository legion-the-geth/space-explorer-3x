# Space Explorer 3X

## 🌌 Vision du Projet

Un jeu d'exploration et d'exploitation spatiale contemplative et sans combat. L'objectif est de découvrir l'univers, cataloguer ses merveilles, et construire un réseau de connexions entre les systèmes stellaires.

Inspiré par l'exploration de **No Man's Sky** et la gestion de **Stellaris**, mais axé sur la découverte scientifique plutôt que la conquête militaire.

## 🎮 Mécaniques de Gameplay Principales

### Exploration
- **Scan de systèmes** : En arrivant dans un nouveau système, obtention de données basiques (nombre de planètes, étoile, lignes de saut potentielles)
- **Scan planétaire** : Analyse détaillée de chaque corps céleste pour révéler sa composition, atmosphère, et ressources
- **Catalogage** : Documentation de la faune, flore et minéraux découverts

### Progression
- **Lignes de saut** : Système de connexion entre systèmes stellaires
  - Nécessite des ressources spécifiques pour activer
  - Déblocage progressif de nouvelles zones d'exploration
  - Crée un réseau spatial qui s'étend au fil du jeu
- **Collecte de ressources** : Exploitation de ressources planétaires pour alimenter l'expansion

### Génération Procédurale
- Systèmes générés algorithmiquement avec une logique astronomique réaliste
- Planètes type-Terre ultra-rares
- Diversité de corps célestes : planètes volcaniques, lunes glacées, géantes gazeuses, astéroïdes riches en minéraux
- Chaque système offre des découvertes uniques même sans vie développée

## 🎨 Direction Artistique

**Style visuel** : 2D avec interface de type "plan infini"
- Navigation façon Figma : zoom/pan fluide
- Systèmes découverts affichés sur une carte 2D
- Zoom sur les systèmes pour accéder aux détails planétaires
- Esthétique minimaliste et lisible

## 🛠️ Stack Technique

### Stack Retenue : Web (PixiJS + TypeScript)

**Décision** : Option 2 - Stack Web
**Date** : 2026-01-14

#### Core
- **Runtime** : Web (navigateur)
- **Langage** : TypeScript (strict mode)
- **Bundler** : Vite (HMR rapide, build optimisé)
- **Rendering** : PixiJS (moteur 2D WebGL/Canvas)

#### State & Data
- **State Management** : Zustand (store global léger et réactif)
- **Storage** : IndexedDB via `idb` (sauvegarde principale) + Export/Import JSON (backup)
- **Génération Procédurale** : Seed-based avec lib de noise (seedrandom, simplex-noise)

#### Dev Tools
- **Tests** : Vitest
- **Linting** : ESLint + Prettier
- **Type Checking** : TypeScript strict

### Justification du Choix

**Pourquoi PixiJS + TypeScript ?**
1. **Interface "plan infini"** : PixiJS excelle dans le rendu 2D avec pan/zoom (exactement ce qu'on veut)
2. **Prototypage rapide** : TypeScript maîtrisé = focus sur le gameplay
3. **Déploiement web** : Accessible instantanément, facile à partager pour tester
4. **Écosystème riche** : NPM regorge de libs pour la génération procédurale
5. **Performances suffisantes** : Largement assez pour un jeu 2D non-combat

### Architecture de Sauvegarde

**Stratégie "Seed + Delta"** :
- **Seed de l'univers** : Génère l'ensemble de la galaxie de manière déterministe
- **Deltas uniquement** : Sauvegarde seulement les changements (systèmes découverts, ressources collectées, etc.)
- **Taille** : ~100 KB pour 1000+ systèmes découverts

**Storage multi-couches** :
1. **IndexedDB** (principal) : Auto-save toutes les 30s + sur actions importantes
2. **Export JSON** (backup) : Bouton manuel pour sauvegarder/restaurer localement
3. **LocalStorage** (fallback) : Seed + position minimale en cas de problème IndexedDB

## ✨ Features Prévues

### Version MVP
- [ ] Génération procédurale de systèmes stellaires basiques
- [ ] Interface de navigation 2D (pan/zoom)
- [ ] Système de scan (systèmes + planètes)
- [ ] Mécanique de lignes de saut avec prérequis de ressources
- [ ] Collecte de ressources de base
- [ ] UI d'information sur les planètes découvertes

### Features Avancées
- [ ] Catalogage détaillé (faune/flore/minéraux)
- [ ] Génération procédurale avancée avec diversité biologique
- [ ] Système de progression/achievements scientifiques
- [ ] Multiple save slots (3-5 parties différentes)
- [ ] Optimisation graphique et performances
- [ ] Son ambiant et effets audio

### Long Terme (Maybe)
- [ ] Mode multijoueur coopératif
- [ ] Partage de découvertes entre joueurs
- [ ] Mod support
- [ ] Génération de galaxies multiples

## 🎯 Principes de Design

1. **Chill & Contemplatif** : Pas de pression temporelle, pas de combat
2. **Découverte Récompensante** : Chaque système doit offrir quelque chose d'intéressant
3. **Progression Naturelle** : Le gameplay émergent guide le joueur sans tutoriel lourd
4. **Réalisme Scientifique** : Respecter les bases de l'astronomie tout en restant fun
5. **Accessibilité** : Interface claire, apprentissage progressif

## 📝 Notes de Développement

- Développement solo (pour l'instant)
- Approche pair programming avec IA (Claude, Gemini)
- Priorité à la jouabilité avant le polish graphique
- Itérations rapides et tests fréquents

## 🚀 Prochaines Étapes

1. ✅ ~~Choisir la stack technique définitive~~ → **Done** : Web (PixiJS + TypeScript)
2. Setup initial du projet (Vite + PixiJS + Zustand)
3. Prototyper la génération procédurale de base
4. Implémenter l'interface de navigation 2D
5. Développer le système de scan
6. Créer la boucle de gameplay MVP (explorer → scanner → collecter → débloquer)

---

**Status** : 🟢 Phase de setup
**Dernière mise à jour** : 2026-01-14
