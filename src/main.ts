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
import { PlanetGenerator } from '@game/generation/PlanetGenerator';
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

  // Container for jump lines (rendered behind stars)
  const jumpLinesContainer = new Container();
  camera.container.addChild(jumpLinesContainer);

  // Render star systems in galaxy view
  const systemGraphics: Map<
    string,
    { container: Container; star: Graphics; glow: Graphics; system: StarSystem }
  > = new Map();

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
      glow.scale.set(1.5);
    });

    starContainer.on('pointerleave', () => {
      star.scale.set(1);
      glow.scale.set(1);
    });

    camera.container.addChild(starContainer);
    systemGraphics.set(system.id, { container: starContainer, star, glow, system });
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

  // Declare renderJumpLines function (will be defined later)
  let renderJumpLines: () => void;

  const systemDetailView = new SystemDetailView({
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    onBackToGalaxy: () => {
      viewManager.showGalaxyView();
      // Refresh jump lines when returning to galaxy view
      renderJumpLines();
    },
    getSystemState: (systemId: string) => {
      const { getSystemState } = discoveryStore.getState();
      return getSystemState(systemId);
    },
    getConnectedSystemNames: (systemId: string) => {
      const { jumpLines } = discoveryStore.getState();
      const connectedSystemIds = jumpLines
        .filter((line) => line.from === systemId || line.to === systemId)
        .map((line) => (line.from === systemId ? line.to : line.from));

      // Get system names
      return connectedSystemIds
        .map((id) => {
          const system = initialSystems.find((s) => s.id === id);
          return system ? system.name : id;
        })
        .sort(); // Sort alphabetically
    },
    onScanSystem: (systemId: string) => {
      // Find the system being scanned
      const system = initialSystems.find((s) => s.id === systemId);
      if (!system) {
        console.error(`System ${systemId} not found`);
        return;
      }

      // Generate planets for this system
      const planets = PlanetGenerator.generatePlanets(systemId);
      system.planets = planets;

      console.log(`🪐 Generated ${planets.length} planets for system ${system.name}`);

      // Generate jump lines via discovery store
      const { scanSystem } = discoveryStore.getState();
      const availableSystems = initialSystems.map((s) => ({
        id: s.id,
        x: s.position.x,
        y: s.position.y,
      }));

      scanSystem(systemId, system.position.x, system.position.y, availableSystems);

      // Update jump lines rendering
      renderJumpLines();

      // Update star visual (SCANNED state = stronger glow)
      updateStarVisual(systemId);

      // Refresh system detail view to show planets
      systemDetailView.showSystem(system);
    },
  });

  // Function to render all jump lines
  renderJumpLines = () => {
    jumpLinesContainer.removeChildren();

    const { jumpLines } = discoveryStore.getState();

    jumpLines.forEach((line) => {
      const fromSystem = initialSystems.find((s) => s.id === line.from);
      const toSystem = initialSystems.find((s) => s.id === line.to);

      if (!fromSystem || !toSystem) return;

      const lineGraphic = new Graphics();
      lineGraphic
        .moveTo(fromSystem.position.x, fromSystem.position.y)
        .lineTo(toSystem.position.x, toSystem.position.y)
        .stroke({ width: 1, color: 0x00aaff, alpha: 0.5 });

      jumpLinesContainer.addChild(lineGraphic);
    });
  };

  // Function to update star visual after state change (e.g., after scan)
  const updateStarVisual = (systemId: string) => {
    const systemGraphic = systemGraphics.get(systemId);
    if (!systemGraphic) return;

    const { getSystemState } = discoveryStore.getState();
    const discoveryState = getSystemState(systemId);

    // Update glow based on new state
    if (discoveryState === SystemDiscoveryState.SCANNED) {
      const glowSize =
        systemGraphic.system.star.type === 'O' || systemGraphic.system.star.type === 'B' ? 10 : 8;
      systemGraphic.glow.clear();
      systemGraphic.glow.circle(0, 0, glowSize);
      systemGraphic.glow.fill({ color: systemGraphic.system.star.color, alpha: 0.5 }); // Stronger glow for SCANNED
    }
  };

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
