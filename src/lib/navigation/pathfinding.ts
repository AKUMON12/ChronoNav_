/**
 * ChronoNav Client-Side Pathfinding Engine
 * Implementation of Dijkstra's Algorithm for UC Main Campus (CCS Building)
 */

export interface Neighbor {
  nodeId: string;
  weight: number;
}

export interface Node {
  id: string;
  name: string;
  floor: number;
  x: number;
  y: number;
  type?: 'room' | 'corridor' | 'stairs' | 'elevator' | 'entrance' | 'restroom';
  neighbors: Neighbor[];
}

export interface Waypoint {
  x: number;
  y: number;
  floor: number;
  name: string;
}

export interface PathfindingResult {
  pathNodeIds: string[];
  totalDistance: number;
  waypoints: Waypoint[];
  instructions: string[];
}

/**
 * Finds the shortest path between startId and targetId using Dijkstra's algorithm.
 * Handles multi-floor navigation through stairs/elevators.
 */
export function findShortestPath(
  graph: Record<string, Node>,
  startId: string,
  targetId: string
): PathfindingResult | null {
  if (!graph[startId] || !graph[targetId]) {
    return null;
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialize graph distances
  for (const nodeId of Object.keys(graph)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest distance
    let currentId: string | null = null;
    let smallestDistance = Infinity;

    for (const nodeId of Array.from(unvisited)) {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || distances[currentId] === Infinity) {
      break; // No reachable nodes left
    }

    if (currentId === targetId) {
      break; // Destination reached
    }

    unvisited.delete(currentId);

    const currentNode = graph[currentId];
    for (const neighbor of currentNode.neighbors) {
      if (!unvisited.has(neighbor.nodeId)) continue;

      const alt = distances[currentId] + neighbor.weight;
      if (alt < distances[neighbor.nodeId]) {
        distances[neighbor.nodeId] = alt;
        previous[neighbor.nodeId] = currentId;
      }
    }
  }

  // Reconstruction of shortest path
  const pathNodeIds: string[] = [];
  let curr: string | null = targetId;

  while (curr !== null) {
    pathNodeIds.unshift(curr);
    curr = previous[curr];
  }

  // If path doesn't start at startId, target is unreachable
  if (pathNodeIds[0] !== startId) {
    return null;
  }

  // Construct waypoints & turn-by-turn text instructions
  const waypoints: Waypoint[] = [];
  const instructions: string[] = [];

  for (let i = 0; i < pathNodeIds.length; i++) {
    const node = graph[pathNodeIds[i]];
    waypoints.push({
      x: node.x,
      y: node.y,
      floor: node.floor,
      name: node.name,
    });

    if (i === 0) {
      instructions.push(`Start at ${node.name} (Floor ${node.floor})`);
    } else {
      const prevNode = graph[pathNodeIds[i - 1]];
      if (node.floor !== prevNode.floor) {
        instructions.push(
          `Take ${node.type === 'elevator' ? 'elevator' : 'stairs'} from Floor ${prevNode.floor} to Floor ${node.floor}`
        );
      } else {
        instructions.push(`Head toward ${node.name}`);
      }
    }
  }

  return {
    pathNodeIds,
    totalDistance: Math.round(distances[targetId]),
    waypoints,
    instructions,
  };
}

/**
 * Sample CCS Building Graph Data (Floors 1 to 4)
 */
export class SampleCCSGraph {
  public static getSampleGraph(): Record<string, Node> {
    return {
      // 1st Floor
      'F1_ENTRANCE': {
        id: 'F1_ENTRANCE',
        name: 'CCS Main Entrance',
        floor: 1,
        x: 100,
        y: 400,
        type: 'entrance',
        neighbors: [{ nodeId: 'F1_HALL_1', weight: 30 }],
      },
      'F1_HALL_1': {
        id: 'F1_HALL_1',
        name: 'Lobby Main Hallway',
        floor: 1,
        x: 250,
        y: 400,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F1_ENTRANCE', weight: 30 },
          { nodeId: 'F1_LAB1', weight: 40 },
          { nodeId: 'F1_STAIRS', weight: 50 },
        ],
      },
      'F1_LAB1': {
        id: 'F1_LAB1',
        name: 'CCS Mac Lab 101',
        floor: 1,
        x: 250,
        y: 200,
        type: 'room',
        neighbors: [{ nodeId: 'F1_HALL_1', weight: 40 }],
      },
      'F1_STAIRS': {
        id: 'F1_STAIRS',
        name: 'Central Staircase (Floor 1)',
        floor: 1,
        x: 450,
        y: 400,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F1_HALL_1', weight: 50 },
          { nodeId: 'F2_STAIRS', weight: 60 },
        ],
      },

      // 2nd Floor
      'F2_STAIRS': {
        id: 'F2_STAIRS',
        name: 'Central Staircase (Floor 2)',
        floor: 2,
        x: 450,
        y: 400,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F1_STAIRS', weight: 60 },
          { nodeId: 'F2_HALL_1', weight: 40 },
          { nodeId: 'F3_STAIRS', weight: 60 },
        ],
      },
      'F2_HALL_1': {
        id: 'F2_HALL_1',
        name: 'Floor 2 Main Corridor',
        floor: 2,
        x: 300,
        y: 400,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F2_STAIRS', weight: 40 },
          { nodeId: 'F2_ROOM201', weight: 35 },
          { nodeId: 'F2_ROOM202', weight: 45 },
        ],
      },
      'F2_ROOM201': {
        id: 'F2_ROOM201',
        name: 'Programming Lab 201',
        floor: 2,
        x: 300,
        y: 220,
        type: 'room',
        neighbors: [{ nodeId: 'F2_HALL_1', weight: 35 }],
      },
      'F2_ROOM202': {
        id: 'F2_ROOM202',
        name: 'Lecture Room 202',
        floor: 2,
        x: 150,
        y: 400,
        type: 'room',
        neighbors: [{ nodeId: 'F2_HALL_1', weight: 45 }],
      },

      // 3rd Floor
      'F3_STAIRS': {
        id: 'F3_STAIRS',
        name: 'Central Staircase (Floor 3)',
        floor: 3,
        x: 450,
        y: 400,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F2_STAIRS', weight: 60 },
          { nodeId: 'F3_HALL_1', weight: 30 },
          { nodeId: 'F4_STAIRS', weight: 60 },
        ],
      },
      'F3_HALL_1': {
        id: 'F3_HALL_1',
        name: 'Floor 3 Corridor',
        floor: 3,
        x: 350,
        y: 400,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F3_STAIRS', weight: 30 },
          { nodeId: 'F3_DEAN_OFFICE', weight: 50 },
        ],
      },
      'F3_DEAN_OFFICE': {
        id: 'F3_DEAN_OFFICE',
        name: 'CCS Dean’s Office',
        floor: 3,
        x: 350,
        y: 180,
        type: 'room',
        neighbors: [{ nodeId: 'F3_HALL_1', weight: 50 }],
      },

      // 4th Floor
      'F4_STAIRS': {
        id: 'F4_STAIRS',
        name: 'Central Staircase (Floor 4)',
        floor: 4,
        x: 450,
        y: 400,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F3_STAIRS', weight: 60 },
          { nodeId: 'F4_ROOM401', weight: 40 },
        ],
      },
      'F4_ROOM401': {
        id: 'F4_ROOM401',
        name: 'Multipurpose Audio Visual Hall 401',
        floor: 4,
        x: 200,
        y: 300,
        type: 'room',
        neighbors: [{ nodeId: 'F4_STAIRS', weight: 40 }],
      },
    };
  }
}
