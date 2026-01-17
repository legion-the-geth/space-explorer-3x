# FEAT-002 : Orbital Vision & System Detail

> **Version** : 1.1 (Tech Review)
> **Date** : 2026-01-17
> **Status** : 🟢 READY
> **Dépendance** : FEAT-001

---

## 🎯 Vision
Actuellement, quand on entre dans un système, on ne voit que l'étoile. C'est triste.
L'objectif est de transformer la vue détaillée (`SystemVisualizer`) pour afficher une **représentation orbitale complète** du système stellaire. Le joueur doit avoir l'impression de regarder une carte tactique du système.

On veut du "Whaou" visuel tout en restant lisible et performant.

## 🎨 UI & UX Design

### 1. La Vue Orbitale (Canvas)
Au lieu d'une simple étoile au centre, nous afficherons :
- **L'Étoile** : Au centre (déjà fait), mais peut-être un peu plus petite pour laisser de la place.
- **Les Orbites** : Des cercles concentriques fins (gris très clair, opacité faible) représentant la trajectoire des planètes.
- **Les Planètes** : Des disques colorés positionnés sur leurs orbites.
  - **Taille** : Variable selon le type (Géante vs Rocheuse).
  - **Couleur** : Basée sur le type de planète (Bleu pour Océan, Rouge pour Lave, etc.).
  - **Position** : Calculée via un angle aléatoire (ou basé sur le temps) pour ne pas qu'elles soient toutes alignées.

### 2. Interaction
- **Hover** :
  - Sur une planète : Scale up (x1.2), bordure blanche (sélection), curseur pointer.
  - Sur l'étoile : Déjà existant.
- **Click** :
  - Sélectionne l'objet (Planète ou Étoile).
  - Met à jour le panneau latéral (voir point 3).
- **Background Click** :
  - Désélectionne la planète (retour aux infos système).

### 3. Panneau Latéral (Mise à jour)
Le panneau d'information actuel (`SystemInfoPanel`) doit évoluer pour afficher les infos de l'objet sélectionné.
- **Si rien/étoile sélectionnée** : Infos système (comme avant).
- **Si planète sélectionnée** :
  - Nom (ex: "SEC-A7-M142 III")
  - Type (ex: "Gas Giant")
  - Caractéristiques (Rayon, Distance de l'étoile).
  - (Placeholder) Bouton "Scan Planet" (grisé pour le moment).

## 🛠️ Spécifications Techniques

### Data Model
- Pas de modification de la structure de données `Planet` (on garde le modèle physique pur).
- Ajouter un **mapping de présentation** dans `src/game/generation/constants.ts` :
  ```typescript
  export const PLANET_TYPE_COLORS: Record<PlanetType, number> = {
      'Rocky': 0x8B7355,
      'Gas Giant': 0xE6B333,
      'Ice': 0xA5F2F3,
      'Desert': 0xE6A15C,
      'Ocean': 0x2A6FDB,
      'Lava': 0xFF4500
  };
  ```

### Rendering (PixiJS)
Utilisation de `pixi.js` dans `SystemVisualizer.ts`.
- **Hiérarchie (Containers)** :
  - `mainContainer`
    - `orbitsContainer` (z-index bas, alpha 0.2)
    - `starContainer` (Middle)
    - `planetsContainer` (z-index haut, interactive)

- **Système de "Visual Slots" (Pseudo-échelle)** :
  - Les distances réelles (AU) sont inexploitables à l'écran.
  - Utiliser une progression linéaire pour l'affichage uniquement :
    - Star Radius : `R` (ex: 40px)
    - Orbit gap : `G` (ex: 30px)
    - Rayon visuel orbite `i` : `R + (i + 1) * G`
  - La taille des planètes doit aussi être symbolique (ex: Rocheuse = 5px, Géante = 12px) et non à l'échelle de l'étoile.

## ✅ Tâches

### Core & Logic
- [ ] **[CONSTANTS]** Ajouter `PLANET_TYPE_COLORS` et `PLANET_TYPE_SIZES` (pour le rendu visuel) dans `src/game/generation/constants.ts`.
- [ ] **[HELPER]** (Optionnel) Créer un helper `getPlanetVisuals(type)` qui retourne couleur et taille.

### Visualisation (SystemVisualizer.ts)
- [ ] **[REFACTO]** Réorganiser `SystemVisualizer` avec des `Container` distincts (Orbits, Star, Planets).
- [ ] **[VISUAL]** Implémenter la boucle de rendu des orbites (cercles gris fin).
- [ ] **[VISUAL]** Implémenter le rendu des planètes :
    - Position : `(cos(angle) * visualDist, sin(angle) * visualDist)`.
    - Angle : Aléatoire à la création (`Math.random() * Math.PI * 2`).
- [ ] **[INTERACTION]** Ajouter l'interactivité sur les Sprites/Graphics des planètes :
    - `eventMode = 'static'`
    - `cursor = 'pointer'`
    - Gestion du Hover (Scale up).

### UI (SystemInfoPanel.ts)
- [ ] **[REFACTO]** Modifier `SystemInfoPanel` pour gérer un état interne ou accepter une prop `selectedData`.
- [ ] **[UI]** Créer une méthode `renderPlanetInfo(planet: Planet)` qui remplace le contenu du panneau.
- [ ] **[UI]** Créer une méthode `renderSystemInfo(...)` (le code actuel) pour le retour à la vue par défaut.
- [ ] **[LINK]** Connecter le `click` des planètes dans `SystemVisualizer` à une méthode publique de `SystemInfoPanel` (via le parent `SystemDetailView` ou un store/event).

---
**Note Tech-Lead** : Pour la communication entre le Visualizer et le Panel, le plus simple pour l'instant est de passer un callback `onPlanetSelect(planet)` du parent (`SystemDetailView`) vers le `SystemVisualizer`, et que le parent mette à jour le `SystemInfoPanel`.
