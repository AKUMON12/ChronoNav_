/**
 * ChronoNav Client-Side Pathfinding Engine
 * Implementation of Dijkstra's Algorithm for UC Main Campus
 * Calibrated against the official architectural SVG blueprints (viewBox: 0 0 1191 842).
 * Supports complete multi-floor spatial navigation covering all 8 levels:
 * Ground (1), Mezzanine (M), 2nd, 3rd, 4th, 5th, 6th, and 7th Floor / Roof Deck.
 */

export type FloorLevel = 1 | "M" | 2 | 3 | 4 | 5 | 6 | 7;

export interface Neighbor {
  nodeId: string;
  weight: number; // Distance in meters / edge weight
}

export interface Node {
  id: string;
  name: string;
  floor: FloorLevel;
  building?: "DON_MANUEL" | "CTS" | "HIGHSCHOOL" | "MAIN";
  x: number; // SVG viewBox coordinate X (0 to 1191)
  y: number; // SVG viewBox coordinate Y (0 to 842)
  type?: "room" | "corridor" | "stairs" | "elevator" | "entrance" | "restroom" | "facility";
  neighbors: Neighbor[];
  description?: string;
  category?: "classroom" | "lab" | "office" | "facility" | "amenity";
}

export interface Waypoint {
  x: number;
  y: number;
  floor: FloorLevel;
  name: string;
  nodeId?: string;
}

export interface PathfindingResult {
  pathNodeIds: string[];
  totalDistance: number;
  waypoints: Waypoint[];
  instructions: string[];
  floorsTraversed: FloorLevel[];
}

/** Ordered sequence of campus floors for floor index comparison */
export const FLOOR_ORDER: FloorLevel[] = [1, "M", 2, 3, 4, 5, 6, 7];

export function getFloorIndex(floor: FloorLevel): number {
  const idx = FLOOR_ORDER.indexOf(floor);
  return idx === -1 ? 0 : idx;
}

/**
 * Finds the shortest path between startId and targetId using Dijkstra's algorithm.
 * Follows physical corridor spines, doorway anchors, stairs, and elevators.
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
  const floorsSet = new Set<FloorLevel>();

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
    const floorLabel = node.floor === "M" ? "Mezzanine" : `Floor ${node.floor}`;

    if (i === 0) {
      instructions.push(`Step ${stepNum}: Start at ${node.name} (${floorLabel})`);
    } else {
      const prevNode = graph[pathNodeIds[i - 1]];
      if (node.floor !== prevNode.floor) {
        const prevFloorLabel = prevNode.floor === "M" ? "Mezzanine" : `Floor ${prevNode.floor}`;
        const minIdx = Math.min(getFloorIndex(prevNode.floor), getFloorIndex(node.floor));
        const maxIdx = Math.max(getFloorIndex(prevNode.floor), getFloorIndex(node.floor));
        for (let fi = minIdx; fi <= maxIdx; fi++) {
          floorsSet.add(FLOOR_ORDER[fi]);
        }
        const transitionType = node.type === "elevator" ? "Elevator" : "Central Staircase";
        instructions.push(
          `Step ${stepNum}: Take ${transitionType} from ${prevFloorLabel} to ${floorLabel}`
        );
      } else {
        if (i === pathNodeIds.length - 1) {
          instructions.push(`Step ${stepNum}: Arrive at destination — ${node.name} (${floorLabel})`);
        } else if (node.type === "corridor") {
          instructions.push(`Step ${stepNum}: Proceed along ${node.name}`);
        } else {
          instructions.push(`Step ${stepNum}: Pass by ${node.name}`);
        }
      }
    }
  }

  // Sort floors according to campus building sequence
  const sortedFloors = Array.from(floorsSet).sort(
    (a, b) => getFloorIndex(a) - getFloorIndex(b)
  );

  return {
    pathNodeIds,
    totalDistance: Math.round(distances[targetId]),
    waypoints,
    instructions,
    floorsTraversed: sortedFloors,
  };
}

/**
 * University of Cebu Main Campus Graph Network
 * Calibrated against SVG Floorplan geometries (1191 x 842)
 * All rooms connect through physical corridor spines to prevent walking through walls.
 */
export class SampleCCSGraph {
  public static getSampleGraph(): Record<string, Node> {
    return {
      // =========================================================================
      // FLOOR 1: Ground Floor (Gates 1-4, Administration, Clinic, Activity Center)
      // =========================================================================
      F1_GATE1: {
        id: "F1_GATE1",
        name: "Gate 1 Main Ingress / Exit",
        floor: 1,
        building: "MAIN",
        x: 445,
        y: 71,
        type: "entrance",
        category: "facility",
        description: "Primary entrance on Sanciangko St. with security turnstiles.",
        neighbors: [{ nodeId: "F1_CORRIDOR_MAIN_1", weight: 20 }],
      },
      F1_GATE2: {
        id: "F1_GATE2",
        name: "Gate 2 Ingress / Exit",
        floor: 1,
        building: "DON_MANUEL",
        x: 654,
        y: 102,
        type: "entrance",
        category: "facility",
        description: "Secondary entrance leading to accounting and cashier.",
        neighbors: [{ nodeId: "F1_CORRIDOR_MAIN_2", weight: 20 }],
      },
      F1_GATE3: {
        id: "F1_GATE3",
        name: "Gate 3 Ingress / Exit",
        floor: 1,
        building: "CTS",
        x: 1106,
        y: 506,
        type: "entrance",
        category: "facility",
        description: "East wing entrance near the medical clinic.",
        neighbors: [{ nodeId: "F1_CORRIDOR_EAST_1", weight: 25 }],
      },
      F1_GATE4: {
        id: "F1_GATE4",
        name: "Gate 4 Activity Center Ingress",
        floor: 1,
        building: "HIGHSCHOOL",
        x: 484,
        y: 695,
        type: "entrance",
        category: "facility",
        description: "High school campus entrance and gymnasium access.",
        neighbors: [{ nodeId: "F1_CORRIDOR_HS_GYM", weight: 20 }],
      },

      // Floor 1 Hallway Spines (Walkway Backbone)
      F1_CORRIDOR_MAIN_1: {
        id: "F1_CORRIDOR_MAIN_1",
        name: "Ground Floor Main Lobby Corridor",
        floor: 1,
        building: "MAIN",
        x: 445,
        y: 200,
        type: "corridor",
        category: "facility",
        description: "Central corridor connecting Gate 1, Elevator, and Central Stairs.",
        neighbors: [
          { nodeId: "F1_GATE1", weight: 20 },
          { nodeId: "F1_ELEVATOR", weight: 25 },
          { nodeId: "F1_STAIRS", weight: 20 },
          { nodeId: "F1_CORRIDOR_MAIN_2", weight: 30 },
          { nodeId: "F1_CORRIDOR_WEST_1", weight: 30 },
          { nodeId: "F1_STUDY_HALL", weight: 25 },
        ],
      },
      F1_CORRIDOR_MAIN_2: {
        id: "F1_CORRIDOR_MAIN_2",
        name: "Administration & Cashier Corridor",
        floor: 1,
        building: "DON_MANUEL",
        x: 654,
        y: 220,
        type: "corridor",
        category: "facility",
        description: "Corridor accessing Cashier, Accounting, and Gate 2.",
        neighbors: [
          { nodeId: "F1_GATE2", weight: 20 },
          { nodeId: "F1_CORRIDOR_MAIN_1", weight: 30 },
          { nodeId: "F1_CASHIER", weight: 20 },
          { nodeId: "F1_ACCOUNTING", weight: 25 },
          { nodeId: "F1_CORRIDOR_EAST_1", weight: 45 },
        ],
      },
      F1_CORRIDOR_WEST_1: {
        id: "F1_CORRIDOR_WEST_1",
        name: "West Wing Ground Corridor",
        floor: 1,
        building: "MAIN",
        x: 213,
        y: 400,
        type: "corridor",
        category: "facility",
        description: "West hallway leading to Mac Lab, Carpentry, and Clinic.",
        neighbors: [
          { nodeId: "F1_CORRIDOR_MAIN_1", weight: 30 },
          { nodeId: "F1_MAC_LAB_101", weight: 25 },
          { nodeId: "F1_CARPENTRY", weight: 25 },
          { nodeId: "F1_CLINIC", weight: 30 },
          { nodeId: "F1_CANTEEN", weight: 35 },
        ],
      },
      F1_CORRIDOR_EAST_1: {
        id: "F1_CORRIDOR_EAST_1",
        name: "East Wing Activity Corridor",
        floor: 1,
        building: "CTS",
        x: 820,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "East hallway accessing High School Gym and Gate 3.",
        neighbors: [
          { nodeId: "F1_CORRIDOR_MAIN_2", weight: 45 },
          { nodeId: "F1_GATE3", weight: 25 },
          { nodeId: "F1_HS_ACTIVITY_CENTER", weight: 30 },
          { nodeId: "F1_CORRIDOR_HS_GYM", weight: 35 },
        ],
      },
      F1_CORRIDOR_HS_GYM: {
        id: "F1_CORRIDOR_HS_GYM",
        name: "High School Gym Ingress Spine",
        floor: 1,
        building: "HIGHSCHOOL",
        x: 565,
        y: 600,
        type: "corridor",
        category: "facility",
        description: "Hallway into High School Activity Center.",
        neighbors: [
          { nodeId: "F1_GATE4", weight: 20 },
          { nodeId: "F1_HS_ACTIVITY_CENTER", weight: 25 },
          { nodeId: "F1_CORRIDOR_EAST_1", weight: 35 },
        ],
      },

      // Floor 1 Rooms & Facilities (Calibrated to SVG Labels)
      F1_CLINIC: {
        id: "F1_CLINIC",
        name: "Medical & Dental Clinic",
        floor: 1,
        building: "MAIN",
        x: 198,
        y: 673,
        type: "room",
        category: "facility",
        description: "Campus health clinic, physician consultation, and dental suite.",
        neighbors: [{ nodeId: "F1_CORRIDOR_WEST_1", weight: 30 }],
      },
      F1_CARPENTRY: {
        id: "F1_CARPENTRY",
        name: "Carpentry & Electronics Section",
        floor: 1,
        building: "MAIN",
        x: 198,
        y: 464,
        type: "room",
        category: "facility",
        description: "Maintenance, electrical repair, and engineering workshops.",
        neighbors: [{ nodeId: "F1_CORRIDOR_WEST_1", weight: 25 }],
      },
      F1_MAC_LAB_101: {
        id: "F1_MAC_LAB_101",
        name: "CCS Mac Laboratory 101",
        floor: 1,
        building: "MAIN",
        x: 230,
        y: 350,
        type: "room",
        category: "lab",
        description: "Apple Macintosh workstation laboratory for iOS and multimedia development.",
        neighbors: [{ nodeId: "F1_CORRIDOR_WEST_1", weight: 25 }],
      },
      F1_CANTEEN: {
        id: "F1_CANTEEN",
        name: "Ground Floor Canteen",
        floor: 1,
        building: "MAIN",
        x: 140,
        y: 260,
        type: "facility",
        category: "amenity",
        description: "Campus cafeteria and snack area.",
        neighbors: [{ nodeId: "F1_CORRIDOR_WEST_1", weight: 35 }],
      },
      F1_CASHIER: {
        id: "F1_CASHIER",
        name: "University Cashier & Assessment",
        floor: 1,
        building: "MAIN",
        x: 438,
        y: 531,
        type: "room",
        category: "office",
        description: "Tuition payment counters and assessment.",
        neighbors: [{ nodeId: "F1_CORRIDOR_MAIN_2", weight: 20 }],
      },
      F1_ACCOUNTING: {
        id: "F1_ACCOUNTING",
        name: "Accounting & Student Accounts",
        floor: 1,
        building: "DON_MANUEL",
        x: 650,
        y: 450,
        type: "room",
        category: "office",
        description: "Student accounting and financial releases.",
        neighbors: [{ nodeId: "F1_CORRIDOR_MAIN_2", weight: 25 }],
      },
      F1_STUDY_HALL: {
        id: "F1_STUDY_HALL",
        name: "Ground Study Hall & EDP",
        floor: 1,
        building: "MAIN",
        x: 425,
        y: 433,
        type: "room",
        category: "facility",
        description: "Student open study area and data processing center.",
        neighbors: [{ nodeId: "F1_CORRIDOR_MAIN_1", weight: 25 }],
      },
      F1_HS_ACTIVITY_CENTER: {
        id: "F1_HS_ACTIVITY_CENTER",
        name: "High School Activity Center",
        floor: 1,
        building: "HIGHSCHOOL",
        x: 565,
        y: 451,
        type: "facility",
        category: "facility",
        description: "Multipurpose covered gymnasium and event arena.",
        neighbors: [
          { nodeId: "F1_CORRIDOR_EAST_1", weight: 30 },
          { nodeId: "F1_CORRIDOR_HS_GYM", weight: 25 },
        ],
      },

      // Floor 1 Vertical Connectors
      F1_ELEVATOR: {
        id: "F1_ELEVATOR",
        name: "Main Elevator Bank (Floor 1)",
        floor: 1,
        building: "MAIN",
        x: 213,
        y: 285,
        type: "elevator",
        category: "facility",
        description: "Main passenger elevator bank serving all 8 campus floors.",
        neighbors: [
          { nodeId: "F1_CORRIDOR_MAIN_1", weight: 25 },
          { nodeId: "FM_ELEVATOR", weight: 15 },
          { nodeId: "F2_ELEVATOR", weight: 25 },
          { nodeId: "F3_ELEVATOR", weight: 35 },
          { nodeId: "F4_ELEVATOR", weight: 45 },
          { nodeId: "F5_ELEVATOR", weight: 55 },
          { nodeId: "F6_ELEVATOR", weight: 65 },
          { nodeId: "F7_ELEVATOR", weight: 75 },
        ],
      },
      F1_STAIRS: {
        id: "F1_STAIRS",
        name: "Central Staircase (Floor 1)",
        floor: 1,
        building: "MAIN",
        x: 198,
        y: 293,
        type: "stairs",
        category: "facility",
        description: "Central concrete staircase connecting Ground Floor to Mezzanine.",
        neighbors: [
          { nodeId: "F1_CORRIDOR_MAIN_1", weight: 20 },
          { nodeId: "FM_STAIRS", weight: 30 },
        ],
      },

      // =========================================================================
      // MEZZANINE FLOOR (MF): Education, Chapel, Graduate School, Computer Labs
      // =========================================================================
      FM_ELEVATOR: {
        id: "FM_ELEVATOR",
        name: "Main Elevator Bank (Mezzanine)",
        floor: "M",
        building: "MAIN",
        x: 227,
        y: 328,
        type: "elevator",
        category: "facility",
        description: "Elevator access point on Mezzanine level.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 15 },
          { nodeId: "FM_CORRIDOR_1", weight: 20 },
          { nodeId: "F2_ELEVATOR", weight: 15 },
          { nodeId: "F3_ELEVATOR", weight: 25 },
          { nodeId: "F4_ELEVATOR", weight: 35 },
          { nodeId: "F5_ELEVATOR", weight: 45 },
          { nodeId: "F6_ELEVATOR", weight: 55 },
          { nodeId: "F7_ELEVATOR", weight: 65 },
        ],
      },
      FM_STAIRS: {
        id: "FM_STAIRS",
        name: "Central Staircase (Mezzanine)",
        floor: "M",
        building: "MAIN",
        x: 220,
        y: 320,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on Mezzanine level.",
        neighbors: [
          { nodeId: "F1_STAIRS", weight: 30 },
          { nodeId: "FM_CORRIDOR_1", weight: 20 },
          { nodeId: "F2_STAIRS", weight: 30 },
        ],
      },
      FM_CORRIDOR_1: {
        id: "FM_CORRIDOR_1",
        name: "Mezzanine Central Corridor",
        floor: "M",
        building: "MAIN",
        x: 336,
        y: 425,
        type: "corridor",
        category: "facility",
        description: "Central corridor on Mezzanine.",
        neighbors: [
          { nodeId: "FM_STAIRS", weight: 20 },
          { nodeId: "FM_ELEVATOR", weight: 20 },
          { nodeId: "FM_CORRIDOR_2", weight: 25 },
          { nodeId: "FM_CTE_DEAN", weight: 25 },
          { nodeId: "FM_M27_M29", weight: 30 },
        ],
      },
      FM_CORRIDOR_2: {
        id: "FM_CORRIDOR_2",
        name: "Mezzanine East Labs Corridor",
        floor: "M",
        building: "DON_MANUEL",
        x: 419,
        y: 329,
        type: "corridor",
        category: "facility",
        description: "Access corridor for Computer Labs and Graduate School.",
        neighbors: [
          { nodeId: "FM_CORRIDOR_1", weight: 25 },
          { nodeId: "FM_COMP_LAB_3", weight: 25 },
          { nodeId: "FM_M18", weight: 30 },
          { nodeId: "FM_GRAD_SCHOOL_LIB", weight: 35 },
          { nodeId: "FM_CHAPEL", weight: 45 },
        ],
      },
      FM_CTE_DEAN: {
        id: "FM_CTE_DEAN",
        name: "Dean's Office (Teacher Education - CTE)",
        floor: "M",
        building: "MAIN",
        x: 390,
        y: 612,
        type: "room",
        category: "office",
        description: "Office of the Dean, College of Teacher Education.",
        neighbors: [{ nodeId: "FM_CORRIDOR_1", weight: 25 }],
      },
      FM_M27_M29: {
        id: "FM_M27_M29",
        name: "Classrooms M27, M28, M29",
        floor: "M",
        building: "MAIN",
        x: 263,
        y: 440,
        type: "room",
        category: "classroom",
        description: "Teacher Education lecture rooms M27, M27A, M28, M29.",
        neighbors: [{ nodeId: "FM_CORRIDOR_1", weight: 30 }],
      },
      FM_COMP_LAB_3: {
        id: "FM_COMP_LAB_3",
        name: "Computer Lab 3 & High School Lab",
        floor: "M",
        building: "DON_MANUEL",
        x: 487,
        y: 240,
        type: "room",
        category: "lab",
        description: "Computer laboratory 3 for high school and teacher education.",
        neighbors: [{ nodeId: "FM_CORRIDOR_2", weight: 25 }],
      },
      FM_M18: {
        id: "FM_M18",
        name: "Room M18 & Stock Room",
        floor: "M",
        building: "DON_MANUEL",
        x: 462,
        y: 661,
        type: "room",
        category: "classroom",
        description: "Classroom M18 and department stockroom.",
        neighbors: [{ nodeId: "FM_CORRIDOR_2", weight: 30 }],
      },
      FM_GRAD_SCHOOL_LIB: {
        id: "FM_GRAD_SCHOOL_LIB",
        name: "Graduate School Library & GSR 1-4",
        floor: "M",
        building: "CTS",
        x: 650,
        y: 440,
        type: "room",
        category: "facility",
        description: "Graduate school reference center and seminar rooms.",
        neighbors: [{ nodeId: "FM_CORRIDOR_2", weight: 35 }],
      },
      FM_CHAPEL: {
        id: "FM_CHAPEL",
        name: "University Chapel & Campus Ministry",
        floor: "M",
        building: "CTS",
        x: 840,
        y: 440,
        type: "facility",
        category: "amenity",
        description: "University chapel for prayer, masses, and worship.",
        neighbors: [{ nodeId: "FM_CORRIDOR_2", weight: 45 }],
      },

      // =========================================================================
      // FLOOR 2: Allied Engineering, Arts & Sciences, Main Library, Chancellor
      // =========================================================================
      F2_ELEVATOR: {
        id: "F2_ELEVATOR",
        name: "Main Elevator Bank (Floor 2)",
        floor: 2,
        building: "MAIN",
        x: 268,
        y: 278,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 2nd Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 25 },
          { nodeId: "FM_ELEVATOR", weight: 15 },
          { nodeId: "F2_CORRIDOR_1", weight: 20 },
          { nodeId: "F3_ELEVATOR", weight: 15 },
          { nodeId: "F4_ELEVATOR", weight: 25 },
          { nodeId: "F5_ELEVATOR", weight: 35 },
          { nodeId: "F6_ELEVATOR", weight: 45 },
          { nodeId: "F7_ELEVATOR", weight: 55 },
        ],
      },
      F2_STAIRS: {
        id: "F2_STAIRS",
        name: "Central Staircase (Floor 2)",
        floor: 2,
        building: "MAIN",
        x: 260,
        y: 263,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 2nd Floor.",
        neighbors: [
          { nodeId: "FM_STAIRS", weight: 30 },
          { nodeId: "F2_CORRIDOR_1", weight: 20 },
          { nodeId: "F3_STAIRS", weight: 30 },
        ],
      },
      F2_CORRIDOR_1: {
        id: "F2_CORRIDOR_1",
        name: "Floor 2 Central Corridor",
        floor: 2,
        building: "MAIN",
        x: 383,
        y: 421,
        type: "corridor",
        category: "facility",
        description: "Central hallway outside Psychology Lab and Engineering Dean.",
        neighbors: [
          { nodeId: "F2_STAIRS", weight: 20 },
          { nodeId: "F2_ELEVATOR", weight: 20 },
          { nodeId: "F2_CORRIDOR_2", weight: 25 },
          { nodeId: "F2_PSYCHOLOGY_LAB", weight: 25 },
          { nodeId: "F2_ROOM_218_219", weight: 30 },
          { nodeId: "F2_PROG_LAB_201", weight: 30 },
        ],
      },
      F2_CORRIDOR_2: {
        id: "F2_CORRIDOR_2",
        name: "Floor 2 Library & Executive Corridor",
        floor: 2,
        building: "DON_MANUEL",
        x: 483,
        y: 240,
        type: "corridor",
        category: "facility",
        description: "Hallway leading to Main Library and Chancellor suite.",
        neighbors: [
          { nodeId: "F2_CORRIDOR_1", weight: 25 },
          { nodeId: "F2_MAIN_LIB", weight: 35 },
          { nodeId: "F2_CHANCELLOR_OFFICE", weight: 25 },
          { nodeId: "F2_ALLIED_ENG_DEAN", weight: 25 },
        ],
      },
      F2_PSYCHOLOGY_LAB: {
        id: "F2_PSYCHOLOGY_LAB",
        name: "Psychology & Testing Laboratory",
        floor: 2,
        building: "MAIN",
        x: 498,
        y: 440,
        type: "room",
        category: "lab",
        description: "Psychological testing and behavioral analysis suites.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 25 }],
      },
      F2_ROOM_218_219: {
        id: "F2_ROOM_218_219",
        name: "Classrooms 217, 218, 219",
        floor: 2,
        building: "MAIN",
        x: 514,
        y: 672,
        type: "room",
        category: "classroom",
        description: "General education and engineering lecture halls.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 30 }],
      },
      F2_PROG_LAB_201: {
        id: "F2_PROG_LAB_201",
        name: "Programming Lab 201 (CL2)",
        floor: 2,
        building: "MAIN",
        x: 310,
        y: 485,
        type: "room",
        category: "lab",
        description: "Programming laboratory for Java, Python, and C++ courses.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 30 }],
      },
      F2_MAIN_LIB: {
        id: "F2_MAIN_LIB",
        name: "University Main Library (Floor 2)",
        floor: 2,
        building: "DON_MANUEL",
        x: 750,
        y: 420,
        type: "facility",
        category: "facility",
        description: "Main university book collection, research journals, and reading desks.",
        neighbors: [{ nodeId: "F2_CORRIDOR_2", weight: 35 }],
      },
      F2_CHANCELLOR_OFFICE: {
        id: "F2_CHANCELLOR_OFFICE",
        name: "Chancellor's Executive Suite",
        floor: 2,
        building: "MAIN",
        x: 491,
        y: 66,
        type: "room",
        category: "office",
        description: "Offices of the Chancellor, Vice Chancellor, and University Legal Counsel.",
        neighbors: [{ nodeId: "F2_CORRIDOR_2", weight: 25 }],
      },
      F2_ALLIED_ENG_DEAN: {
        id: "F2_ALLIED_ENG_DEAN",
        name: "Dean's Office (Allied Engineering)",
        floor: 2,
        building: "MAIN",
        x: 380,
        y: 220,
        type: "room",
        category: "office",
        description: "Dean's office for Civil, Electrical, and Mechanical Engineering.",
        neighbors: [{ nodeId: "F2_CORRIDOR_2", weight: 25 }],
      },

      // =========================================================================
      // FLOOR 3: College of Criminology, Commerce (CBE), College Library
      // =========================================================================
      F3_ELEVATOR: {
        id: "F3_ELEVATOR",
        name: "Main Elevator Bank (Floor 3)",
        floor: 3,
        building: "MAIN",
        x: 246,
        y: 284,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 3rd Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 35 },
          { nodeId: "F2_ELEVATOR", weight: 15 },
          { nodeId: "F3_CORRIDOR_1", weight: 20 },
          { nodeId: "F4_ELEVATOR", weight: 15 },
          { nodeId: "F5_ELEVATOR", weight: 25 },
          { nodeId: "F6_ELEVATOR", weight: 35 },
          { nodeId: "F7_ELEVATOR", weight: 45 },
        ],
      },
      F3_STAIRS: {
        id: "F3_STAIRS",
        name: "Central Staircase (Floor 3)",
        floor: 3,
        building: "MAIN",
        x: 238,
        y: 270,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 3rd Floor.",
        neighbors: [
          { nodeId: "F2_STAIRS", weight: 30 },
          { nodeId: "F3_CORRIDOR_1", weight: 20 },
          { nodeId: "F4_STAIRS", weight: 30 },
        ],
      },
      F3_CORRIDOR_1: {
        id: "F3_CORRIDOR_1",
        name: "Floor 3 Central Corridor",
        floor: 3,
        building: "MAIN",
        x: 449,
        y: 323,
        type: "corridor",
        category: "facility",
        description: "Central corridor outside College Library and Criminology rooms.",
        neighbors: [
          { nodeId: "F3_STAIRS", weight: 20 },
          { nodeId: "F3_ELEVATOR", weight: 20 },
          { nodeId: "F3_COLLEGE_LIB", weight: 30 },
          { nodeId: "F3_CRIM_AVR_2", weight: 35 },
          { nodeId: "F3_ROOM_366", weight: 25 },
          { nodeId: "F3_ROOM_335", weight: 25 },
          { nodeId: "F3_CISCO_LAB", weight: 30 },
        ],
      },
      F3_COLLEGE_LIB: {
        id: "F3_COLLEGE_LIB",
        name: "College Library & Study Commons",
        floor: 3,
        building: "DON_MANUEL",
        x: 536,
        y: 200,
        type: "facility",
        category: "facility",
        description: "College department book collection and quiet research commons.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 30 }],
      },
      F3_CRIM_AVR_2: {
        id: "F3_CRIM_AVR_2",
        name: "Criminology Audio-Visual Hall (AVR 2)",
        floor: 3,
        building: "CTS",
        x: 668,
        y: 124,
        type: "room",
        category: "classroom",
        description: "Amphitheater for moot court trials and criminology assemblies.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 35 }],
      },
      F3_ROOM_366: {
        id: "F3_ROOM_366",
        name: "Classrooms 363-367",
        floor: 3,
        building: "CTS",
        x: 639,
        y: 315,
        type: "room",
        category: "classroom",
        description: "Commerce and Accountancy lecture halls.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 25 }],
      },
      F3_ROOM_335: {
        id: "F3_ROOM_335",
        name: "Classrooms 333-338",
        floor: 3,
        building: "MAIN",
        x: 285,
        y: 182,
        type: "room",
        category: "classroom",
        description: "Criminology and forensic theory classrooms.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 25 }],
      },
      F3_CISCO_LAB: {
        id: "F3_CISCO_LAB",
        name: "Cisco Networking Lab 301 (CL3)",
        floor: 3,
        building: "MAIN",
        x: 488,
        y: 480,
        type: "room",
        category: "lab",
        description: "Hands-on CCNA networking lab with hardware racks.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 30 }],
      },

      // =========================================================================
      // FLOOR 4: High School Library & Engineering Labs
      // =========================================================================
      F4_ELEVATOR: {
        id: "F4_ELEVATOR",
        name: "Main Elevator Bank (Floor 4)",
        floor: 4,
        building: "MAIN",
        x: 246,
        y: 284,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 4th Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 45 },
          { nodeId: "F3_ELEVATOR", weight: 15 },
          { nodeId: "F4_CORRIDOR_1", weight: 20 },
          { nodeId: "F5_ELEVATOR", weight: 15 },
          { nodeId: "F6_ELEVATOR", weight: 25 },
          { nodeId: "F7_ELEVATOR", weight: 35 },
        ],
      },
      F4_STAIRS: {
        id: "F4_STAIRS",
        name: "Central Staircase (Floor 4)",
        floor: 4,
        building: "MAIN",
        x: 240,
        y: 270,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 4th Floor.",
        neighbors: [
          { nodeId: "F3_STAIRS", weight: 30 },
          { nodeId: "F4_CORRIDOR_1", weight: 20 },
          { nodeId: "F5_STAIRS", weight: 30 },
        ],
      },
      F4_CORRIDOR_1: {
        id: "F4_CORRIDOR_1",
        name: "Floor 4 Engineering Corridor",
        floor: 4,
        building: "MAIN",
        x: 450,
        y: 420,
        type: "corridor",
        category: "facility",
        description: "Main corridor accessing Engineering labs and HS Library.",
        neighbors: [
          { nodeId: "F4_STAIRS", weight: 20 },
          { nodeId: "F4_ELEVATOR", weight: 20 },
          { nodeId: "F4_HS_LIB", weight: 35 },
          { nodeId: "F4_ROOM_451", weight: 35 },
          { nodeId: "F4_MICROPROCESSOR_LAB", weight: 30 },
          { nodeId: "F4_DIGITAL_LAB", weight: 30 },
          { nodeId: "F4_AV_HALL_401", weight: 35 },
        ],
      },
      F4_HS_LIB: {
        id: "F4_HS_LIB",
        name: "High School Library (Floor 4)",
        floor: 4,
        building: "DON_MANUEL",
        x: 804,
        y: 507,
        type: "facility",
        category: "facility",
        description: "Junior and Senior High School textbook collection and study hall.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 35 }],
      },
      F4_ROOM_451: {
        id: "F4_ROOM_451",
        name: "Room 451 & Faculty Room",
        floor: 4,
        building: "DON_MANUEL",
        x: 972,
        y: 506,
        type: "room",
        category: "classroom",
        description: "Senior High School lecture classroom 451 and faculty consultation desk.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 35 }],
      },
      F4_MICROPROCESSOR_LAB: {
        id: "F4_MICROPROCESSOR_LAB",
        name: "Microprocessor & Embedded Systems Lab",
        floor: 4,
        building: "MAIN",
        x: 756,
        y: 596,
        type: "room",
        category: "lab",
        description: "Computer Engineering lab equipped with microcontroller trainer kits.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 30 }],
      },
      F4_DIGITAL_LAB: {
        id: "F4_DIGITAL_LAB",
        name: "Digital Circuits & Machine Design Lab",
        floor: 4,
        building: "MAIN",
        x: 689,
        y: 582,
        type: "room",
        category: "lab",
        description: "Hardware logic gates and digital machine design lab.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 30 }],
      },
      F4_AV_HALL_401: {
        id: "F4_AV_HALL_401",
        name: "CCS Multipurpose AV Hall 401",
        floor: 4,
        building: "MAIN",
        x: 420,
        y: 560,
        type: "room",
        category: "classroom",
        description: "Amphitheater for college conferences and hackathons (Cap: 180).",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 35 }],
      },

      // =========================================================================
      // FLOOR 5: College of Computer Studies (CCS) & Natural Sciences
      // =========================================================================
      F5_ELEVATOR: {
        id: "F5_ELEVATOR",
        name: "Main Elevator Bank (Floor 5)",
        floor: 5,
        building: "MAIN",
        x: 246,
        y: 284,
        type: "elevator",
        category: "facility",
        description: "Elevator access point for College of Computer Studies.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 55 },
          { nodeId: "F4_ELEVATOR", weight: 15 },
          { nodeId: "F5_CORRIDOR_1", weight: 20 },
          { nodeId: "F6_ELEVATOR", weight: 15 },
          { nodeId: "F7_ELEVATOR", weight: 25 },
        ],
      },
      F5_STAIRS: {
        id: "F5_STAIRS",
        name: "Central Staircase (Floor 5)",
        floor: 5,
        building: "MAIN",
        x: 185,
        y: 281,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 5th Floor (CCS Department).",
        neighbors: [
          { nodeId: "F4_STAIRS", weight: 30 },
          { nodeId: "F5_CORRIDOR_1", weight: 20 },
          { nodeId: "F6_STAIRS", weight: 30 },
        ],
      },
      F5_CORRIDOR_1: {
        id: "F5_CORRIDOR_1",
        name: "Floor 5 Central Innovation Spine",
        floor: 5,
        building: "MAIN",
        x: 321,
        y: 423,
        type: "corridor",
        category: "facility",
        description: "Main corridor outside CCS Dean's office and Smart Classrooms.",
        neighbors: [
          { nodeId: "F5_STAIRS", weight: 20 },
          { nodeId: "F5_ELEVATOR", weight: 20 },
          { nodeId: "F5_CORRIDOR_2", weight: 25 },
          { nodeId: "F5_LECTURE_538", weight: 25 },
          { nodeId: "F5_DEAN_OFFICE", weight: 25 },
          { nodeId: "F5_CHEMISTRY_LAB", weight: 35 },
          { nodeId: "F5_ROOM_519_520", weight: 30 },
        ],
      },
      F5_CORRIDOR_2: {
        id: "F5_CORRIDOR_2",
        name: "Floor 5 East Corridor",
        floor: 5,
        building: "DON_MANUEL",
        x: 406,
        y: 336,
        type: "corridor",
        category: "facility",
        description: "Corridor accessing Canteen, Speech Lab, and Botanical Garden.",
        neighbors: [
          { nodeId: "F5_CORRIDOR_1", weight: 25 },
          { nodeId: "F5_CANTEEN", weight: 25 },
          { nodeId: "F5_SPEECH_LAB", weight: 30 },
          { nodeId: "F5_BOTANICAL_GARDEN", weight: 40 },
        ],
      },
      F5_LECTURE_538: {
        id: "F5_LECTURE_538",
        name: "CCS Smart Classroom 538",
        floor: 5,
        building: "MAIN",
        x: 240,
        y: 440,
        type: "room",
        category: "classroom",
        description: "Premier 5th floor smart classroom equipped with interactive displays (Cap: 65).",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 25 }],
      },
      F5_DEAN_OFFICE: {
        id: "F5_DEAN_OFFICE",
        name: "Dean's Office (College of Computer Studies)",
        floor: 5,
        building: "MAIN",
        x: 360,
        y: 420,
        type: "room",
        category: "office",
        description: "Office of the Dean, CCS Chairs, and faculty departmental desks.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 25 }],
      },
      F5_ROOM_519_520: {
        id: "F5_ROOM_519_520",
        name: "Classrooms 517, 519, 520",
        floor: 5,
        building: "MAIN",
        x: 450,
        y: 710,
        type: "room",
        category: "classroom",
        description: "Computer Studies lecture and programming rooms.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 30 }],
      },
      F5_CHEMISTRY_LAB: {
        id: "F5_CHEMISTRY_LAB",
        name: "Chemistry & Physics Laboratory (Room 533-537)",
        floor: 5,
        building: "DON_MANUEL",
        x: 202,
        y: 201,
        type: "room",
        category: "lab",
        description: "Equipped chemistry lab with titration benches and fume hoods.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 35 }],
      },
      F5_CANTEEN: {
        id: "F5_CANTEEN",
        name: "Floor 5 Refreshment Canteen",
        floor: 5,
        building: "MAIN",
        x: 511,
        y: 241,
        type: "facility",
        category: "amenity",
        description: "Fifth floor snack counter and student lounge.",
        neighbors: [{ nodeId: "F5_CORRIDOR_2", weight: 25 }],
      },
      F5_SPEECH_LAB: {
        id: "F5_SPEECH_LAB",
        name: "Digital Speech & Language Lab",
        floor: 5,
        building: "MAIN",
        x: 420,
        y: 560,
        type: "room",
        category: "lab",
        description: "Acoustic booths for oral communication and linguistics courses.",
        neighbors: [{ nodeId: "F5_CORRIDOR_2", weight: 30 }],
      },
      F5_BOTANICAL_GARDEN: {
        id: "F5_BOTANICAL_GARDEN",
        name: "Biology Botanical Garden",
        floor: 5,
        building: "CTS",
        x: 920,
        y: 440,
        type: "facility",
        category: "facility",
        description: "Rooftop greenhouse and botanical research collection.",
        neighbors: [{ nodeId: "F5_CORRIDOR_2", weight: 40 }],
      },

      // =========================================================================
      // FLOOR 6: Hotel & Restaurant Management (HRM) & Food Labs
      // =========================================================================
      F6_ELEVATOR: {
        id: "F6_ELEVATOR",
        name: "Main Elevator Bank (Floor 6)",
        floor: 6,
        building: "MAIN",
        x: 246,
        y: 284,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 6th Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 65 },
          { nodeId: "F5_ELEVATOR", weight: 15 },
          { nodeId: "F6_CORRIDOR_1", weight: 20 },
          { nodeId: "F7_ELEVATOR", weight: 15 },
        ],
      },
      F6_STAIRS: {
        id: "F6_STAIRS",
        name: "Central Staircase (Floor 6)",
        floor: 6,
        building: "MAIN",
        x: 376,
        y: 612,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 6th Floor (HRM Department).",
        neighbors: [
          { nodeId: "F5_STAIRS", weight: 30 },
          { nodeId: "F6_CORRIDOR_1", weight: 20 },
          { nodeId: "F7_STAIRS", weight: 30 },
        ],
      },
      F6_CORRIDOR_1: {
        id: "F6_CORRIDOR_1",
        name: "Floor 6 Culinary Corridor",
        floor: 6,
        building: "MAIN",
        x: 276,
        y: 402,
        type: "corridor",
        category: "facility",
        description: "Access corridor for commercial kitchens and baking labs.",
        neighbors: [
          { nodeId: "F6_STAIRS", weight: 20 },
          { nodeId: "F6_ELEVATOR", weight: 20 },
          { nodeId: "F6_CORRIDOR_2", weight: 25 },
          { nodeId: "F6_KITCHEN_LAB_1", weight: 25 },
          { nodeId: "F6_BAKING_LAB", weight: 25 },
          { nodeId: "F6_ROOM_611_616", weight: 30 },
        ],
      },
      F6_CORRIDOR_2: {
        id: "F6_CORRIDOR_2",
        name: "Floor 6 Restaurant & Bar Corridor",
        floor: 6,
        building: "DON_MANUEL",
        x: 357,
        y: 298,
        type: "corridor",
        category: "facility",
        description: "Corridor leading to UC Bar and Restaurant simulation.",
        neighbors: [
          { nodeId: "F6_CORRIDOR_1", weight: 25 },
          { nodeId: "F6_UC_BAR", weight: 30 },
          { nodeId: "F6_UC_RESTAURANT", weight: 35 },
          { nodeId: "F6_ROOM_651_659", weight: 30 },
        ],
      },
      F6_KITCHEN_LAB_1: {
        id: "F6_KITCHEN_LAB_1",
        name: "Commercial Kitchen Lab 1",
        floor: 6,
        building: "MAIN",
        x: 340,
        y: 440,
        type: "room",
        category: "lab",
        description: "Heavy-duty commercial cooking ranges and prep stations.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 25 }],
      },
      F6_BAKING_LAB: {
        id: "F6_BAKING_LAB",
        name: "Baking & Pastry Arts Lab",
        floor: 6,
        building: "MAIN",
        x: 220,
        y: 440,
        type: "room",
        category: "lab",
        description: "Professional pastry ovens, mixers, and tempering benches.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 25 }],
      },
      F6_ROOM_611_616: {
        id: "F6_ROOM_611_616",
        name: "Classrooms 611-616",
        floor: 6,
        building: "MAIN",
        x: 502,
        y: 636,
        type: "room",
        category: "classroom",
        description: "Hospitality and tourism lecture classrooms.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 30 }],
      },
      F6_UC_BAR: {
        id: "F6_UC_BAR",
        name: "UC Bartending & Mixology Suite",
        floor: 6,
        building: "DON_MANUEL",
        x: 720,
        y: 440,
        type: "room",
        category: "lab",
        description: "Beverage service training bar and mocktail stations.",
        neighbors: [{ nodeId: "F6_CORRIDOR_2", weight: 30 }],
      },
      F6_UC_RESTAURANT: {
        id: "F6_UC_RESTAURANT",
        name: "UC Dining Room & Restaurant Simulation",
        floor: 6,
        building: "DON_MANUEL",
        x: 850,
        y: 440,
        type: "room",
        category: "classroom",
        description: "Fine dining simulation banquet hall.",
        neighbors: [{ nodeId: "F6_CORRIDOR_2", weight: 35 }],
      },
      F6_ROOM_651_659: {
        id: "F6_ROOM_651_659",
        name: "Classrooms 651-659",
        floor: 6,
        building: "DON_MANUEL",
        x: 501,
        y: 480,
        type: "room",
        category: "classroom",
        description: "HRM and general education classrooms.",
        neighbors: [{ nodeId: "F6_CORRIDOR_2", weight: 30 }],
      },

      // =========================================================================
      // FLOOR 7: Seventh Floor / Roof Deck Gym & HRM Mini Hotel
      // =========================================================================
      F7_ELEVATOR: {
        id: "F7_ELEVATOR",
        name: "Main Elevator Bank (Floor 7)",
        floor: 7,
        building: "MAIN",
        x: 337,
        y: 334,
        type: "elevator",
        category: "facility",
        description: "Top floor elevator landing.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 75 },
          { nodeId: "F6_ELEVATOR", weight: 15 },
          { nodeId: "F7_CORRIDOR_1", weight: 20 },
        ],
      },
      F7_STAIRS: {
        id: "F7_STAIRS",
        name: "Central Staircase (Floor 7)",
        floor: 7,
        building: "MAIN",
        x: 352,
        y: 326,
        type: "stairs",
        category: "facility",
        description: "Top floor staircase landing for Roof Deck and Mini Hotel.",
        neighbors: [
          { nodeId: "F6_STAIRS", weight: 30 },
          { nodeId: "F7_CORRIDOR_1", weight: 20 },
        ],
      },
      F7_CORRIDOR_1: {
        id: "F7_CORRIDOR_1",
        name: "Floor 7 Rooftop Foyer",
        floor: 7,
        building: "MAIN",
        x: 444,
        y: 416,
        type: "corridor",
        category: "facility",
        description: "Access foyer to High School Roof Deck Gym and HRM Mini Hotel.",
        neighbors: [
          { nodeId: "F7_STAIRS", weight: 20 },
          { nodeId: "F7_ELEVATOR", weight: 20 },
          { nodeId: "F7_CORRIDOR_2", weight: 25 },
          { nodeId: "F7_HRM_MINI_HOTEL", weight: 25 },
          { nodeId: "F7_PE_ROOM_722", weight: 25 },
          { nodeId: "F7_ROOM_730", weight: 25 },
        ],
      },
      F7_CORRIDOR_2: {
        id: "F7_CORRIDOR_2",
        name: "Floor 7 Roof Deck Gym Access Way",
        floor: 7,
        building: "HIGHSCHOOL",
        x: 527,
        y: 325,
        type: "corridor",
        category: "facility",
        description: "Walkway leading to High School Roof Deck Gym.",
        neighbors: [
          { nodeId: "F7_CORRIDOR_1", weight: 25 },
          { nodeId: "F7_ROOF_DECK_GYM", weight: 35 },
          { nodeId: "F7_ROOM_733_734", weight: 25 },
        ],
      },
      F7_HRM_MINI_HOTEL: {
        id: "F7_HRM_MINI_HOTEL",
        name: "HRM Mini Hotel Suite & Front Office",
        floor: 7,
        building: "MAIN",
        x: 320,
        y: 440,
        type: "room",
        category: "lab",
        description: "Simulated executive hotel suite and housekeeping suite.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 25 }],
      },
      F7_PE_ROOM_722: {
        id: "F7_PE_ROOM_722",
        name: "PE Rooms 722-724 & Criminology Dean",
        floor: 7,
        building: "MAIN",
        x: 391,
        y: 733,
        type: "room",
        category: "classroom",
        description: "Physical Education classrooms and Dean's office.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 25 }],
      },
      F7_ROOM_730: {
        id: "F7_ROOM_730",
        name: "Room 730 A, B, C",
        floor: 7,
        building: "MAIN",
        x: 423,
        y: 374,
        type: "room",
        category: "classroom",
        description: "Lecture and seminar rooms 730A, 730B, 730C.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 25 }],
      },
      F7_ROOM_733_734: {
        id: "F7_ROOM_733_734",
        name: "Rooms 733, 734",
        floor: 7,
        building: "MAIN",
        x: 565,
        y: 375,
        type: "room",
        category: "classroom",
        description: "Classrooms 733 and 734.",
        neighbors: [{ nodeId: "F7_CORRIDOR_2", weight: 25 }],
      },
      F7_ROOF_DECK_GYM: {
        id: "F7_ROOF_DECK_GYM",
        name: "High School Roof Deck Gymnasium",
        floor: 7,
        building: "HIGHSCHOOL",
        x: 656,
        y: 467,
        type: "facility",
        category: "facility",
        description: "Rooftop basketball court, athletics arena, and physical education open deck.",
        neighbors: [{ nodeId: "F7_CORRIDOR_2", weight: 35 }],
      },
    };
  }
}

/**
 * Mapping table from user/schedule room codes to primary graph node IDs across all 8 floors.
 */
export const ROOM_NODE_MAPPING: Record<string, string> = {
  // Floor 7
  "MINI HOTEL": "F7_HRM_MINI_HOTEL",
  "HRM HOTEL": "F7_HRM_MINI_HOTEL",
  "ROOF DECK": "F7_ROOF_DECK_GYM",
  "GYM": "F7_ROOF_DECK_GYM",
  "ROOF DECK GYM": "F7_ROOF_DECK_GYM",
  "722": "F7_PE_ROOM_722",
  "724": "F7_PE_ROOM_722",
  "ROOM 722": "F7_PE_ROOM_722",
  "ROOM 724": "F7_PE_ROOM_722",
  "730": "F7_ROOM_730",
  "730A": "F7_ROOM_730",
  "730B": "F7_ROOM_730",
  "730C": "F7_ROOM_730",
  "733": "F7_ROOM_733_734",
  "734": "F7_ROOM_733_734",

  // Floor 6
  "KITCHEN LAB 1": "F6_KITCHEN_LAB_1",
  "KITCHEN 1": "F6_KITCHEN_LAB_1",
  "BAKING LAB": "F6_BAKING_LAB",
  "PASTRY LAB": "F6_BAKING_LAB",
  "UC BAR": "F6_UC_BAR",
  "BARTENDING": "F6_UC_BAR",
  "UC RESTAURANT": "F6_UC_RESTAURANT",
  "RESTAURANT": "F6_UC_RESTAURANT",
  "611": "F6_ROOM_611_616",
  "612": "F6_ROOM_611_616",
  "613": "F6_ROOM_611_616",
  "614": "F6_ROOM_611_616",
  "615": "F6_ROOM_611_616",
  "616": "F6_ROOM_611_616",
  "651": "F6_ROOM_651_659",
  "652": "F6_ROOM_651_659",
  "653": "F6_ROOM_651_659",
  "654": "F6_ROOM_651_659",
  "655": "F6_ROOM_651_659",
  "656": "F6_ROOM_651_659",
  "657": "F6_ROOM_651_659",
  "658": "F6_ROOM_651_659",
  "659": "F6_ROOM_651_659",

  // Floor 5
  "CCS 538": "F5_LECTURE_538",
  "538": "F5_LECTURE_538",
  "ROOM 538": "F5_LECTURE_538",
  "CCS DEAN": "F5_DEAN_OFFICE",
  "SPEECH LAB": "F5_SPEECH_LAB",
  "CHEMISTRY LAB": "F5_CHEMISTRY_LAB",
  "533": "F5_CHEMISTRY_LAB",
  "534": "F5_CHEMISTRY_LAB",
  "535": "F5_CHEMISTRY_LAB",
  "536": "F5_CHEMISTRY_LAB",
  "537": "F5_CHEMISTRY_LAB",
  "517": "F5_ROOM_519_520",
  "519": "F5_ROOM_519_520",
  "520": "F5_ROOM_519_520",
  "521": "F5_ROOM_519_520",
  "522": "F5_ROOM_519_520",
  "523": "F5_ROOM_519_520",
  "BOTANICAL GARDEN": "F5_BOTANICAL_GARDEN",

  // Floor 4
  "HS LIBRARY": "F4_HS_LIB",
  "MICROPROCESSOR": "F4_MICROPROCESSOR_LAB",
  "DIGITAL LAB": "F4_DIGITAL_LAB",
  "CCS 401": "F4_AV_HALL_401",
  "AV HALL 401": "F4_AV_HALL_401",
  "451": "F4_ROOM_451",
  "452": "F4_ROOM_451",
  "453": "F4_ROOM_451",
  "454": "F4_ROOM_451",
  "455": "F4_ROOM_451",
  "456": "F4_ROOM_451",
  "457": "F4_ROOM_451",
  "458": "F4_ROOM_451",

  // Floor 3
  "COLLEGE LIBRARY": "F3_COLLEGE_LIB",
  "CRIMINOLOGY AVR": "F3_CRIM_AVR_2",
  "AVR 2": "F3_CRIM_AVR_2",
  "CISCO LAB": "F3_CISCO_LAB",
  "CCS 301": "F3_CISCO_LAB",
  "363": "F3_ROOM_366",
  "364": "F3_ROOM_366",
  "366": "F3_ROOM_366",
  "367": "F3_ROOM_366",
  "333": "F3_ROOM_335",
  "335": "F3_ROOM_335",
  "336": "F3_ROOM_335",
  "337": "F3_ROOM_335",
  "338": "F3_ROOM_335",

  // Floor 2
  "MAIN LIBRARY": "F2_MAIN_LIB",
  "ENGINEERING DEAN": "F2_ALLIED_ENG_DEAN",
  "CHANCELLOR": "F2_CHANCELLOR_OFFICE",
  "PSYCHOLOGY LAB": "F2_PSYCHOLOGY_LAB",
  "219": "F2_PSYCHOLOGY_LAB",
  "PROG LAB 201": "F2_PROG_LAB_201",
  "CCS 201": "F2_PROG_LAB_201",
  "217": "F2_ROOM_218_219",
  "218": "F2_ROOM_218_219",
  "221": "F2_ROOM_218_219",
  "222": "F2_ROOM_218_219",
  "223": "F2_ROOM_218_219",
  "224": "F2_ROOM_218_219",
  "225": "F2_ROOM_218_219",
  "226": "F2_ROOM_218_219",
  "227": "F2_ROOM_218_219",
  "228": "F2_ROOM_218_219",
  "229": "F2_ROOM_218_219",
  "230": "F2_ROOM_218_219",
  "231": "F2_ROOM_218_219",
  "232": "F2_ROOM_218_219",

  // Mezzanine Floor
  "CTE DEAN": "FM_CTE_DEAN",
  "EDUCATION DEAN": "FM_CTE_DEAN",
  "GRADUATE LIBRARY": "FM_GRAD_SCHOOL_LIB",
  "CHAPEL": "FM_CHAPEL",
  "M18": "FM_M18",
  "M27": "FM_M27_M29",
  "M27A": "FM_M27_M29",
  "M27B": "FM_M27_M29",
  "M28": "FM_M27_M29",
  "M29": "FM_M27_M29",
  "COMP LAB 3": "FM_COMP_LAB_3",

  // Floor 1
  "GATE 1": "F1_GATE1",
  "GATE 2": "F1_GATE2",
  "GATE 3": "F1_GATE3",
  "GATE 4": "F1_GATE4",
  "MAIN ENTRANCE": "F1_GATE1",
  "REGISTRAR": "F1_REGISTRAR",
  "CASHIER": "F1_CASHIER",
  "ACCOUNTING": "F1_ACCOUNTING",
  "CLINIC": "F1_CLINIC",
  "DENTAL CLINIC": "F1_CLINIC",
  "MEDICAL CLINIC": "F1_CLINIC",
  "HS ACTIVITY CENTER": "F1_HS_ACTIVITY_CENTER",
  "ACTIVITY CENTER": "F1_HS_ACTIVITY_CENTER",
  "STUDY HALL": "F1_STUDY_HALL",
  "EDP": "F1_STUDY_HALL",
  "MAC LAB 101": "F1_MAC_LAB_101",
  "MAC LAB": "F1_MAC_LAB_101",
  "CL1": "F1_MAC_LAB_101",
  "CANTEEN": "F1_CANTEEN",
  "CARPENTRY": "F1_CARPENTRY",
};

/**
 * Resolves a room code string into a valid graph node ID.
 */
export function getGraphNodeForRoom(roomCode: string): string {
  if (!roomCode) return "F5_LECTURE_538";
  const upperRoom = roomCode.toUpperCase().trim();
  return ROOM_NODE_MAPPING[upperRoom] || "F5_LECTURE_538";
}
