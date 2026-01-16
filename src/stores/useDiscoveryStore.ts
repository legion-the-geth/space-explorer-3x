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
 * System info for jump line generation
 */
export interface SystemInfo {
  id: string;
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
  addJumpLine: (from: string, to: string, cost: number) => boolean;
  scanSystem: (
    systemId: string,
    sourceX: number,
    sourceY: number,
    availableSystems: SystemInfo[]
  ) => void;
  jumpToSystem: (systemId: string, x: number, y: number) => void;
  getSystemState: (systemId: string) => SystemDiscoveryState;
  isSystemJumpable: (systemId: string) => boolean;
  initializePlayer: (x: number, y: number) => void;
  setVisibleSystems: (systemIds: string[]) => void;
  getConnectionCount: (systemId: string) => number;
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
      visitedAt:
        state === SystemDiscoveryState.VISITED || state === SystemDiscoveryState.SCANNED
          ? timestamp
          : existingData?.visitedAt,
    };

    const updatedSystems = new Map(discoveredSystems);
    updatedSystems.set(systemId, newData);

    set({ discoveredSystems: updatedSystems });
  },

  // Add a jump line between two systems
  addJumpLine: (from: string, to: string, cost: number): boolean => {
    const { jumpLines } = get();

    // Check if line already exists
    const exists = jumpLines.some(
      (line) => (line.from === from && line.to === to) || (line.from === to && line.to === from)
    );

    if (!exists) {
      set({
        jumpLines: [...jumpLines, { from, to, cost, discoveredAt: Date.now() }],
      });
      return true;
    }
    return false;
  },

  // Get number of connections for a system
  getConnectionCount: (systemId: string): number => {
    const { jumpLines } = get();
    return jumpLines.filter((line) => line.from === systemId || line.to === systemId).length;
  },

  // Scan a system (reveals jump lines)
  scanSystem: (
    systemId: string,
    sourceX: number,
    sourceY: number,
    availableSystems: SystemInfo[]
  ) => {
    const {
      updateSystemState,
      addJumpLine,
      getConnectionCount,
      jumpLines,
      discoveredSystems,
      getSystemState,
    } = get();

    // Update system state to SCANNED
    updateSystemState(systemId, SystemDiscoveryState.SCANNED);

    // Generate jump lines
    const MAX_JUMP_DISTANCE = 200; // 20 AL
    const MAX_CONNECTIONS = 4;

    // Identify systems already connected to the current one
    const connectedSystemIds = new Set<string>();
    jumpLines.forEach(line => {
      if (line.from === systemId) connectedSystemIds.add(line.to);
      if (line.to === systemId) connectedSystemIds.add(line.from);
    });

    // Filter systems within jump range AND NOT already connected
    const nearSystems = availableSystems.filter((sys) => {
      if (sys.id === systemId) return false; // Don't connect to self
      if (connectedSystemIds.has(sys.id)) return false; // Don't duplicate connection

      const dx = sys.x - sourceX;
      const dy = sys.y - sourceY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance <= MAX_JUMP_DISTANCE;
    });

    // Sort by distance (closest first)
    nearSystems.sort((a, b) => {
      const distA = Math.sqrt((a.x - sourceX) ** 2 + (a.y - sourceY) ** 2);
      const distB = Math.sqrt((b.x - sourceX) ** 2 + (b.y - sourceY) ** 2);
      return distA - distB;
    });

    const existingConnectionsCount = connectedSystemIds.size;

    // Check if player has other accessible systems (to avoid softlock)
    const hasOtherAccessibleSystems = Array.from(discoveredSystems.values()).some(
      (system) =>
        system.id !== systemId &&
        system.state === SystemDiscoveryState.VISITED &&
        jumpLines.some((line) => line.from === system.id || line.to === system.id)
    );

    // Determine number of new jump lines (0-4 with weighted distribution)
    // Distribution: 0:10%, 1:15%, 2:25%, 3:35%, 4:15%
    const roll = Math.random();
    let numLines: number;
    if (roll < 0.1) numLines = 0;
    else if (roll < 0.25) numLines = 1;
    else if (roll < 0.5) numLines = 2;
    else if (roll < 0.85) numLines = 3;
    else numLines = 4;

    // ANTI-SOFTLOCK: Guarantee at least 1 line if:
    // - This system has no existing connections AND
    // - Player has no other accessible systems with connections
    if (existingConnectionsCount === 0 && !hasOtherAccessibleSystems && numLines === 0) {
      numLines = 1;
      console.log('⚠️ Anti-softlock: forcing 1 jump line to prevent player from being stuck');
    }

    let createdLines = 0;
    for (const targetSystem of nearSystems) {
      if (createdLines >= numLines) break;

      // Check if source has room for more connections
      if (getConnectionCount(systemId) >= MAX_CONNECTIONS) break;

      // Check if target has room for more connections
      if (getConnectionCount(targetSystem.id) >= MAX_CONNECTIONS) continue;

      // Calculate distance and cost
      const dx = targetSystem.x - sourceX;
      const dy = targetSystem.y - sourceY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Probability decreases with distance
      const probability = 1 / (1 + distance / 50);

      if (Math.random() < probability) {
        const added = addJumpLine(systemId, targetSystem.id, distance);
        
        if (added) {
            createdLines++;
            // Update target system state to REACHABLE if it was VISIBLE or UNKNOWN
            const targetState = getSystemState(targetSystem.id);
            if (targetState === SystemDiscoveryState.VISIBLE || targetState === SystemDiscoveryState.UNKNOWN) {
                updateSystemState(targetSystem.id, SystemDiscoveryState.REACHABLE);
            }
        }
      }
    }

    console.log(`🔬 Scanned system ${systemId}: created ${createdLines} new jump lines (had ${existingConnectionsCount} existing)`);
  },

  // Jump to a system
  jumpToSystem: (systemId: string, x: number, y: number) => {
    const { setPlayerPosition, updateSystemState, getSystemState, jumpLines } = get();

    // Update player position
    setPlayerPosition(systemId, x, y);

    // Update system state to VISITED (if not already SCANNED)
    const currentState = getSystemState(systemId);
    if (currentState !== SystemDiscoveryState.SCANNED) {
      updateSystemState(systemId, SystemDiscoveryState.VISITED);
    }

    // When jumping to a system, all its neighbors via jump lines should become REACHABLE
    jumpLines.forEach((line) => {
      let neighborId: string | null = null;
      if (line.from === systemId) neighborId = line.to;
      else if (line.to === systemId) neighborId = line.from;

      if (neighborId) {
        const neighborState = getSystemState(neighborId);
        if (
          neighborState === SystemDiscoveryState.VISIBLE ||
          neighborState === SystemDiscoveryState.UNKNOWN
        ) {
          updateSystemState(neighborId, SystemDiscoveryState.REACHABLE);
        }
      }
    });
  },

  // Get system state (returns UNKNOWN if not found)
  getSystemState: (systemId: string): SystemDiscoveryState => {
    const { discoveredSystems } = get();
    return discoveredSystems.get(systemId)?.state ?? SystemDiscoveryState.UNKNOWN;
  },

  // Check if a system can be jumped to from current position
  isSystemJumpable: (systemId: string): boolean => {
    const { playerPosition, jumpLines, getSystemState } = get();

    // Cannot jump to current system
    if (systemId === playerPosition.systemId) return false;

    // System must be REACHABLE, VISITED or SCANNED
    const state = getSystemState(systemId);
    if (state === SystemDiscoveryState.UNKNOWN || state === SystemDiscoveryState.VISIBLE) {
      return false;
    }

    // Must have a jump line between current system and target system
    return jumpLines.some(
      (line) =>
        (line.from === playerPosition.systemId && line.to === systemId) ||
        (line.from === systemId && line.to === playerPosition.systemId)
    );
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