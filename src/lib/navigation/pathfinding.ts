/**
 * ChronoNav Client-Side Pathfinding Engine
 * Implementation of Dijkstra's Algorithm for UC Main Campus (College of Computer Studies)
 */

export interface Neighbor {
  nodeId: string;
  weight: number; // Distance in meters / weight
}

export interface Node {
  id: string;
  name: string;
  floor: number;
  x: number;
  y: number;
  type?: 'room' | 'corridor' | 'stairs' | 'elevator' | 'entrance' | 'restroom' | 'facility';
  neighbors: Neighbor[];
}

export interface Waypoint {
  x: number;
  y: number;
  floor: number;
  name: string;
  nodeId?: string;
}

export interface PathfindingResult {
  pathNodeIds: string[];
  totalDistance: number;
  waypoints: Waypoint[];
  instructions: string[];
  floorsTraversed: number[];
}

/**
 * Finds the shortest path between startId and targetId using Dijkstra's algorithm.
 * Handles multi-floor navigation through stairs and elevators.
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

  // Initialize graph node distances
  for (const nodeId of Object.keys(graph)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Select unvisited node with minimum distance
    let currentId: string | null = null;
    let smallestDistance = Infinity;

    for (const nodeId of Array.from(unvisited)) {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || distances[currentId] === Infinity) {
      break; // Remaining nodes are unreachable
    }

    if (currentId === targetId) {
      break; // Reached destination target
    }

    unvisited.delete(currentId);

    const currentNode = graph[currentId];
    if (!currentNode || !currentNode.neighbors) continue;

    for (const neighbor of currentNode.neighbors) {
      if (!unvisited.has(neighbor.nodeId)) continue;

      const alt = distances[currentId] + neighbor.weight;
      if (alt < distances[neighbor.nodeId]) {
        distances[neighbor.nodeId] = alt;
        previous[neighbor.nodeId] = currentId;
      }
    }
  }

  // Reconstruct shortest path node array
  const pathNodeIds: string[] = [];
  let curr: string | null = targetId;

  while (curr !== null) {
    pathNodeIds.unshift(curr);
    curr = previous[curr];
  }

  // Verify that the path starts at startId
  if (pathNodeIds[0] !== startId) {
    return null; // No path exists between start and target
  }

  // Build waypoints, instructions, and track floors traversed
  const waypoints: Waypoint[] = [];
  const instructions: string[] = [];
  const floorsSet = new Set<number>();

  for (let i = 0; i < pathNodeIds.length; i++) {
    const node = graph[pathNodeIds[i]];
    floorsSet.add(node.floor);
    
    waypoints.push({
      x: node.x,
      y: node.y,
      floor: node.floor,
      name: node.name,
      nodeId: node.id,
    });

    const stepNum = i + 1;

    if (i === 0) {
      instructions.push(`Step ${stepNum}: Start at ${node.name} (Floor ${node.floor})`);
    } else {
      const prevNode = graph[pathNodeIds[i - 1]];
      if (node.floor !== prevNode.floor) {
        const transitionType = node.type === 'elevator' ? 'Elevator' : 'Staircase';
        instructions.push(
          `Step ${stepNum}: Take ${transitionType} from Floor ${prevNode.floor} to Floor ${node.floor}`
        );
      } else {
        if (i === pathNodeIds.length - 1) {
          instructions.push(`Step ${stepNum}: Arrive at destination - ${node.name}`);
        } else {
          instructions.push(`Step ${stepNum}: Walk toward ${node.name}`);
        }
      }
    }
  }

  return {
    pathNodeIds,
    totalDistance: Math.round(distances[targetId]),
    waypoints,
    instructions,
    floorsTraversed: Array.from(floorsSet).sort((a, b) => a - b),
  };
}

/**
 * University of Cebu Main Campus (CCS Building) Graph Network
 * Detailed multi-floor map representation (Floors 1 - 4)
 */
export class SampleCCSGraph {
  public static getSampleGraph(): Record<string, Node> {
    return {
      // ==========================================
      // FLOOR 1: Ground Floor / Entrance & Lobby
      // ==========================================
      'F1_ENTRANCE': {
        id: 'F1_ENTRANCE',
        name: 'Gate 1 CCS Main Entrance',
        floor: 1,
        x: 100,
        y: 450,
        type: 'entrance',
        neighbors: [
          { nodeId: 'F1_SECURITY', weight: 15 },
          { nodeId: 'F1_MAIN_HALLWAY_1', weight: 35 },
        ],
      },
      'F1_SECURITY': {
        id: 'F1_SECURITY',
        name: 'Campus Guard Desk',
        floor: 1,
        x: 120,
        y: 380,
        type: 'facility',
        neighbors: [
          { nodeId: 'F1_ENTRANCE', weight: 15 },
          { nodeId: 'F1_MAIN_HALLWAY_1', weight: 25 },
        ],
      },
      'F1_MAIN_HALLWAY_1': {
        id: 'F1_MAIN_HALLWAY_1',
        name: 'Ground Lobby Hallway',
        floor: 1,
        x: 220,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F1_ENTRANCE', weight: 35 },
          { nodeId: 'F1_SECURITY', weight: 25 },
          { nodeId: 'F1_MAC_LAB_101', weight: 30 },
          { nodeId: 'F1_CANTEEN', weight: 45 },
          { nodeId: 'F1_MAIN_HALLWAY_2', weight: 40 },
        ],
      },
      'F1_MAC_LAB_101': {
        id: 'F1_MAC_LAB_101',
        name: 'CCS Mac Laboratory 101',
        floor: 1,
        x: 220,
        y: 260,
        type: 'room',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_1', weight: 30 },
        ],
      },
      'F1_CANTEEN': {
        id: 'F1_CANTEEN',
        name: 'CCS Canteen & Refreshment Center',
        floor: 1,
        x: 100,
        y: 200,
        type: 'facility',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_1', weight: 45 },
        ],
      },
      'F1_MAIN_HALLWAY_2': {
        id: 'F1_MAIN_HALLWAY_2',
        name: 'East Lobby Junction',
        floor: 1,
        x: 380,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_1', weight: 40 },
          { nodeId: 'F1_STUDENT_AFFAIRS', weight: 30 },
          { nodeId: 'F1_RESTROOM', weight: 25 },
          { nodeId: 'F1_STAIRS', weight: 35 },
          { nodeId: 'F1_ELEVATOR', weight: 30 },
        ],
      },
      'F1_STUDENT_AFFAIRS': {
        id: 'F1_STUDENT_AFFAIRS',
        name: 'Student Affairs & Helpdesk',
        floor: 1,
        x: 380,
        y: 260,
        type: 'room',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_2', weight: 30 },
        ],
      },
      'F1_RESTROOM': {
        id: 'F1_RESTROOM',
        name: 'Ground Floor Restrooms',
        floor: 1,
        x: 480,
        y: 500,
        type: 'restroom',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_2', weight: 25 },
        ],
      },
      'F1_STAIRS': {
        id: 'F1_STAIRS',
        name: 'Central Staircase (Floor 1)',
        floor: 1,
        x: 480,
        y: 380,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_2', weight: 35 },
          { nodeId: 'F2_STAIRS', weight: 50 }, // Multi-floor stair link
        ],
      },
      'F1_ELEVATOR': {
        id: 'F1_ELEVATOR',
        name: 'CCS Main Elevator (Floor 1)',
        floor: 1,
        x: 520,
        y: 450,
        type: 'elevator',
        neighbors: [
          { nodeId: 'F1_MAIN_HALLWAY_2', weight: 30 },
          { nodeId: 'F2_ELEVATOR', weight: 20 }, // Multi-floor elevator link
          { nodeId: 'F3_ELEVATOR', weight: 40 },
          { nodeId: 'F4_ELEVATOR', weight: 60 },
        ],
      },

      // ==========================================
      // FLOOR 2: Computer Labs & Lecture Rooms
      // ==========================================
      'F2_STAIRS': {
        id: 'F2_STAIRS',
        name: 'Central Staircase (Floor 2)',
        floor: 2,
        x: 480,
        y: 380,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F1_STAIRS', weight: 50 },
          { nodeId: 'F2_HALLWAY_1', weight: 35 },
          { nodeId: 'F3_STAIRS', weight: 50 },
        ],
      },
      'F2_ELEVATOR': {
        id: 'F2_ELEVATOR',
        name: 'CCS Main Elevator (Floor 2)',
        floor: 2,
        x: 520,
        y: 450,
        type: 'elevator',
        neighbors: [
          { nodeId: 'F1_ELEVATOR', weight: 20 },
          { nodeId: 'F2_HALLWAY_1', weight: 30 },
          { nodeId: 'F3_ELEVATOR', weight: 20 },
          { nodeId: 'F4_ELEVATOR', weight: 40 },
        ],
      },
      'F2_HALLWAY_1': {
        id: 'F2_HALLWAY_1',
        name: 'Floor 2 Main Corridor',
        floor: 2,
        x: 350,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F2_STAIRS', weight: 35 },
          { nodeId: 'F2_ELEVATOR', weight: 30 },
          { nodeId: 'F2_PROG_LAB_201', weight: 40 },
          { nodeId: 'F2_HALLWAY_2', weight: 45 },
          { nodeId: 'F2_FACULTY_ROOM', weight: 35 },
        ],
      },
      'F2_PROG_LAB_201': {
        id: 'F2_PROG_LAB_201',
        name: 'Programming Lab 201',
        floor: 2,
        x: 350,
        y: 260,
        type: 'room',
        neighbors: [
          { nodeId: 'F2_HALLWAY_1', weight: 40 },
        ],
      },
      'F2_FACULTY_ROOM': {
        id: 'F2_FACULTY_ROOM',
        name: 'CCS Faculty Room 205',
        floor: 2,
        x: 480,
        y: 260,
        type: 'room',
        neighbors: [
          { nodeId: 'F2_HALLWAY_1', weight: 35 },
        ],
      },
      'F2_HALLWAY_2': {
        id: 'F2_HALLWAY_2',
        name: 'West Wing Corridor 2F',
        floor: 2,
        x: 180,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F2_HALLWAY_1', weight: 45 },
          { nodeId: 'F2_LECTURE_202', weight: 35 },
          { nodeId: 'F2_SYSTEMS_LAB_203', weight: 40 },
          { nodeId: 'F2_RESTROOM', weight: 25 },
        ],
      },
      'F2_LECTURE_202': {
        id: 'F2_LECTURE_202',
        name: 'Lecture Room 202',
        floor: 2,
        x: 180,
        y: 300,
        type: 'room',
        neighbors: [
          { nodeId: 'F2_HALLWAY_2', weight: 35 },
        ],
      },
      'F2_SYSTEMS_LAB_203': {
        id: 'F2_SYSTEMS_LAB_203',
        name: 'Systems Analysis Lab 203',
        floor: 2,
        x: 100,
        y: 450,
        type: 'room',
        neighbors: [
          { nodeId: 'F2_HALLWAY_2', weight: 40 },
        ],
      },
      'F2_RESTROOM': {
        id: 'F2_RESTROOM',
        name: 'Floor 2 Restrooms',
        floor: 2,
        x: 180,
        y: 530,
        type: 'restroom',
        neighbors: [
          { nodeId: 'F2_HALLWAY_2', weight: 25 },
        ],
      },

      // ==========================================
      // FLOOR 3: Executive Offices & Specialized Labs
      // ==========================================
      'F3_STAIRS': {
        id: 'F3_STAIRS',
        name: 'Central Staircase (Floor 3)',
        floor: 3,
        x: 480,
        y: 380,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F2_STAIRS', weight: 50 },
          { nodeId: 'F3_HALLWAY_1', weight: 35 },
          { nodeId: 'F4_STAIRS', weight: 50 },
        ],
      },
      'F3_ELEVATOR': {
        id: 'F3_ELEVATOR',
        name: 'CCS Main Elevator (Floor 3)',
        floor: 3,
        x: 520,
        y: 450,
        type: 'elevator',
        neighbors: [
          { nodeId: 'F1_ELEVATOR', weight: 40 },
          { nodeId: 'F2_ELEVATOR', weight: 20 },
          { nodeId: 'F3_HALLWAY_1', weight: 30 },
          { nodeId: 'F4_ELEVATOR', weight: 20 },
        ],
      },
      'F3_HALLWAY_1': {
        id: 'F3_HALLWAY_1',
        name: 'Floor 3 Executive Corridor',
        floor: 3,
        x: 350,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F3_STAIRS', weight: 35 },
          { nodeId: 'F3_ELEVATOR', weight: 30 },
          { nodeId: 'F3_DEAN_OFFICE', weight: 45 },
          { nodeId: 'F3_HALLWAY_2', weight: 40 },
          { nodeId: 'F3_RESEARCH_LAB_303', weight: 35 },
        ],
      },
      'F3_DEAN_OFFICE': {
        id: 'F3_DEAN_OFFICE',
        name: 'CCS Dean’s Office Suite',
        floor: 3,
        x: 350,
        y: 200,
        type: 'room',
        neighbors: [
          { nodeId: 'F3_HALLWAY_1', weight: 45 },
        ],
      },
      'F3_RESEARCH_LAB_303': {
        id: 'F3_RESEARCH_LAB_303',
        name: 'Computer Research Lab 303',
        floor: 3,
        x: 480,
        y: 220,
        type: 'room',
        neighbors: [
          { nodeId: 'F3_HALLWAY_1', weight: 35 },
        ],
      },
      'F3_HALLWAY_2': {
        id: 'F3_HALLWAY_2',
        name: 'West Wing Corridor 3F',
        floor: 3,
        x: 180,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F3_HALLWAY_1', weight: 40 },
          { nodeId: 'F3_NETWORK_LAB_301', weight: 35 },
          { nodeId: 'F3_SOFT_ENG_LAB_302', weight: 40 },
          { nodeId: 'F3_RESTROOM', weight: 25 },
        ],
      },
      'F3_NETWORK_LAB_301': {
        id: 'F3_NETWORK_LAB_301',
        name: 'Cisco Networking Lab 301',
        floor: 3,
        x: 180,
        y: 280,
        type: 'room',
        neighbors: [
          { nodeId: 'F3_HALLWAY_2', weight: 35 },
        ],
      },
      'F3_SOFT_ENG_LAB_302': {
        id: 'F3_SOFT_ENG_LAB_302',
        name: 'Software Engineering Lab 302',
        floor: 3,
        x: 90,
        y: 450,
        type: 'room',
        neighbors: [
          { nodeId: 'F3_HALLWAY_2', weight: 40 },
        ],
      },
      'F3_RESTROOM': {
        id: 'F3_RESTROOM',
        name: 'Floor 3 Restrooms',
        floor: 3,
        x: 180,
        y: 530,
        type: 'restroom',
        neighbors: [
          { nodeId: 'F3_HALLWAY_2', weight: 25 },
        ],
      },

      // ==========================================
      // FLOOR 4: Audio Visual Hall & Advanced Labs
      // ==========================================
      'F4_STAIRS': {
        id: 'F4_STAIRS',
        name: 'Central Staircase (Floor 4)',
        floor: 4,
        x: 480,
        y: 380,
        type: 'stairs',
        neighbors: [
          { nodeId: 'F3_STAIRS', weight: 50 },
          { nodeId: 'F4_HALLWAY_1', weight: 35 },
        ],
      },
      'F4_ELEVATOR': {
        id: 'F4_ELEVATOR',
        name: 'CCS Main Elevator (Floor 4)',
        floor: 4,
        x: 520,
        y: 450,
        type: 'elevator',
        neighbors: [
          { nodeId: 'F1_ELEVATOR', weight: 60 },
          { nodeId: 'F2_ELEVATOR', weight: 40 },
          { nodeId: 'F3_ELEVATOR', weight: 20 },
          { nodeId: 'F4_HALLWAY_1', weight: 30 },
        ],
      },
      'F4_HALLWAY_1': {
        id: 'F4_HALLWAY_1',
        name: 'Floor 4 Grand Hallway',
        floor: 4,
        x: 350,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F4_STAIRS', weight: 35 },
          { nodeId: 'F4_ELEVATOR', weight: 30 },
          { nodeId: 'F4_AV_HALL_401', weight: 45 },
          { nodeId: 'F4_HALLWAY_2', weight: 40 },
          { nodeId: 'F4_STUDENT_LOUNGE', weight: 35 },
        ],
      },
      'F4_AV_HALL_401': {
        id: 'F4_AV_HALL_401',
        name: 'CCS Multipurpose AV Hall 401',
        floor: 4,
        x: 350,
        y: 220,
        type: 'room',
        neighbors: [
          { nodeId: 'F4_HALLWAY_1', weight: 45 },
        ],
      },
      'F4_STUDENT_LOUNGE': {
        id: 'F4_STUDENT_LOUNGE',
        name: 'Senior Student Innovation Lounge',
        floor: 4,
        x: 480,
        y: 240,
        type: 'facility',
        neighbors: [
          { nodeId: 'F4_HALLWAY_1', weight: 35 },
        ],
      },
      'F4_HALLWAY_2': {
        id: 'F4_HALLWAY_2',
        name: 'West Wing Corridor 4F',
        floor: 4,
        x: 180,
        y: 450,
        type: 'corridor',
        neighbors: [
          { nodeId: 'F4_HALLWAY_1', weight: 40 },
          { nodeId: 'F4_AI_LAB_402', weight: 35 },
          { nodeId: 'F4_CYBERSEC_LAB_403', weight: 40 },
          { nodeId: 'F4_RESTROOM', weight: 25 },
        ],
      },
      'F4_AI_LAB_402': {
        id: 'F4_AI_LAB_402',
        name: 'AI & Data Science Lab 402',
        floor: 4,
        x: 180,
        y: 280,
        type: 'room',
        neighbors: [
          { nodeId: 'F4_HALLWAY_2', weight: 35 },
        ],
      },
      'F4_CYBERSEC_LAB_403': {
        id: 'F4_CYBERSEC_LAB_403',
        name: 'Cybersecurity Lab 403',
        floor: 4,
        x: 90,
        y: 450,
        type: 'room',
        neighbors: [
          { nodeId: 'F4_HALLWAY_2', weight: 40 },
        ],
      },
      'F4_RESTROOM': {
        id: 'F4_RESTROOM',
        name: 'Floor 4 Restrooms',
        floor: 4,
        x: 180,
        y: 530,
        type: 'restroom',
        neighbors: [
          { nodeId: 'F4_HALLWAY_2', weight: 25 },
        ],
      },
    };
  }
}

