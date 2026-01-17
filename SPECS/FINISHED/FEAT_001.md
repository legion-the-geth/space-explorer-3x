# FEAT-001 : Système de Découverte et d'Exploration

> **Version** : 1.1
> **Date** : 2026-01-15
> **Status** : 🟢 Terminé

---

## 📝 Changelog

### 2026-01-17 - Step 5 Implémenté (Feature Complete)
- ✅ **Step 5**: Jump to System
  - Mécanique de saut fonctionnelle
  - Mise à jour de la position joueur
  - Révélation des systèmes voisins (REACHABLE)
  - Refonte UI avec boutons conditionnels

### 2026-01-15 - Steps 1-4 Implémentés
- ✅ **Step 1**: Discovery Store (Zustand vanilla)
- ✅ **Step 2**: Zone de visibilité (50 AL au lieu de 200 AL)
- ✅ **Step 3**: Rendu visuel + icône joueur
- ✅ **Step 4**: Scan System
  - Génération procédurale de planètes (0-8, types variés)
  - Jump lines avec distribution pondérée [0-4] : 0:10%, 1:15%, 2:25%, 3:35%, 4:15%
  - Protection anti-softlock (garantit min 1 ligne si système isolé)
  - UI améliorée : bouton Scan centré, bouton retour en bas gauche
  - Status badge (Scanned vert / Visited orange)
  - Affichage jump lines dans panel de détails
  - Masquage bouton Scan après usage
- ✅ **Step 5**: Jump to System

---

## 🎯 Objectif

Créer un système de découverte progressive avec fog of war intelligent, incitant le joueur à explorer méthodiquement l'espace inconnu.

## 📊 États des Systèmes Stellaires

### Définition des états

```typescript
enum SystemDiscoveryState {
  UNKNOWN = 'unknown',       // Pas dans zone visibilité, jamais découvert
  VISIBLE = 'visible',       // Dans zone visibilité (point gris, aucune info)
  REACHABLE = 'reachable',   // Ligne de saut connue (point coloré, infos de base)
  VISITED = 'visited',       // Joueur y est allé (point coloré, infos + nb objets garantis)
  SCANNED = 'scanned',       // Scanné manuellement (tout révélé + lignes de saut)
}
```

### Transitions d'états

```
UNKNOWN → VISIBLE        (entre dans zone de visibilité)
VISIBLE → REACHABLE      (système scanné révèle ligne de saut vers lui)
REACHABLE → VISITED      (joueur effectue un saut vers le système)
VISITED → SCANNED        (joueur scanne manuellement le système)

Notes:
- Un système REACHABLE peut devenir VISITED directement (saut)
- Un système VISIBLE ne peut pas devenir VISITED directement (pas de ligne de saut connue)
```

## 🎮 Mécaniques de Gameplay

### 1. Démarrage du Jeu

**Position initiale** : `(0, 0)` (système forcé, sans jitter)
- Le joueur spawn au point d'origine
- Le système `(0, 0)` est automatiquement en état **VISITED**
- Tous les systèmes dans un rayon de **50 AL** (500 unités) deviennent **VISIBLE**
- Affichage : points gris avec halo subtil, sans informations
- Message au joueur : _"Scan your current system to reveal jump lines"_

### 2. Scanner un Système

**Conditions** :
- Le joueur doit être physiquement dans le système (pas de scan à distance pour MVP)
- Le système doit être en état **VISITED**

**Coût** :
- Gratuit pour MVP (à implémenter : coût fixe en fuel)
- Évolution future : coût variable selon taille/complexité du système

**Action** : Bouton _"Scan System"_ dans la vue détail (masqué après scan)

**Résultats** :
1. Le système actuel passe en état **SCANNED**
2. Révélation de tous les objets du système :
   - Planètes (0-8, génération procédurale)
   - Types : Rocky, Gas Giant, Ice, Desert, Ocean, Lava
   - Propriétés : distance (AU), rayon, masse
3. Révélation des **lignes de saut** disponibles depuis ce système :
   - Distribution pondérée : 0-4 lignes
     - 0 ligne : 10%
     - 1 ligne : 15%
     - 2 lignes : 25%
     - 3 lignes : 35%
     - 4 lignes : 15%
   - Protection anti-softlock : min 1 ligne si système isolé
   - Distance max : 20 AL (200 unités)
   - Probabilité décroissante avec distance : P = 1 / (1 + distance/50)
   - Limite : 4 connexions max par système
4. Les systèmes accessibles passent en état **REACHABLE** (colorés sur la carte)
5. UI mise à jour :
   - Status badge "Scanned" (vert)
   - Liste des planètes dans panel
   - Liste des jump lines (noms systèmes connectés)

### 3. Effectuer un Saut (Jump)

**Conditions** :
- Le système cible doit être en état **REACHABLE**
- Le joueur doit avoir assez de ressources (fuel)

**Coût** :
- Fixe pour MVP (ex: 100 unités de fuel)
- Évolution future : coût variable selon distance, type d'étoile, etc.

**Action** : Bouton _"Jump to [System Name]"_ dans la vue détail d'un système **REACHABLE**

**Résultats** :
1. Téléportation instantanée du joueur vers le système cible
2. Le système cible passe en état **VISITED**
3. Affichage des informations de base :
   - Propriétés de l'étoile (type, température, masse, rayon)
   - Status badge "Visited" (orange)
   - Nombre d'objets garantis (ex: "3 planets detected")
4. Mise à jour de la zone de visibilité :
   - Nouveaux systèmes dans le rayon de 50 AL deviennent **VISIBLE**
   - Les systèmes **SCANNED** restent visibles partout (hors fog of war)
5. Les lignes de saut depuis/vers les systèmes **SCANNED** restent affichées
6. Icône joueur (triangle blanc) se déplace sur le nouveau système

### 4. Zone de Visibilité

**Rayon** : 50 années-lumière (500 unités)

**Règles** :
- Centrée sur la position actuelle du joueur
- Se met à jour à chaque saut
- Les systèmes **VISIBLE** (gris avec halo) apparaissent/disparaissent selon la position
- Les systèmes **SCANNED** restent visibles en permanence, même hors zone
- Tous les systèmes visibles ont un halo (gris pour VISIBLE, couleur pour autres états)

**Évolution future** :
- Amélioration du vaisseau → augmentation du rayon de visibilité
- Équipements spéciaux → bonus de portée

## 🎨 Rendu Visuel

### États visuels sur la carte galaxie

| État       | Couleur           | Glow (alpha)     | Label        | Au clic                          | Status badge |
|------------|-------------------|------------------|--------------|----------------------------------|--------------|
| UNKNOWN    | Invisible         | Non              | N/A          | Impossible                       | N/A          |
| VISIBLE    | Gris (#888888)    | Oui (0.3)        | "???"        | _"System not accessible yet"_    | N/A          |
| REACHABLE  | Couleur étoile    | Oui (0.3)        | Type (M/K/G) | Vue détail + bouton _"Jump"_    | N/A          |
| VISITED    | Couleur étoile    | Oui (0.3)        | Nom système  | Vue détail + bouton _"Scan"_    | Orange       |
| SCANNED    | Couleur étoile    | Oui+ (0.5)       | Nom système  | Vue détail complète              | Vert         |

**Notes** :
- Tous les systèmes visibles ont un halo (glow), même les VISIBLE (gris)
- Le glow est plus intense pour SCANNED (alpha 0.5 vs 0.3)
- Hover effect : scale 1.5x sur star + glow

### Lignes de saut

**Affichage** :
- Uniquement entre systèmes **SCANNED** et systèmes **REACHABLE** depuis eux
- Couleur : Cyan (#00aaff)
- Épaisseur : 1 pixel
- Style : Ligne pleine, légèrement transparente (alpha: 0.5)

**Bidirectionnalité** :
- Si A est **SCANNED** et révèle B, alors A↔B est créé
- La ligne est affichée dans les deux sens
- Un saut de B vers A est possible (même coût)

### Icône du joueur

**Forme** : Triangle (◀) pointant vers le haut
**Couleur** : Blanc éclatant (#FFFFFF) ou Cyan (#00FFFF)
**Taille** : ~15 pixels
**Position** : Exactement sur le système actuel
**Animation** : Léger pulse (optionnel pour MVP)

## 💎 Informations Révélées

### État VISIBLE (gris)
- Aucune information
- Label "???" au survol

### État REACHABLE (coloré)
- Type spectral de l'étoile (O, B, A, F, G, K, M)
- Nom du système (SEC-A7-M142)
- Position (coordonnées)
- Coût du saut pour y aller

### État VISITED
- Tout ce qui est en REACHABLE, plus :
- Température de l'étoile
- Masse de l'étoile
- Rayon de l'étoile
- **Nombre d'objets garantis** (ex: "3 planets detected")
- Possibilité de scanner

### État SCANNED
- Tout ce qui est en VISITED, plus :
- Liste complète des planètes avec propriétés
- Liste complète des lunes
- Astéroïdes/ceintures
- **Objets bonus** révélés (objets rares non comptés dans le nombre garanti)
- Lignes de saut disponibles depuis ce système
- Coût des sauts vers chaque destination

## 📦 Données à Persister

### Store Zustand : `useDiscoveryStore`

```typescript
interface DiscoveryStore {
  playerPosition: { systemId: string; x: number; y: number };
  discoveredSystems: Map<string, SystemDiscoveryData>;
  jumpLines: JumpLine[];

  // Actions
  setPlayerPosition: (systemId: string, x: number, y: number) => void;
  updateSystemState: (systemId: string, state: SystemDiscoveryState) => void;
  addJumpLine: (fromId: string, toId: string, cost: number) => void;
  scanSystem: (systemId: string) => void;
  jumpToSystem: (systemId: string) => void;
}

interface SystemDiscoveryData {
  id: string;
  state: SystemDiscoveryState;
  scannedAt?: number; // timestamp
  visitedAt?: number; // timestamp
}

interface JumpLine {
  from: string;
  to: string;
  cost: number;
  discoveredAt: number; // timestamp
}
```

### Sauvegarde IndexedDB

Les données suivantes doivent être sauvegardées :
- Position du joueur (systemId, x, y)
- État de chaque système découvert
- Liste des lignes de saut connues
- Ressources du joueur (fuel, etc.)

## 🚀 Workflow Complet (Exemple)

```
1. Spawn à (0, 0)
   └─> Système (0,0) = VISITED (forcé, sans jitter)
   └─> ~20-30 systèmes autour = VISIBLE (gris avec halo)

2. Scan du système (0, 0)
   └─> Système (0, 0) = SCANNED
   └─> Révèle 0-8 planètes (ex: 4 planètes générées)
   └─> Révèle 0-4 lignes de saut (distribution pondérée)
   └─> Ex: 2 lignes créées vers A et B
   └─> A, B = REACHABLE (colorés)
   └─> Bouton Scan disparaît, status badge "Scanned" (vert)

3. Jump vers A
   └─> Téléportation vers A
   └─> A = VISITED
   └─> Affiche "4 planets detected"
   └─> Zone de visibilité se centre sur A
   └─> Nouveaux systèmes gris apparaissent autour de A

4. Scan de A
   └─> A = SCANNED
   └─> Révèle 5 planètes (4 garanties + 1 bonus)
   └─> Révèle 2 lignes de saut : vers D et E
   └─> D et E = REACHABLE (colorés)
   └─> Ligne de saut A↔(0,0) reste visible

5. Navigation
   └─> Le joueur peut voir la "carte" des systèmes scannés
   └─> Les systèmes VISIBLE (gris) changent selon sa position
   └─> Les systèmes SCANNED restent toujours visibles
   └─> Il peut planifier sa route d'exploration
```

## 🔮 Évolutions Futures (Hors MVP)

### Scan à distance
- Scanner un système REACHABLE sans y aller (coût plus élevé)
- Révèle les lignes de saut sans se déplacer

### Coûts dynamiques
- Coût du saut proportionnel à la distance
- Ressources rares pour certains types de sauts
- Bonus/malus selon le type d'étoile

### Re-scan
- Possibilité de re-scanner un système SCANNED
- Révèle des événements temporaires (anomalies, vaisseaux, etc.)

### Upgrades vaisseau
- Augmentation de la zone de visibilité
- Réduction des coûts de scan/saut
- Scan automatique à l'arrivée dans un système

### Cartographie avancée
- Partage de cartes entre joueurs (mode coop futur)
- Achat de "cartes" pré-scannées (pour éviter le grind)
- Balises personnalisées sur la carte

---

**Fin de FEAT-001**
