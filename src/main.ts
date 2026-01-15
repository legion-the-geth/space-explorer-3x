import './style.css';
import { Application, Graphics, Container } from 'pixi.js';
import { Camera } from '@core/Camera';
import { InputManager } from '@core/InputManager';
import { ViewManager, ViewMode } from '@core/ViewManager';
import { Grid } from '@ui/Grid';
import { HUD } from '@ui/HUD';
import { SystemDetailView } from '@ui/SystemDetailView';
import { StarSystem } from '@game/StarSystem';
import { UniverseGenerator } from '@game/generation/UniverseGenerator';
import { discoveryStore, SystemDiscoveryState } from '@stores/useDiscoveryStore';
import { VISIBILITY_RADIUS } from '@game/generation/constants';

// Initialize PixiJS application
const app = new Application();

async function init() {
  // Initialize the application
  await app.init({
    background: '#0d0d0d',
    resizeTo: window,
    antialias: true,
  });

  // Append canvas to DOM
  const appContainer = document.querySelector<HTMLDivElement>('#app');
  if (!appContainer) {
    throw new Error('App container not found');
  }
  appContainer.appendChild(app.canvas);

  // Create view manager
  const viewManager = new ViewManager({
    onViewChange: (mode) => {
      console.log(`View changed to: ${mode}`);
      // Update HUD or other UI elements based on view mode if needed
    },
  });

  app.stage.addChild(viewManager.galaxy);
  app.stage.addChild(viewManager.system);

  // ========== GALAXY VIEW SETUP ==========

  // Create camera system for galaxy view
  const camera = new Camera({
    minZoom: 0.1,
    maxZoom: 10,
    zoomSpeed: 0.15,
    smoothing: 0.15,
  });

  viewManager.galaxy.addChild(camera.container);

  // Create grid
  const grid = new Grid({
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    camera,
  });
  camera.container.addChild(grid.displayObject);

  // Initialize universe generator with a seed
  // TODO: Allow player to input custom seed or generate random one
  const universeGenerator = new UniverseGenerator('space-explorer-3x-default-seed');

  // Initialize player at spawn point (0, 0)
  const spawnX = 0;
  const spawnY = 0;

  // Initialize discovery store
  const { initializePlayer, setVisibleSystems, updateSystemState, setPlayerPosition } = discoveryStore.getState();

  // Generate spawn system at EXACT (0, 0) coordinates
  const spawnSystem = universeGenerator.generateSpawnSystem(spawnX, spawnY);

  // Generate star systems within visibility radius around spawn point
  const otherSystems = universeGenerator.generateSystemsInRadius(
    spawnX,
    spawnY,
    VISIBILITY_RADIUS
  );

  // Combine spawn system with other systems (remove duplicates if any)
  const initialSystems = [
    spawnSystem,
    ...otherSystems.filter((s) => s.id !== spawnSystem.id),
  ];

  console.log(`🌟 Generated ${initialSystems.length} star systems in visibility radius (${VISIBILITY_RADIUS / 10} AL)`);

  // Initialize player at spawn system (0, 0)
  // This will mark the spawn system as VISITED in the discovery store
  initializePlayer(spawnSystem.position.x, spawnSystem.position.y);
  setPlayerPosition(spawnSystem.id, spawnSystem.position.x, spawnSystem.position.y);

  // Mark all generated systems as VISIBLE (spawn system will remain VISITED)
  setVisibleSystems(initialSystems.map((s) => s.id));

  console.log(`🎮 Player spawned at system ${spawnSystem.name} (${spawnSystem.position.x.toFixed(0)}, ${spawnSystem.position.y.toFixed(0)})`);

  // Render star systems in galaxy view
  const systemGraphics: Map<string, { graphic: Graphics; system: StarSystem }> = new Map();

  initialSystems.forEach((system) => {
    const starContainer = new Container();
    starContainer.eventMode = 'static';
    starContainer.cursor = 'pointer';

    // Get discovery state from store
    const { getSystemState } = discoveryStore.getState();
    const discoveryState = getSystemState(system.id);

    // Determine visual properties based on discovery state
    let starColor: number;
    let glowAlpha: number;

    switch (discoveryState) {
      case SystemDiscoveryState.UNKNOWN:
        // Should not be rendered (but just in case, make it invisible)
        starContainer.visible = false;
        return;

      case SystemDiscoveryState.VISIBLE:
        // Gray dot with subtle glow
        starColor = 0x888888;
        glowAlpha = 0.3;
        break;

      case SystemDiscoveryState.REACHABLE:
      case SystemDiscoveryState.VISITED:
        // Colored star with glow
        starColor = system.star.color;
        glowAlpha = 0.3;
        break;

      case SystemDiscoveryState.SCANNED:
        // Colored star with stronger glow
        starColor = system.star.color;
        glowAlpha = 0.5;
        break;

      default:
        starColor = system.star.color;
        glowAlpha = 0.3;
    }

    // Glow effect (always present for all visible systems)
    const glowSize = system.star.type === 'O' || system.star.type === 'B' ? 10 : 8;
    const glow = new Graphics();
    glow.circle(0, 0, glowSize);
    glow.fill({ color: starColor, alpha: glowAlpha });
    starContainer.addChild(glow);

    // Star graphic
    const starSize = system.star.type === 'O' || system.star.type === 'B' ? 6 : 5;
    const star = new Graphics();
    star.circle(0, 0, starSize);
    star.fill({ color: starColor });
    starContainer.addChild(star);

    starContainer.position.set(system.position.x, system.position.y);

    // Click handler (left click only)
    starContainer.on('pointerdown', (event) => {
      if (event.button === 0) {
        // Left click only
        // Only show details for VISITED or SCANNED systems
        if (
          discoveryState === SystemDiscoveryState.VISITED ||
          discoveryState === SystemDiscoveryState.SCANNED
        ) {
          console.log(`Clicked on system: ${system.name}`);
          viewManager.showSystemView(system.id);
          systemDetailView.showSystem(system);
        } else {
          console.log(`System ${system.name} is not accessible yet (state: ${discoveryState})`);
        }
      }
    });

    // Hover effect
    starContainer.on('pointerenter', () => {
      star.scale.set(1.5);
      if (glow) {
        glow.scale.set(1.5);
      }
    });

    starContainer.on('pointerleave', () => {
      star.scale.set(1);
      if (glow) {
        glow.scale.set(1);
      }
    });

    camera.container.addChild(starContainer);
    systemGraphics.set(system.id, { graphic: star, system });
  });

  // Add player icon (triangle) on the current system
  const playerIcon = new Graphics();
  playerIcon
    .moveTo(0, -10) // Top point
    .lineTo(7, 7) // Bottom right
    .lineTo(-7, 7) // Bottom left
    .lineTo(0, -10) // Back to top
    .fill({ color: 0xffffff, alpha: 1 });

  // Position player icon on spawn system
  playerIcon.position.set(spawnSystem.position.x, spawnSystem.position.y);
  camera.container.addChild(playerIcon);

  // Setup input handling (only affects galaxy view camera)
  const inputManager = new InputManager({
    canvas: app.canvas,
    camera,
  });

  // Center camera on origin
  camera.setPosition(app.screen.width / 2, app.screen.height / 2);

  // ========== SYSTEM VIEW SETUP ==========

  const systemDetailView = new SystemDetailView({
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    onBackToGalaxy: () => {
      viewManager.showGalaxyView();
    },
  });

  viewManager.system.addChild(systemDetailView.displayObject);

  // ========== HUD SETUP ==========

  // Create HUD (rendered in screen space, not world space)
  const hud = new HUD({
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    camera,
  });
  app.stage.addChild(hud.displayObject);

  // ========== UPDATE LOOP ==========

  app.ticker.add(() => {
    // Only update camera and grid when in galaxy view
    if (viewManager.mode === ViewMode.Galaxy) {
      camera.update();
      grid.update();
      hud.update();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    grid.resize(app.screen.width, app.screen.height);
    hud.resize(app.screen.width, app.screen.height);
    systemDetailView.resize(app.screen.width, app.screen.height);
  });

  // Keyboard shortcut: ESC to return to galaxy view
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && viewManager.mode === ViewMode.System) {
      viewManager.showGalaxyView();
    }
  });

  console.log('🌌 Space Explorer 3X initialized');
  console.log('📦 PixiJS version:', app.version);
  console.log('🎮 Controls:');
  console.log('  - Mouse Wheel: Zoom in/out (Galaxy view)');
  console.log('  - Middle Mouse / Space + Drag: Pan (Galaxy view)');
  console.log('  - Left Click on Star: Open system details');
  console.log('  - ESC: Return to galaxy view');

  // Prevent cleanup warning
  void inputManager;
}

init().catch((error) => {
  console.error('Failed to initialize application:', error);
});
