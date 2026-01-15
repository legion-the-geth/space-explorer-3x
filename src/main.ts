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

  // Generate star systems in initial visible region
  // For now, generate a large region around origin
  const initialSystems = universeGenerator.generateSystemsInRegion(-1000, 1000, -1000, 1000);

  console.log(`🌟 Generated ${initialSystems.length} star systems in initial region`);

  // Render star systems in galaxy view
  const systemGraphics: Map<string, { graphic: Graphics; system: StarSystem }> = new Map();

  initialSystems.forEach((system) => {
    const starContainer = new Container();
    starContainer.eventMode = 'static';
    starContainer.cursor = 'pointer';

    // Glow effect (size varies by star type)
    const glowSize = system.star.type === 'O' || system.star.type === 'B' ? 10 : 8;
    const glow = new Graphics();
    glow.circle(0, 0, glowSize);
    glow.fill({ color: system.star.color, alpha: 0.3 });
    starContainer.addChild(glow);

    // Star graphic (size varies by star type)
    const starSize = system.star.type === 'O' || system.star.type === 'B' ? 6 : 5;
    const star = new Graphics();
    star.circle(0, 0, starSize);
    star.fill({ color: system.star.color });
    starContainer.addChild(star);

    starContainer.position.set(system.position.x, system.position.y);

    // Click handler (left click only)
    starContainer.on('pointerdown', (event) => {
      if (event.button === 0) {
        // Left click only
        console.log(`Clicked on system: ${system.name}`);
        viewManager.showSystemView(system.id);
        systemDetailView.showSystem(system);
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
    systemGraphics.set(system.id, { graphic: star, system });
  });

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
