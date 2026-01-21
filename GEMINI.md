# GEMINI.md - Instructions pour Gemini (Théo)

## 📖 Référence projet

> **Informations générales** (objectifs, stack, commandes, architecture) :
> Voir [README.md](./README.md)

> **Spécifications du jeu** :
> Voir [SPEC.md](./SPECS/SPEC.md)

> **Tâches et backlog** :
> Voir [TODO.md](./TODO.md)
> Voir [SPECS/READY](./SPECS/READY)

> **Historique des versions** :
> Voir [CHANGELOG.md](./CHANGELOG.md)

## 🎯 Méthodologie de développement

**Approche** : Feature-Driven Development (FDD)

### Workflow par feature
1. **Expression du besoin** : Tu décris la feature souhaitée.
2. **Analyse & Conception** : Je propose l'architecture/design, on valide ensemble.
3. **Implémentation** : Développement incrémental avec validation continue.
4. **Tests** : Tests unitaires + intégration après implémentation.
5. **Review** : Code review + ajustements si nécessaire.

### Principes de travail
- **Itérations courtes** : features découpées en petits blocs (<1h de dev).
- **Validation continue** : te montrer/expliquer avant de coder des trucs complexes.
- **Contexte explicite** : utiliser les outils de lecture de fichier plutôt que de demander des copier-coller.
- **Commits atomiques** : une feature logique = un commit.

## 🔄 ROUTINE DE FIN DE TÂCHE

**À CHAQUE FIN DE TÂCHE**, je dois systématiquement te proposer les options suivantes :

### Options disponibles

1. **🎯 Continuer avec la tâche suivante**
   - Si le TODO.md contient des tâches prioritaires et logiquement liées.
   - Proposer explicitement quelle(s) tâche(s) seraient pertinentes.

2. **🧪 Tests / Debug / Qualité**
   - Lancer les tests unitaires et d'intégration.
   - Vérifier le lint et corriger les warnings.
   - Identifier les edge cases non couverts.
   - Proposer des tests supplémentaires si la couverture est faible.

3. **✨ Évolutions fonctionnelles**
   - Proposer 2-3 améliorations UX/fonctionnelles sur ce qu'on vient de faire.
   - Focus sur la valeur utilisateur ou la robustesse.
   - Rester dans le scope de la feature actuelle.

4. **⚡ Optimisations techniques**
   - Factorisation du code (DRY, extraction de fonctions).
   - Performance (complexité algorithmique, caching).
   - Maintenabilité (types plus stricts, meilleure structure).
   - Dette technique identifiée.

5. **📝 Fin de session**
   - Mise à jour README.md si changements significatifs.
   - Mise à jour GEMINI.md si nouveaux patterns/décisions.
   - Mise à jour TODO.md (cocher fait, ajouter découvertes).
   - Gestion Git :
     * Si feature complète : commit + push.
     * Si en cours : commit + push sur branche feature.
   - Récapitulatif de session (ce qui a été fait, points en suspens).

### Format de proposition

À chaque fin de tâche, présentation d'un menu clair :

```text
✅ Tâche terminée : [description courte]

Que veux-tu faire ensuite ?

1. 🎯 Continuer avec : [suggestion de tâche logique]
2. 🧪 Tests/Qualité : [status actuel + ce qu'on pourrait améliorer]
3. ✨ Évolutions : [2-3 idées concrètes d'amélioration]
4. ⚡ Optimisations : [dette technique ou refactoring identifié]
5. 📝 Fin de session (mise à jour docs + Git)

Dis-moi juste le numéro ou une instruction libre !
```

## 🚀 Commandes rapides

Phrases-clés à reconnaître et exécuter automatiquement :

- **"Fin de session"** → Exécuter automatiquement l'option 5 (mise à jour complète).
- **"Tests"** ou **"Check qualité"** → Exécuter l'option 2.
- **"Suite"** ou **"Tâche suivante"** → Proposer/démarrer tâche logique du TODO.
- **"Refacto"** → Focus sur optimisations techniques (option 4).
- **"Quick commit"** → Commit + push rapide sans fin de session complète.

### 🎭 Switch de Rôle
- **"Passe en dev"** ou **`./dev`** → Active le mode Développement (Feature/TDD) via `.\scripts\switch-dev.ps1`.
- **"Passe en lead"** ou **`./lead`** → Active le mode Tech Lead (Review/Qualité) via `.\scripts\switch-lead.ps1`.

## 📂 Fichiers à maintenir

- **README.md** : Présentation générale, documentation utilisateur, setup, commandes essentielles, conventions.
- **SPEC.md** : Spécifications du jeu (vision, mécaniques, features).
- **TODO.md** : Backlog de tâches, priorisé et daté.
- **GEMINI.md** : Ce fichier, à enrichir avec nouvelles décisions d'archi et patterns pour moi.
- **CHANGELOG.md** : Historique des releases.

## ⚠️ Rappels importants

- Toujours demander confirmation avant actions destructrices (suppression, merge, rebase).
- En cas de conflit Git : alerter immédiatement et attendre instruction.
- Si une tâche nécessite > 30min : décomposer en sous-tâches.
- Si incertitude architecturale : proposer 2-3 approches avec pros/cons.

## 📋 Décisions techniques & Patterns

> **Cette section est un "playbook vivant"** qui s'enrichit au fil du projet.
> Chaque entrée documente une décision ou un pattern spécifique à CE projet.

### [DEC-001] Stack technique
**Date** : 2026-01-14
**Décision** : Stack Web avec PixiJS + TypeScript + Vite
**Options envisagées** :
- Godot Engine (GDScript/C#)
- Web (Phaser.js / PixiJS + TypeScript) ← **Choisi**
- Bevy (Rust)
**Justification** :
- PixiJS parfait pour l'interface "plan infini" avec pan/zoom
- TypeScript déjà maîtrisé = prototypage rapide
- Déploiement web facile pour partager et tester
- Écosystème NPM riche pour génération procédurale
**Feedback** : ✅ Validé

### [DEC-002] Génération procédurale
**Date** : 2026-01-14
**Décision** : Approche seed-based déterministe
**Contexte** : Besoin de générer un univers cohérent et reproductible
**Pattern** :
- Seed globale pour l'univers
- Génération lazy (à la demande lors de la visite)
- Déterminisme : même seed + même systemId = même résultat
- Libs : `seedrandom` + `simplex-noise` ou similaires
**Feedback** : ✅ Validé

### [DEC-003] State Management
**Date** : 2026-01-14
**Décision** : Zustand pour le state global
**Contexte** : Besoin de partager l'état du jeu entre composants
**Pattern** : Un store par domaine métier (player, universe, ui, catalog)
**Justification** : Plus simple que Redux, parfait pour un store centralisé de jeu
**Feedback** : ✅ Validé

### [DEC-004] Sauvegarde
**Date** : 2026-01-14
**Décision** : Stratégie "Seed + Delta" avec IndexedDB
**Contexte** : Sauvegarde légère d'un univers procédural potentiellement immense
**Pattern** :
- Sauvegarde : seed + deltas uniquement (découvertes, ressources, etc.)
- Storage principal : IndexedDB (via lib `idb`)
- Backup : Export/Import JSON manuel
- Auto-save : toutes les 30s + sur actions importantes (scan, collecte, saut)
**Avantages** :
- Taille minime (~100 KB pour 1000+ systèmes)
- Reproductibilité garantie
- Backup facile en JSON
**Feedback** : ✅ Validé

### [DEC-005] Système de double vue (Galaxy/System)
**Date** : 2026-01-14
**Décision** : Deux modes de rendu distincts au lieu d'un seul plan seamless
**Contexte** : Besoin d'afficher à la fois la carte galactique et les détails d'un système
**Pattern** :
- ViewManager avec deux containers séparés (galaxy, system)
- Mode Galaxy : grille infinie, pan/zoom, systèmes cliquables
- Mode System : vue détaillée centrée sur l'étoile, panel d'infos
- Transition : clic gauche sur étoile = détails, ESC/bouton = retour
**Justification** :
- Séparation claire des contextes
- Plus simple à maintenir qu'un plan seamless
- Meilleure performance (render uniquement le mode actif)
- Facilite l'ajout de features spécifiques par mode
**Feedback** : ✅ Validé, fonctionne très bien

### [DEC-006] API PixiJS v8
**Date** : 2026-01-14
**Décision** : Utilisation de la nouvelle API Graphics de PixiJS v8
**Contexte** : PixiJS v8 a changé l'API de dessin, `lineStyle()` est deprecated
**Pattern ancien (v7 et avant)** :
```typescript
graphics.lineStyle({ width, color, alpha });
graphics.moveTo(x, y);
graphics.lineTo(x2, y2);
graphics.stroke();
```
**Pattern nouveau (v8+)** :
```typescript
graphics
  .moveTo(x, y)
  .lineTo(x2, y2)
  .stroke({ width, color, alpha });
```
**Note** : Le style de stroke est passé directement à `.stroke()` au lieu d'être défini en amont.
**Feedback** : ✅ Correction appliquée.

## ⚠️ Rappels spécifiques à ce projet

- **Pas de combat** : Le jeu est centré sur l'exploration et la découverte, pas la conquête.
- **Génération procédurale réaliste** : Respecter les bases de l'astronomie.
- **Interface 2D type "plan infini"** : Navigation façon Figma (zoom/pan).
- **Planètes type-Terre ultra-rares** : La découverte doit rester exceptionnelle.
- **Approche contemplative** : Pas de pression temporelle, ambiance chill.
- **PixiJS v8** : Utiliser la nouvelle API Graphics (`.stroke()` au lieu de `.lineStyle()`).

## 🔧 Commandes projet utiles

**Setup** : `npm install`
**Dev** : `npm run dev` (lance Vite sur http://localhost:5173)
**Build** : `npm run build`
**Test** : `npm test`
**Lint** : `npm run lint`
**Format** : `npm run format`

> _Ces commandes sont détaillées dans le [README.md](./README.md)_
