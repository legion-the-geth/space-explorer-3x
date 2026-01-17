# 🛠️ Dette Technique & Refactoring

Ce fichier recense les tâches d'amélioration du code, d'optimisation et de maintenance identifiées lors des revues de code.

## 🚨 Priorité Haute

- [x] **[UI] Créer un système de composants UI réutilisables** (`src/ui/components/`)
  - *Problème* : Duplication de code pour la création de boutons et panels.
  - *Solution* : Création de `Button.ts` et `Panel.ts`.
  - *Cible* : `SystemDetailView.ts`, `HUD.ts`.

- [x] **[UI] Centraliser le Thème** (`src/ui/theme.ts`)
  - *Problème* : Couleurs, polices et tailles hardcodées partout.
  - *Solution* : Création de l'objet `THEME` centralisé.

- [x] **[REFACTO] Découper `SystemDetailView.ts`**
  - *Problème* : Fichier trop volumineux avec multiples responsabilités.
  - *Actions* : Extraire `SystemInfoPanel` et `SystemVisualizer`.

## ⚠️ Priorité Moyenne

- [ ] **[STORE] Extraire la logique métier de `useDiscoveryStore`** (`src/stores/useDiscoveryStore.ts`)
  - *Problème* : Le store contient la logique de génération procédurale des sauts, les probabilités et la géométrie.
  - *Solution* : Créer un `DiscoveryService` pour isoler cette logique métier du state management.
  - *Risque* : Moyen.

- [ ] **[CONST] Centraliser les constantes de gameplay**
  - *Problème* : "Magic numbers" dans `useDiscoveryStore` (Distance max 200, 4 connexions max, probas).
  - *Solution* : Déplacer dans un fichier de configuration `src/game/constants.ts`.
  - *Risque* : Faible.

- [ ] **[PERF] Optimisation du rendu `SystemDetailView`**
  - *Observation* : `clear()` + reconstruction totale à chaque `showSystem`.
  - *Amélioration* : Pool d'objets ou mise à jour des textes existants plutôt que destruction/recreation si la fréquence augmente.

- [x] **[ARCHI] Standardiser les Imports**
  - *Observation* : Mélange d'alias (`@game/...`) et relatifs.
  - *Action* : Utilisation des alias partout (`@core`, `@game`, `@ui`).

## ℹ️ Priorité Basse

- [ ] **[CODE] Fixer l'indentation de `SystemDetailView.ts`**
  - *Observation* : L'indentation est incohérente sur les blocs conditionnels des boutons (lignes ~80-130).
  - *Action* : Formatter le fichier (Prettier).

- [ ] **[DOC] JSDoc manquante sur les interfaces complexes**
  - Ajouter de la documentation sur les props des composants UI extraits.

## 📝 Journal des refactorings réalisés

- **2026-01-16** : Refonte de l'UI.
  - Création de `src/ui/theme.ts` pour centraliser les constantes visuelles.
  - Implémentation des composants `Button` et `Panel` dans `src/ui/components/`.
  - Refactorisation complète de `SystemDetailView.ts` par extraction de `SystemInfoPanel` et `SystemVisualizer`.
  - Mise à jour de `HUD.ts` et `Grid.ts` pour utiliser le thème.
  - Standardisation de tous les imports (remplacement des `../` par des alias `@...`).
