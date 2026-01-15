import { createStore } from 'zustand/vanilla';

/**
 * Discovery states for star systems
 */
export enum SystemDiscoveryState {
  UNKNOWN = 'unknown', // Not in visibility zone, never discovered
  VISIBLE = 'visible', // In visibility zone (gray dot, no info)
  REACHABLE = 'reachable', // Jump line known (colored dot, basic info)
  VISITED = 'visited', // Player has been there (colored, info + guaranteed objects count)
  SCANNED = 'scanned', // Manually scanned (everything revealed + jump lines)
}

/**
 * Discovery data for a star system
 */
export interface SystemDiscoveryData {
  id: string;
  state: SystemDiscoveryState;
  scannedAt?: number; // Timestamp
  visitedAt?: number; // Timestamp
}

/**
 * Jump line between two systems
 */
export interface JumpLine {
  from: string;
  to: string;
  cost: number;
  discoveredAt: number; // Timestamp
}

/**
 * Player position
 */
export interface PlayerPosition {
  systemId: string;
  x: number;
  y: number;
}

/**
 * Discovery store interface
 */
interface DiscoveryStore {
  // State
  playerPosition: PlayerPosition;
  discoveredSystems: Map<string, SystemDiscoveryData>;
  jumpLines: JumpLine[];

  // Actions
  setPlayerPosition: (systemId: string, x: number, y: number) => void;
  updateSystemState: (systemId: string, state: SystemDiscoveryState) => void;
  addJumpLine: (from: string, to: string, cost: number) => void;
  scanSystem: (systemId: string) => void;
  jumpToSystem: (systemId: string, x: number, y: number) => void;
  getSystemState: (systemId: string) => SystemDiscoveryState;
  initializePlayer: (x: number, y: number) => void;
  setVisibleSystems: (systemIds: string[]) => void;
}

/**
 * Discovery store using Zustand (vanilla API for non-React projects)
 */
export const discoveryStore = createStore<DiscoveryStore>((set, get) => ({
  // Initial state
  playerPosition: { systemId: '', x: 0, y: 0 },
  discoveredSystems: new Map(),
  jumpLines: [],

  // Set player position
  setPlayerPosition: (systemId: string, x: number, y: number) => {
    set({ playerPosition: { systemId, x, y } });
  },

  // Update system discovery state
  updateSystemState: (systemId: string, state: SystemDiscoveryState) => {
    const { discoveredSystems } = get();
    const existingData = discoveredSystems.get(systemId);
    const timestamp = Date.now();

    const newData: SystemDiscoveryData = {
      id: systemId,
      state,
      scannedAt: state === SystemDiscoveryState.SCANNED ? timestamp : existingData?.scannedAt,
      visitedAt: state === SystemDiscoveryState.VISITED || state === SystemDiscoveryState.SCANNED
        ? timestamp
        : existingData?.visitedAt,
    };

    const updatedSystems = new Map(discoveredSystems);
    updatedSystems.set(systemId, newData);

    set({ discoveredSystems: updatedSystems });
  },

  // Add a jump line between two systems
  addJumpLine: (from: string, to: string, cost: number) => {
    const { jumpLines } = get();

    // Check if line already exists
    const exists = jumpLines.some(
      (line) => (line.from === from && line.to === to) || (line.from === to && line.to === from)
    );

    if (!exists) {
      set({
        jumpLines: [
          ...jumpLines,
          { from, to, cost, discoveredAt: Date.now() },
        ],
      });
    }
  },

  // Scan a system (reveals jump lines)
  scanSystem: (systemId: string) => {
    const { updateSystemState } = get();
    updateSystemState(systemId, SystemDiscoveryState.SCANNED);

    // TODO: Generate jump lines (will be implemented in step 4)
    // For now, just update the state
  },

  // Jump to a system
  jumpToSystem: (systemId: string, x: number, y: number) => {
    const { setPlayerPosition, updateSystemState } = get();

    // Update player position
    setPlayerPosition(systemId, x, y);

    // Update system state to VISITED
    updateSystemState(systemId, SystemDiscoveryState.VISITED);

    // TODO: Update visibility zone (will be implemented in step 2)
  },

  // Get system state (returns UNKNOWN if not found)
  getSystemState: (systemId: string): SystemDiscoveryState => {
    const { discoveredSystems } = get();
    return discoveredSystems.get(systemId)?.state ?? SystemDiscoveryState.UNKNOWN;
  },

  // Initialize player at spawn point
  initializePlayer: (x: number, y: number) => {
    const spawnSystemId = `sys_${Math.floor(x)}_${Math.floor(y)}`;

    set({
      playerPosition: { systemId: spawnSystemId, x, y },
      discoveredSystems: new Map([
        [
          spawnSystemId,
          {
            id: spawnSystemId,
            state: SystemDiscoveryState.VISITED,
            visitedAt: Date.now(),
          },
        ],
      ]),
      jumpLines: [],
    });
  },

  // Set systems as VISIBLE (called when updating visibility zone)
  setVisibleSystems: (systemIds: string[]) => {
    const { discoveredSystems } = get();
    const updatedSystems = new Map(discoveredSystems);

    systemIds.forEach((systemId) => {
      const existing = updatedSystems.get(systemId);

      // Only set to VISIBLE if not already discovered
      if (!existing || existing.state === SystemDiscoveryState.UNKNOWN) {
        updatedSystems.set(systemId, {
          id: systemId,
          state: SystemDiscoveryState.VISIBLE,
        });
      }
    });

    set({ discoveredSystems: updatedSystems });
  },
}));
